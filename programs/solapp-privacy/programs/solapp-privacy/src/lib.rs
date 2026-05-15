use anchor_lang::prelude::*;
use encrypt_anchor::EncryptContext;
use encrypt_dsl::prelude::encrypt_fn;
use encrypt_types::encrypted::{EUint64};

declare_id!("11111111111111111111111111111112"); // replace after `anchor deploy`

pub const ENCRYPT_CPI_SEED: &[u8] = b"__encrypt_cpi_authority";

// ─── FHE Function ────────────────────────────────────────────────────────────

/// Confidential transfer between two encrypted balances.
///
/// The `#[encrypt_fn]` macro compiles this into an FHE computation graph.
/// Validators never see the actual amounts — only ciphertexts.
#[encrypt_fn]
fn confidential_transfer(
    sender_balance: EUint64,
    receiver_balance: EUint64,
    amount: EUint64,
) -> (EUint64, EUint64) {
    let has_funds    = sender_balance >= amount;
    let new_sender   = if has_funds { sender_balance   - amount } else { sender_balance };
    let new_receiver = if has_funds { receiver_balance + amount } else { receiver_balance };
    (new_sender, new_receiver)
}

// ─── Program ─────────────────────────────────────────────────────────────────

#[program]
pub mod solapp_privacy {
    use super::*;

    /// Initialise on-chain state linking a chat ID to both participants.
    /// Must be called once before the first private tip in a chat.
    pub fn init_chat_balances(
        ctx: Context<InitChatBalances>,
        chat_id: [u8; 32],
    ) -> Result<()> {
        let record      = &mut ctx.accounts.chat_record;
        record.chat_id  = chat_id;
        record.sender   = ctx.accounts.sender.key();
        record.receiver = ctx.accounts.receiver.key();
        record.bump     = ctx.bumps.chat_record;
        Ok(())
    }

    /// Execute a private tip inside a chat.
    ///
    /// Input ciphertext accounts are created off-chain via the Encrypt gRPC
    /// client before this instruction is called. The FHE executor evaluates
    /// the `confidential_transfer` graph and commits new ciphertexts for both
    /// balances — no plaintext amount ever appears on-chain.
    pub fn execute_private_tip(
        ctx: Context<PrivateTip>,
        cpi_authority_bump: u8,
    ) -> Result<()> {
        let encrypt_ctx = EncryptContext {
            encrypt_program:        ctx.accounts.encrypt_program.to_account_info(),
            config:                 ctx.accounts.config.to_account_info(),
            deposit:                ctx.accounts.deposit.to_account_info(),
            cpi_authority:          ctx.accounts.cpi_authority.to_account_info(),
            caller_program:         ctx.accounts.caller_program.to_account_info(),
            network_encryption_key: ctx.accounts.network_encryption_key.to_account_info(),
            payer:                  ctx.accounts.payer.to_account_info(),
            event_authority:        ctx.accounts.event_authority.to_account_info(),
            system_program:         ctx.accounts.system_program.to_account_info(),
            cpi_authority_bump,
        };

        // Clone is fine — Anchor's AccountInfo implements Clone.
        // Inputs:  sender_balance_ct, receiver_balance_ct, tip_amount_ct
        // Outputs: new_sender_balance_ct, new_receiver_balance_ct
        let sender_balance_ct   = ctx.accounts.sender_balance_ct.to_account_info();
        let receiver_balance_ct = ctx.accounts.receiver_balance_ct.to_account_info();
        let tip_amount_ct       = ctx.accounts.tip_amount_ct.to_account_info();
        let new_sender_ct       = ctx.accounts.new_sender_balance_ct.to_account_info();
        let new_receiver_ct     = ctx.accounts.new_receiver_balance_ct.to_account_info();

        encrypt_ctx.confidential_transfer(
            sender_balance_ct,
            receiver_balance_ct,
            tip_amount_ct,
            new_sender_ct,
            new_receiver_ct,
        )?;

        emit!(PrivateTipExecuted {
            chat_id: ctx.accounts.chat_record.chat_id,
            sender:  ctx.accounts.payer.key(),
        });

        Ok(())
    }
}

// ─── Accounts ────────────────────────────────────────────────────────────────

#[derive(Accounts)]
#[instruction(chat_id: [u8; 32])]
pub struct InitChatBalances<'info> {
    #[account(mut)]
    pub sender: Signer<'info>,
    /// CHECK: receiver wallet
    pub receiver: UncheckedAccount<'info>,
    #[account(
        init,
        payer = sender,
        space = 8 + ChatRecord::INIT_SPACE,
        seeds = [b"chat", chat_id.as_ref()],
        bump,
    )]
    pub chat_record: Account<'info, ChatRecord>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PrivateTip<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(has_one = sender, has_one = receiver)]
    pub chat_record: Account<'info, ChatRecord>,
    /// CHECK: sender wallet (validated by chat_record has_one constraint)
    pub sender: UncheckedAccount<'info>,
    /// CHECK: receiver wallet (validated by chat_record has_one constraint)
    pub receiver: UncheckedAccount<'info>,
    /// CHECK: Encrypted sender balance ciphertext account
    #[account(mut)]
    pub sender_balance_ct: UncheckedAccount<'info>,
    /// CHECK: Encrypted receiver balance ciphertext account
    #[account(mut)]
    pub receiver_balance_ct: UncheckedAccount<'info>,
    /// CHECK: Encrypted tip amount ciphertext account
    #[account(mut)]
    pub tip_amount_ct: UncheckedAccount<'info>,
    /// CHECK: Output ciphertext account for new sender balance
    #[account(mut)]
    pub new_sender_balance_ct: UncheckedAccount<'info>,
    /// CHECK: Output ciphertext account for new receiver balance
    #[account(mut)]
    pub new_receiver_balance_ct: UncheckedAccount<'info>,
    /// CHECK: Encrypt program
    pub encrypt_program: UncheckedAccount<'info>,
    /// CHECK: Encrypt global config account
    pub config: UncheckedAccount<'info>,
    /// CHECK: Encrypt gas deposit account (writable — fees deducted here)
    #[account(mut)]
    pub deposit: UncheckedAccount<'info>,
    /// CHECK: Encrypt CPI authority PDA
    pub cpi_authority: UncheckedAccount<'info>,
    /// CHECK: This program's own account (must be executable)
    pub caller_program: UncheckedAccount<'info>,
    /// CHECK: Encrypt network encryption key account
    pub network_encryption_key: UncheckedAccount<'info>,
    /// CHECK: Encrypt event authority PDA
    pub event_authority: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// ─── State ───────────────────────────────────────────────────────────────────

#[account]
#[derive(InitSpace)]
pub struct ChatRecord {
    pub chat_id:  [u8; 32],
    pub sender:   Pubkey,
    pub receiver: Pubkey,
    pub bump:     u8,
}

// ─── Events ──────────────────────────────────────────────────────────────────

#[event]
pub struct PrivateTipExecuted {
    pub chat_id: [u8; 32],
    pub sender:  Pubkey,
}

// ─── Errors ──────────────────────────────────────────────────────────────────

#[error_code]
pub enum PrivacyError {
    #[msg("Insufficient encrypted balance")]
    InsufficientBalance,
}
