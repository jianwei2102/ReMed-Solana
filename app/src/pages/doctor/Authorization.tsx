import { useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Wallet } from '@project-serum/anchor';
import { fetchProfile } from '../../utils/util';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';

const Authorization = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const checkAuthority = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }

    let response = await fetchProfile(connection, wallet);
    if (response.status === "success") {
      const role = (response.data as { role: string }).role;
      if (role === "patient") {
        navigate("/");
      } else if (role === "doctor") {
        // getAuthPatient();
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate]);

  useEffect(() => {
    checkAuthority();
  }, [checkAuthority]);

  return (
    <div>Authorization</div>
  )
}

export default Authorization