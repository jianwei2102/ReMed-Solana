import { Wallet } from "@project-serum/anchor";
import { useCallback, useEffect } from "react";
import { fetchProfile } from "../../utils/util";
import { useLocation, useNavigate } from "react-router-dom";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  LabResultModify,
  MedicalRecordModify,
  MedicationModify,
} from "../../components";

const ModifyRecord = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  
  console.log("Props passed to ModifyRecord:", location.state);

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
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate]);

  useEffect(() => {
    checkAuthority();
  }, [checkAuthority]);

  return (
    <>
      {location.state?.type === "medicalRecord" && <MedicalRecordModify />}
      {location.state?.type === "labResult" && <LabResultModify />}
      {location.state?.type === "medication" && <MedicationModify />}
    </>
  );
};

export default ModifyRecord;
