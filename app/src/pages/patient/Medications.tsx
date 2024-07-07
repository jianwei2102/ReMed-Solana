import { MedicationItem } from "../../components";

const Medications = () => {
  return (
    <div className="overflow-y-auto h-full">
      <div className="font-semibold text-xl mb-4">Medication</div>
      <div className="font-semibold text-lg mb-4">Current Medications</div>
      <MedicationItem current={true} />
      <div className="font-semibold text-lg mb-4">Past Medication</div>
      <MedicationItem current={false} />
    </div>
  );
};

export default Medications;
