import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { MedicalRecordItem } from "../../components";
import { useCallback, useEffect, useState } from "react";
import { decryptData, fetchProfile, fetchRecord } from "../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const MedicalRecords = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const [medicalRecords, setMedicalRecords] = useState<string[]>([]);

  const getMedicalRecords = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }

    let response = await fetchRecord(connection, wallet as Wallet);
    if (response.status === "success") {
      let accountData = (response.data as { record: object[] }).record;

      // Filter records where recordType is "medicalRecords"
      let filteredRecords = accountData.filter(
        (record) =>
          (record as { recordType: string }).recordType === "medicalRecords"
      );

      // Decrypt recordDetails
      let decryptedRecords = filteredRecords.map((record) => {
        return decryptData(
          (record as { recordDetails: string }).recordDetails,
          "record"
        );
      });

      setMedicalRecords(decryptedRecords);
      // console.log(decryptedRecords);
    }
  }, [connection, wallet, navigate]);

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
        <MedicalRecordItem key={index} record={record} />
      ))}

      {medicalRecords?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500">
          No medical record found
        </div>
      )}
    </div>
  );
};

export default MedicalRecords;
