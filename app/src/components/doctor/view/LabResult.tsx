import LabResultItem from "../../patient/LabResultItem";

interface LabResultProps {
  records: {
    data: string;
    hash: string;
    addedBy: string;
    patientAddress: string;
    patientName: string;
  }[];
  userWallet: string;
}

const LabResult = ({ records, userWallet }: LabResultProps) => {
  return (
    <div className="p-4 border">
      {records.map((record, index) => (
        <LabResultItem
          key={index}
          record={record}
          sameDoctor={record.addedBy === userWallet}
        />
      ))}

      {records?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500 border rounded-xl">
          No lab results found!
        </div>
      )}
    </div>
  );
};

export default LabResult;
