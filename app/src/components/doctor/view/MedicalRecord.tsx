import MedicalRecordItem from "../../patient/MedicalRecordItem";

interface MedicalRecordProps {
  records: {
    hash: string;
    data: any;
    addedBy: string;
    patientName: string;
    patientAddress: string;
  }[];
  userWallet: string;
}

const MedicalRecord = ({ records, userWallet }: MedicalRecordProps) => {
  return (
    <div className="p-4 border">
      {records.map((record, index) => (
        <MedicalRecordItem
          key={index}
          record={record}
          sameDoctor={record.addedBy === userWallet}
        />
      ))}

      {records?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No medical record found!
        </div>
      )}
    </div>
  );
};

export default MedicalRecord;
