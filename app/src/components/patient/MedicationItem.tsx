import { Space } from "antd";
import { MedicationCard } from "../";

interface MedicationItemProps {
  medication: {
    medications: {
      indication: string;
      medication: string;
      frequency: string;
      administration: string;
      duration: number;
    }[];
    date: string;
    time: string;
    location: string;
  };
  recordHash: string;
}

const MedicationItem = ({ medication, recordHash }: MedicationItemProps) => {
  return (
    <div className={`border rounded-lg p-4 mb-4`}>
      <Space size={2} direction="vertical">
        <div>
          <span className="font-semibold">Dispensed by: </span>
          {`${medication.location}, ${medication.date}, ${medication.time}`}
        </div>
        <div>
          <span className="font-semibold">Transaction Hash:</span> {recordHash}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          {medication.medications.map((med, index) => (
            <MedicationCard key={index} medication={med} />
          ))}
        </div>
      </Space>
    </div>
  );
};

export default MedicationItem;
