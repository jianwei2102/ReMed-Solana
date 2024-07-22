import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { MedicalRecordItem } from "../../components";
import { useCallback, useEffect, useState } from "react";
import { decryptData, fetchProfile, fetchRecord } from "../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

interface Record {
  recordHash: string;
  recordType: string;
  recordDetails: string;
  addedBy: string;
}

interface MedicalRecord {
  data: string;
  hash: string;
  addedBy: string;
  patientAddress: string;
  patientName: string;
}

const MedicalRecords = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);

  const getMedicalRecords = useCallback(async () => {
    let response = await fetchRecord(connection, wallet as Wallet);
    if (response.status === "success") {
      let accountData = (
        response.data as {
          records: Record[];
        }
      ).records;

      // Filter records where recordType is "medicalRecord"
      let filteredRecords = accountData.filter(
        (record) => record.recordType === "medicalRecords"
      );

      // Decrypt and map recordDetails
      let decryptedRecords = filteredRecords.map((record) => ({
        data: decryptData(record.recordDetails, "record"),
        hash: record.recordHash,
        addedBy: record.addedBy,
        patientAddress: "",
        patientName: "",
      }));

      setMedicalRecords(decryptedRecords.reverse());
    }
  }, [connection, wallet]);

  const getProfile = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }

    let response = await fetchProfile(connection, wallet);
    if (response.status === "success") {
      const role = (response.data as { role: string }).role;
      if (role === "patient") {
        getMedicalRecords();
      } else if (role === "doctor") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate, getMedicalRecords]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div>
      <div className="font-semibold text-xl mb-4">Medical Record</div>
      {medicalRecords.map((record, index) => (
        <MedicalRecordItem key={index} record={record} sameDoctor={false} />
      ))}

      {medicalRecords.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No medical record found!
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
