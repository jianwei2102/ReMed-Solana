use anchor_lang::prelude::*;

declare_id!("Eko2SkVj9jQ39wLAzFgBReJqXZp2Ht6hDcRgBftvgkbd");

#[program]
pub mod remed {
    use super::*;

    pub fn create_profile(
        ctx: Context<CreateProfile>,
        role: String,
        personal_details: String,
    ) -> Result<()> {
        ctx.accounts.profile.role = role;
        ctx.accounts.profile.personal_details = personal_details;
        Ok(())
    }

    pub fn authorize_doctor(
        ctx: Context<AuthorizeDoctor>,
        doctor_address: String,
        date: String,
    ) -> Result<()> {
        let patient_auth_list = &mut ctx.accounts.patient_auth_list;
        let doctor_auth_list = &mut ctx.accounts.doctor_auth_list;
        let patient_address = ctx.accounts.signer.key().to_string();

        // Check if the doctor's address already exists in the authorized list
        if patient_auth_list
            .authorized
            .iter()
            .any(|auth| auth.address == doctor_address)
        {
            return Err(ErrorCode::AuthorizationExist.into());
        }

        let new_doctor_auth = Authorization {
            address: patient_address,
            date: date.clone(),
        };

        doctor_auth_list.authorized.push(new_doctor_auth);

        let new_patient_auth = Authorization {
            address: doctor_address,
            date: date,
        };
        patient_auth_list.authorized.push(new_patient_auth);
        Ok(())
    }

    pub fn revoke_doctor(ctx: Context<RevokeDoctor>, doctor_address: String) -> Result<()> {
        let patient_auth_list = &mut ctx.accounts.patient_auth_list;
        let doctor_auth_list = &mut ctx.accounts.doctor_auth_list;
        let patient_address = ctx.accounts.signer.key().to_string();

        // Verify that the doctor's address is present in the authorized list
        if !patient_auth_list
            .authorized
            .iter()
            .any(|auth| auth.address == doctor_address)
        {
            return Err(ErrorCode::AuthorizationNotExist.into());
        }

        doctor_auth_list
            .authorized
            .retain(|auth| auth.address != patient_address);
        patient_auth_list
            .authorized
            .retain(|auth| auth.address != doctor_address);
        Ok(())
    }

    pub fn revoke_patient(ctx: Context<RevokePatient>, patient_address: String) -> Result<()> {
        let patient_auth_list = &mut ctx.accounts.patient_auth_list;
        let doctor_auth_list = &mut ctx.accounts.doctor_auth_list;
        let doctor_address = ctx.accounts.signer.key().to_string();

        // Verify that the doctor's address is present in the authorized list
        if !patient_auth_list
            .authorized
            .iter()
            .any(|auth| auth.address == doctor_address)
        {
            return Err(ErrorCode::AuthorizationNotExist.into());
        }

        doctor_auth_list
            .authorized
            .retain(|auth| auth.address != patient_address);
        patient_auth_list
            .authorized
            .retain(|auth| auth.address != doctor_address);
        Ok(())
    }

    pub fn append_record(
        ctx: Context<AppendRecord>,
        record_hash: String,
        record_details: String,
        record_type: String
    ) -> Result<()> {
        let patient_auth_list = &ctx.accounts.patient_auth_list;
        let doctor_address = ctx.accounts.signer.key().to_string();
        if !patient_auth_list
            .authorized
            .iter()
            .any(|auth| auth.address == doctor_address)
        {
            return Err(ErrorCode::AuthorizationNotExist.into());
        }

        let emr_list = &mut ctx.accounts.emr_list.record;
        if emr_list
            .iter()
            .any(|med| med.record_hash == record_hash)
        {
            return Err(ErrorCode::RecordHashExists.into());
        }

        let new_emr: EMR = EMR {
            record_hash,
            record_details,
            record_type,
            added_by: doctor_address,
        };

        emr_list.push(new_emr);
        Ok(())
    }

    pub fn modify_record(
        ctx: Context<ModifyRecord>,
        current_record_hash: String,
        new_record_hash: String,
        record_details: String,
    ) -> Result<()> {
        let patient_auth_list = &ctx.accounts.patient_auth_list;
        let doctor_address = ctx.accounts.signer.key().to_string();
        if !patient_auth_list
            .authorized
            .iter()
            .any(|auth| auth.address == doctor_address)
        {
            return Err(ErrorCode::Unauthorized.into());
        }

        // Find the record with the current_record_hash and replace it
        let emr_list = &mut ctx.accounts.emr_list.record;
        if let Some(index) = emr_list
            .iter()
            .position(|med| med.record_hash == current_record_hash)
        {
            // Check if the record added by the signer
            if emr_list[index].added_by == doctor_address {
                let new_medication = EMR {
                    record_hash: new_record_hash,
                    record_details,
                    record_type: emr_list[index].record_type.clone(),
                    added_by: doctor_address,
                };
                emr_list[index] = new_medication;
                Ok(())
            } else {
                return Err(ErrorCode::InvalidRecordPermission.into()); // Error code for invalid record permission
            }
        } else {
            return Err(ErrorCode::RecordNotFound.into()); // Error code for record not found
        }
    }
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(init, payer = signer, space = 8 + 20 + 1024, seeds = [b"profile", signer.key().as_ref()], bump)]
    pub profile: Account<'info, Profile>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AuthorizeDoctor<'info> {
    #[account(init_if_needed, payer = signer, space = 8 + 88*20, seeds = [b"patient_auth_list", signer.key().as_ref()], bump)]
    pub patient_auth_list: Account<'info, AuthList>,
    #[account(init_if_needed, payer = signer, space = 8 + 88*20, seeds = [b"doctor_auth_list", doctor.key().as_ref()], bump)]
    pub doctor_auth_list: Account<'info, AuthList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: This is safe because we are only reading the `doctor` account information, and it is not being mutated.
    pub doctor: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokeDoctor<'info> {
    #[account(mut, seeds = [b"patient_auth_list", signer.key().as_ref()], bump)]
    pub patient_auth_list: Account<'info, AuthList>,
    #[account(mut, seeds = [b"doctor_auth_list", doctor.key().as_ref()], bump)]
    pub doctor_auth_list: Account<'info, AuthList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: This is safe because we are only reading the `doctor` account information, and it is not being mutated.
    pub doctor: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RevokePatient<'info> {
    #[account(mut, seeds = [b"patient_auth_list", patient.key().as_ref()], bump)]
    pub patient_auth_list: Account<'info, AuthList>,
    #[account(mut, seeds = [b"doctor_auth_list", signer.key().as_ref()], bump)]
    pub doctor_auth_list: Account<'info, AuthList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: This is safe because we are only reading the `doctor` account information, and it is not being mutated.
    pub patient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct AppendRecord<'info> {
    #[account(mut, seeds = [b"patient_auth_list", patient.key().as_ref()], bump)]
    pub patient_auth_list: Account<'info, AuthList>,
    #[account(init_if_needed, payer = signer, space = 8 + 132*50, seeds = [b"emr_list", patient.key().as_ref()], bump)]
    pub emr_list: Account<'info, EMRList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: This is safe because we are only reading the `patient` account information, and it is not being mutated.
    pub patient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ModifyRecord<'info> {
    #[account(mut, seeds = [b"patient_auth_list", patient.key().as_ref()], bump)]
    pub patient_auth_list: Account<'info, AuthList>,
    #[account(mut, seeds = [b"emr_list", patient.key().as_ref()], bump)]
    pub emr_list: Account<'info, EMRList>,
    #[account(mut)]
    pub signer: Signer<'info>,
    /// CHECK: This is safe because we are only reading the `patient` account information, and it is not being mutated.
    pub patient: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Profile {
    role: String,
    personal_details: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct Authorization {
    address: String,
    date: String,
}

#[account]
pub struct AuthList {
    authorized: Vec<Authorization>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct EMR {
    record_hash: String,
    record_details: String,
    record_type: String,
    added_by: String,
}

#[account]
pub struct EMRList {
    record: Vec<EMR>,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized signer")]
    Unauthorized,
    #[msg("Authorization exists")]
    AuthorizationExist,
    #[msg("Authorization does not exist")]
    AuthorizationNotExist,
    #[msg("Record not found")]
    RecordNotFound,
    #[msg("Invalid Record Permission")]
    InvalidRecordPermission,
    #[msg("Record hash already exists")]
    RecordHashExists,
}
