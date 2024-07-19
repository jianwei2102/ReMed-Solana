import React from "react";
import LabResultItem from "../../patient/LabResultItem";

interface LabResultProps {
  records: { hash: string; data: any; addedBy: string }[];
  userWallet: string;
}

const LabResult: React.FC<LabResultProps> = ({ records, userWallet }) => {
  return (
    <div className="p-4 border">
      {records.map((record, index) => (
        <LabResultItem
          key={index}
          record={record.data}
          recordHash={record.hash}
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
