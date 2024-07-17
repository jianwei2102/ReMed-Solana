import { Tabs } from "antd";
import { Wallet, web3 } from "@project-serum/anchor";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  LabResultView,
  MedicalRecordView,
  MedicationView,
} from "../../components";
import {
  decryptData,
  fetchProfile,
  fetchRecord,
  processRecords,
} from "../../utils/util";

interface Record {
  recordHash: string;
  recordType: string;
  recordDetails: string;
}

interface CategorizedRecords {
  labResults: string[];
  medicalRecords: string[];
  medications: any[];
}

const ViewRecord = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const [searchParams] = useSearchParams();
  const wallet = useAnchorWallet() as Wallet;

  const [records, setRecords] = useState<CategorizedRecords>({
    labResults: [],
    medicalRecords: [],
    medications: [],
  });

  const patientAddress = searchParams.get("address") ?? "";

  const handleRecords = useCallback((accountData: Record[]) => {
    const categorizedRecords: CategorizedRecords = {
      labResults: [],
      medicalRecords: [],
      medications: [],
    };

    accountData.forEach((record) => {
      const decryptedData = decryptData(record.recordDetails, "record");
      switch (record.recordType) {
        case "labResults":
          categorizedRecords.labResults.push(decryptedData);
          break;
        case "medicalRecords":
          categorizedRecords.medicalRecords.push(decryptedData);
          break;
        case "medication":
          const processedRecords = processRecords([decryptedData]);
          categorizedRecords.medications.push(...processedRecords);
          break;
        default:
          break;
      }
    });

    setRecords({
      labResults: categorizedRecords.labResults.reverse(),
      medicalRecords: categorizedRecords.medicalRecords.reverse(),
      medications: categorizedRecords.medications.reverse(),
    });
  }, []);

  const getPatientEMR = useCallback(async () => {
    const publicKey = new web3.PublicKey(patientAddress);
    const patientWallet = { publicKey } as Wallet;
    let response = await fetchRecord(connection, patientWallet);
    if (response.status === "success" && response.data) {
      const accountData = (response.data as { record: Record[] }).record;
      handleRecords(accountData);
    }
  }, [connection, patientAddress, handleRecords]);

  const checkAuthority = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }

    let response = await fetchProfile(connection, wallet);
    if (response.status === "success" && response.data) {
      const role = (response.data as { role: string }).role;
      if (role === "patient") {
        navigate("/");
      } else if (role === "doctor") {
        getPatientEMR();
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate, getPatientEMR]);

  useEffect(() => {
    checkAuthority();
  }, [checkAuthority]);

  const tabItems = [
    {
      label: "Medical Records",
      key: "1",
      children: <MedicalRecordView records={records.medicalRecords} />,
    },
    {
      label: "Medications",
      key: "2",
      children: <MedicationView records={records.medications} />,
    },
    {
      label: "Lab Results",
      key: "3",
      children: <LabResultView records={records.labResults} />,
    },
  ];

  return (
    <>
      <Tabs type="card" items={tabItems} />
    </>
  );
};

export default ViewRecord;
