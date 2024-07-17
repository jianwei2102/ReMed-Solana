import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { LabResultItem } from "../../components";
import { useCallback, useEffect, useState } from "react";
import { decryptData, fetchProfile, fetchRecord } from "../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const LabResults = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const [labResults, setLabResults] = useState<string[]>([]);
  const [labResultsHash, setLabResultsHash] = useState<string[]>([]);

  const getLabResults = useCallback(async () => {
    let response = await fetchRecord(connection, wallet);
    if (response.status === "success") {
      let accountData = (
        response.data as {
          record: {
            recordHash: string;
            recordType: string;
            recordDetails: string;
          }[];
        }
      ).record;

      // Filter records where recordType is "labResults"
      let filteredRecords = accountData.filter(
        (record) => record.recordType === "labResults"
      );

      // Decrypt recordDetails
      let decryptedRecords = filteredRecords
        .map((record) => {
          return decryptData(record.recordDetails, "record");
        })
        .reverse();

      console.log(decryptedRecords);

      setLabResults(decryptedRecords);
      setLabResultsHash(filteredRecords.map((record) => record.recordHash));
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
        <LabResultItem
          key={index}
          record={record}
          recordHash={labResultsHash[index]}
        />
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
