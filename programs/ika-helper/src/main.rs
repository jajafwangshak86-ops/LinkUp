//! Thin CLI wrapper around the Ika gRPC client.
//!
//! The Node.js backend shells out to this binary because the Ika gRPC
//! protocol uses BCS serialization (Rust-native). This binary handles
//! all BCS encoding/decoding and returns plain JSON to stdout.
//!
//! Build:
//!   cargo build --release --manifest-path programs/ika-helper/Cargo.toml
//!   cp target/release/ika-dwallet-helper bin/

use clap::{Parser, Subcommand};
use ika_grpc::d_wallet_service_client::DWalletServiceClient;
use ika_grpc::UserSignedRequest;
use ika_dwallet_types::{
    ChainId, DWalletCurve, DWalletRequest, NetworkSignedAttestation,
    SignedRequestData, TransactionResponseData, UserSecretKeyShare,
    UserSignature, VersionedDWalletDataAttestation,
};
use serde::Serialize;

const IKA_GRPC_DEFAULT: &str = "https://pre-alpha-dev-1.ika.ika-network.net:443";
const DEVNET_RPC_DEFAULT: &str = "https://api.devnet.solana.com";

// ─── CLI ─────────────────────────────────────────────────────────────────────

#[derive(Parser)]
#[command(name = "ika-dwallet-helper")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Run DKG and create a new dWallet. Prints JSON to stdout.
    CreateDwallet {
        #[arg(long, default_value = IKA_GRPC_DEFAULT)]
        grpc: String,
        #[arg(long, default_value = DEVNET_RPC_DEFAULT)]
        _rpc: String,
        /// Base64-encoded 64-byte keypair secret key
        #[arg(long)]
        keypair: String,
    },
}

// ─── Output ──────────────────────────────────────────────────────────────────

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct DWalletInfo {
    d_wallet_id: String,
    public_key: String,
    attestation: String,
}

// ─── Main ────────────────────────────────────────────────────────────────────

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cli = Cli::parse();
    match cli.command {
        Commands::CreateDwallet { grpc, keypair, .. } => {
            let info = create_dwallet(&grpc, &keypair).await?;
            println!("{}", serde_json::to_string(&info)?);
        }
    }
    Ok(())
}

async fn create_dwallet(grpc_endpoint: &str, keypair_b64: &str) -> anyhow::Result<DWalletInfo> {
    let mut client = DWalletServiceClient::connect(grpc_endpoint.to_string()).await?;

    let secret = base64::decode(keypair_b64)?;
    let keypair = ed25519_dalek::Keypair::from_bytes(&secret)?;
    let pubkey_bytes = keypair.public.to_bytes().to_vec();

    // Session identifier — random 32 bytes (uniqueness nonce)
    let session: [u8; 32] = rand::random();

    // Build DKG request.
    // The pre-alpha mock server accepts vec![0u8; 32] for all crypto fields
    // (confirmed by the official e2e example in protocols-e2e/src/main.rs).
    // Real crypto material will be required on mainnet.
    let request = DWalletRequest::DKG {
        dwallet_network_encryption_public_key: vec![0u8; 32],
        curve: DWalletCurve::Secp256k1,
        centralized_public_key_share_and_proof: vec![0u8; 32],
        user_secret_key_share: UserSecretKeyShare::Encrypted {
            encrypted_centralized_secret_share_and_proof: vec![0u8; 32],
            encryption_key: vec![0u8; 32],
            signer_public_key: pubkey_bytes.clone(),
        },
        user_public_output: vec![0u8; 32],
        sign_during_dkg_request: None,
    };

    let signed_data = SignedRequestData {
        session_identifier_preimage: session,
        epoch: 1,
        chain_id: ChainId::Solana,
        intended_chain_sender: pubkey_bytes.clone(),
        request,
    };

    let signed_data_bytes = bcs::to_bytes(&signed_data)?;

    // Pre-alpha mock accepts a zero signature — real mainnet will verify
    let user_sig = UserSignature::Ed25519 {
        signature: vec![0u8; 64],
        public_key: pubkey_bytes,
    };

    let resp = client.submit_transaction(UserSignedRequest {
        user_signature: bcs::to_bytes(&user_sig)?,
        signed_request_data: signed_data_bytes,
    }).await?;

    let response: TransactionResponseData =
        bcs::from_bytes(&resp.into_inner().response_data)?;

    match response {
        TransactionResponseData::Attestation(ref attestation) => {
            let versioned: VersionedDWalletDataAttestation =
                bcs::from_bytes(&attestation.attestation_data)?;
            let VersionedDWalletDataAttestation::V1(ref data) = versioned;

            Ok(DWalletInfo {
                // In pre-alpha the dWallet is identified by the session identifier
                d_wallet_id: bs58::encode(&data.session_identifier).into_string(),
                public_key:  bs58::encode(&data.public_key).into_string(),
                attestation:  base64::encode(bcs::to_bytes(attestation)?),
            })
        }
        TransactionResponseData::Error { message } => {
            anyhow::bail!("Ika DKG error: {}", message)
        }
        _ => anyhow::bail!("Unexpected response type from DKG"),
    }
}
