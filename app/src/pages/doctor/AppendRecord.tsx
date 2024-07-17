import { Tabs } from "antd";
import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { fetchProfile } from "../../utils/util";
import { useCallback, useEffect } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  LabResultForm,
  MedicalRecordForm,
  MedicationForm,
} from "../../components";

const AppendRecord = () => {
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
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate]);

  useEffect(() => {
    checkAuthority();
  }, [checkAuthority]);

  const tabItems = [
    {
      label: "Medical Records",
      key: "1",
      children: <MedicalRecordForm />,
    },
    {
      label: "Medications",
      key: "2",
      children: <MedicationForm />,
    },
    {
      label: "Lab Results",
      key: "3",
      children: <LabResultForm />,
    },
  ];

  return (
    <>
      <Tabs type="card" items={tabItems} />
    </>
  );
};

export default AppendRecord;
