import { Button } from "antd";
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
  sameDoctor: boolean;
}

const MedicationItem = ({
  medication,
  recordHash,
  sameDoctor,
}: MedicationItemProps) => {
  return (
    <div className={`border rounded-lg p-4 mb-4`}>
      <div className="grid grid-cols-4">
        <div className="flex col-span-3">
          <span className="font-semibold">Dispensed by: </span>
          {`${medication.location}, ${medication.date}, ${medication.time}`}
        </div>
        <div className="flex flex-row-reverse row-span-2">
          {sameDoctor && (
            <Button type="primary" className="mr-2 ">
              Modify Record
            </Button>
          )}
        </div>
        <div className="flex col-span-3">
          <p className="font-semibold"> Record Hash: </p>
          <p className="truncate pl-3">{` ${recordHash}`}</p>
        </div>
        <div className="col-span-4 grid grid-cols-1 md:grid-cols-2">
          {medication.medications.map((med, index) => (
            <MedicationCard key={index} medication={med} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicationItem;
