import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { LabResultItem } from "../../components";
import { useCallback, useEffect, useState } from "react";
import { decryptData, fetchProfile, fetchRecord } from "../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

interface Record {
  recordHash: string;
  recordType: string;
  recordDetails: string;
  addedBy: string;
}

interface LabResultItemProps {
  data: string;
  hash: string;
  addedBy: string;
  patientAddress: string;
  patientName: string;
}
const LabResults = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const [labResults, setLabResults] = useState<LabResultItemProps[]>([]);

  const getLabResults = useCallback(async () => {
    let response = await fetchRecord(connection, wallet);
    if (response.status === "success") {
      let accountData = (
        response.data as {
          records: Record[];
        }
      ).records;

      // Filter records where recordType is "labResults"
      let filteredRecords = accountData.filter(
        (record) => record.recordType === "labResults"
      );

      // Decrypt recordDetails
      let decryptedRecords = filteredRecords
        .map((record) => ({
          data: decryptData(record.recordDetails, "record"),
          hash: record.recordHash,
          addedBy: record.addedBy,
          patientAddress: "",
          patientName: "",
        }))
        .reverse();

      console.log(decryptedRecords);

      setLabResults(decryptedRecords);
      // console.log(medicalRecordsHash);
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
        getLabResults();
      } else if (role === "doctor") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate, getLabResults]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div>
      <div className="font-semibold text-xl mb-4">Lab Results</div>
      {labResults.map((record, index) => (
        <LabResultItem key={index} record={record} sameDoctor={false} />
      ))}

      {labResults?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No lab results found!
        </div>
      )}
    </div>
  );
};

export default LabResults;
