import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../../utils/util";
import { useCallback, useEffect } from "react";
import { MedicalRecordItem } from "../../components";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const getProfile = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }

    let response = await fetchProfile(connection, wallet as Wallet);
    if (response.status === "success") {
      const role = (response.data as { role: string }).role;
      if (role === "patient") {
        // getAuthDoctor();
      } else if (role === "doctor") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div>
      <div className="font-semibold text-xl mb-4">Medical Record</div>
      <MedicalRecordItem />
    </div>
  );
};

export default MedicalRecords;
