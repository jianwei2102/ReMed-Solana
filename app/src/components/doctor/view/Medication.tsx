import MedicationItem from "../../patient/MedicationItem";

interface MedicationRecord {
  current: boolean;
  date: string;
  location: string;
  medications: any[];
  recordHash: string;
  time: string;
  addedBy: string;
  patientName: string;
  patientAddress: string;
}

const Medication = ({
  records,
  userWallet,
}: {
  records: MedicationRecord[];
  userWallet: string;
}) => {
  return (
    <div className="overflow-y-auto h-full p-4 border">
      <div className="font-semibold text-lg mb-4">Current Medications</div>
      {records
        .filter((records) => records.current)
        .map((medication, index) => (
          <MedicationItem
            key={index}
            medication={medication}
            recordHash={medication.recordHash}
            sameDoctor={medication.addedBy === userWallet}
          />
        ))}
      {records.filter((medication) => medication.current)?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No current medical record found!
        </div>
      )}

      <div className="font-semibold text-lg mb-4">Past Medication</div>
      {records
        .filter((records) => !records.current)
        .map((medication, index) => (
          <MedicationItem
            key={index}
            medication={medication}
            recordHash={medication.recordHash}
            sameDoctor={false}
          />
        ))}

      {records.filter((medication) => !medication.current)?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No past medical record found!
        </div>
      )}
    </div>
  );
};

export default Medication;
