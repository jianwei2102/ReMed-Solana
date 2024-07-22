import { useLocation } from "react-router-dom";
import {
  LabResultModify,
  MedicalRecordModify,
  MedicationModify,
} from "../../components";

const ModifyRecord = () => {
  const location = useLocation();
  console.log("Props passed to ModifyRecord:", location.state);

  return (
    <div>
      {location.state?.type === "medicalRecord" && <MedicalRecordModify />}
      {location.state?.type === "labResult" && <LabResultModify />}
      {location.state?.type === "medication" && <MedicationModify />}
    </div>
  );
};

export default ModifyRecord;
