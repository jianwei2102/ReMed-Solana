use anchor_lang::prelude::*;

declare_id!("AaD2G2x6dkvNsUaHhKM26XBBVBfb76FsFtaZKtt4dnWj");

#[program]
pub mod remed {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
