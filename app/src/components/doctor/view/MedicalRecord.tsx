import React from "react";
import MedicalRecordItem from "../../patient/MedicalRecordItem";

interface MedicalRecordProps {
  records: { hash: string; data: any }[];
}

const MedicalRecord: React.FC<MedicalRecordProps> = ({ records }) => {
  return (
    <div className="p-4 border">
      {records.map((record, index) => (
        <MedicalRecordItem
          key={index}
          record={record.data}
          recordsHash={record.hash}
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
