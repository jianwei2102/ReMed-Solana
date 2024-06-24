use anchor_lang::prelude::*;

declare_id!("AaD2G2x6dkvNsUaHhKM26XBBVBfb76FsFtaZKtt4dnWj");

#[program]
pub mod remed {
    use super::*;

    pub fn add_doc(ctx: Context<AddDoc>, doc: String) -> Result<()> {
        ctx.accounts.permission_list.authorized.push(doc);

        Ok(())
    }

    pub fn remove_doc(ctx: Context<RemoveDoc>, doc: String) -> Result<()> {
        ctx.accounts
            .permission_list
            .authorized
            .retain(|x| x != &doc);
        Ok(())
    }

    pub fn append_record(ctx: Context<AppendRecord>, record: String) -> Result<()> {
        if !ctx.accounts.permission_list.authorized.contains(&ctx.accounts.signer.key().to_string()) {
            return Err(ErrorCode::Unauthorized.into());
        }
        ctx.accounts.medication_list.medication.push(record);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct AddDoc<'info> {
    #[account(init_if_needed, payer = signer, space = 8 + 44*10, seeds = [b"permission_list", signer.key().as_ref()], bump)]
    pub permission_list: Account<'info, PermissionList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct RemoveDoc<'info> {
    #[account(mut, seeds = [b"permission_list", signer.key().as_ref()], bump)]
    pub permission_list: Account<'info, PermissionList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AppendRecord<'info> {
    #[account(seeds = [b"permission_list", patient.key().as_ref()], bump)]
    pub permission_list: Account<'info, PermissionList>,
    #[account(init_if_needed, payer = signer, space = 8 + 44*10, seeds = [b"medication_list1", patient.key().as_ref()], bump)]
    pub medication_list: Account<'info, MedicationList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: This account is used to derive seeds for permission and medication lists.
    pub patient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct PermissionList {
    authorized: Vec<String>,
}

#[account]
pub struct MedicationList {
    medication: Vec<String>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized signer")]
    Unauthorized,
}
