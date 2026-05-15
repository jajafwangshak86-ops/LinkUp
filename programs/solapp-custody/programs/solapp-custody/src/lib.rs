use anchor_lang::prelude::*;

mod ika_cpi;
use ika_cpi::{DWalletContext, CPI_AUTHORITY_SEED};

declare_id!("11111111111111111111111111111111"); // replace after `anchor deploy`

#[program]
pub mod solapp_custody {
    use super::*;

    /// Called once at sign-up after the Ika network has run DKG.
    /// Transfers the dWallet authority to this program's CPI PDA so that
    /// only `approve_transfer` can ever trigger signing.
    pub fn register_dwallet(
        ctx: Context<RegisterDWallet>,
        cpi_authority_bump: u8,
    ) -> Result<()> {
        let dwallet_ctx = DWalletContext {
            dwallet_program: ctx.accounts.dwallet_program.to_account_info(),
            cpi_authority: ctx.accounts.cpi_authority.to_account_info(),
            caller_program: ctx.accounts.caller_program.to_account_info(),
            cpi_authority_bump,
        };

        dwallet_ctx.transfer_dwallet(
            &ctx.accounts.dwallet.to_account_info(),
            ctx.accounts.cpi_authority.key,
        )?;

        emit!(DWalletRegistered {
            user: ctx.accounts.user.key(),
            dwallet: ctx.accounts.dwallet.key(),
        });

        Ok(())
    }

    /// Called per transfer after the backend has verified all guards
    /// (2FA, spending limits, daily caps).
    ///
    /// Creates a `MessageApproval` PDA. The Ika network detects it and
    /// produces the signature via 2PC-MPC — the backend never holds the
    /// full private key.
    pub fn approve_transfer(
        ctx: Context<ApproveTransfer>,
        message_hash: [u8; 32],
        message_metadata_digest: [u8; 32],
        user_pubkey: [u8; 32],
        message_approval_bump: u8,
        cpi_authority_bump: u8,
    ) -> Result<()> {
        let dwallet_ctx = DWalletContext {
            dwallet_program: ctx.accounts.dwallet_program.to_account_info(),
            cpi_authority: ctx.accounts.cpi_authority.to_account_info(),
            caller_program: ctx.accounts.caller_program.to_account_info(),
            cpi_authority_bump,
        };

        dwallet_ctx.approve_message(
            &ctx.accounts.message_approval.to_account_info(),
            &ctx.accounts.dwallet.to_account_info(),
            &ctx.accounts.payer.to_account_info(),
            &ctx.accounts.system_program.to_account_info(),
            &ctx.accounts.coordinator.to_account_info(),
            user_pubkey,
            message_hash,
            message_metadata_digest,
            1, // Secp256k1 — compatible with Bitcoin, Ethereum, and Solana
            message_approval_bump,
        )?;

        emit!(TransferApproved {
            payer: ctx.accounts.payer.key(),
            dwallet: ctx.accounts.dwallet.key(),
            message_hash,
        });

        Ok(())
    }
}

// ─── Accounts ────────────────────────────────────────────────────────────────

#[derive(Accounts)]
pub struct RegisterDWallet<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    /// CHECK: dWallet account created by the Ika network
    #[account(mut)]
    pub dwallet: UncheckedAccount<'info>,
    /// CHECK: This program's CPI authority PDA
    #[account(seeds = [CPI_AUTHORITY_SEED], bump)]
    pub cpi_authority: UncheckedAccount<'info>,
    /// CHECK: This program's own account (must be executable)
    pub caller_program: UncheckedAccount<'info>,
    /// CHECK: Ika dWallet program
    pub dwallet_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ApproveTransfer<'info> {
    /// Backend hot wallet — the only account that can trigger signing.
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: dWallet account whose authority is this program's CPI PDA
    pub dwallet: UncheckedAccount<'info>,
    /// CHECK: MessageApproval PDA — created by this instruction
    #[account(mut)]
    pub message_approval: UncheckedAccount<'info>,
    /// CHECK: DWalletCoordinator PDA — read-only, used by approve_message CPI
    pub coordinator: UncheckedAccount<'info>,
    /// CHECK: This program's CPI authority PDA
    #[account(seeds = [CPI_AUTHORITY_SEED], bump)]
    pub cpi_authority: UncheckedAccount<'info>,
    /// CHECK: This program's own account (must be executable)
    pub caller_program: UncheckedAccount<'info>,
    /// CHECK: Ika dWallet program
    pub dwallet_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}

// ─── Events ──────────────────────────────────────────────────────────────────

#[event]
pub struct DWalletRegistered {
    pub user: Pubkey,
    pub dwallet: Pubkey,
}

#[event]
pub struct TransferApproved {
    pub payer: Pubkey,
    pub dwallet: Pubkey,
    pub message_hash: [u8; 32],
}

// ─── Errors ──────────────────────────────────────────────────────────────────

#[error_code]
pub enum CustodyError {
    #[msg("dWallet authority transfer failed")]
    TransferFailed,
}
