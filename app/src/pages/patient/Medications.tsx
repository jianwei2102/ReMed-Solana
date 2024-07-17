import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { MedicationItem } from "../../components";
import { useCallback, useEffect, useState } from "react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  decryptData,
  fetchProfile,
  fetchRecord,
  processRecords,
} from "../../utils/util";

const Medications = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const [medications, setMedications] = useState<any[]>([]);
  const [medicationHash, setMedicationHash] = useState<string[]>([]);

  const getMedication = useCallback(async () => {
    let response: { status: string; data: any } = await fetchRecord(
      connection,
      wallet
    );
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

      // Filter records where recordType is "medication"
      let filteredRecords = accountData
        .filter((record) => record.recordType === "medication")
        .reverse();

      // Decrypt recordDetails
      let decryptedRecords = filteredRecords.map((record) => {
        return decryptData(record.recordDetails, "record");
      });

      // Process records
      const processedRecords = processRecords(decryptedRecords);

      setMedications(processedRecords);
      setMedicationHash(filteredRecords.map((record) => record.recordHash));
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
        getMedication();
      } else if (role === "doctor") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate, getMedication]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  return (
    <div className="overflow-y-auto h-full">
      <div className="font-semibold text-xl mb-4">Medication</div>
      <div className="font-semibold text-lg mb-4">Current Medications</div>
      {medications
        .filter((medication) => medication.current)
        .map((medication, index) => (
          <MedicationItem
            key={index}
            medication={medication}
            recordHash={medicationHash[index]}
          />
        ))}
      {medications.filter((medication) => medication.current)?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No current medical record found!
        </div>
      )}

      <div className="font-semibold text-lg mb-4">Past Medication</div>
      {medications
        .filter((medication) => !medication.current)
        .map((medication, index) => (
          <MedicationItem
            key={index}
            medication={medication}
            recordHash={medicationHash[index]}
          />
        ))}

      {medications.filter((medication) => !medication.current)?.length ===
        0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No past medical record found!
        </div>
      )}
    </div>
  );
};

export default Medications;
