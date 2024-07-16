import { Tabs } from "antd";
import {
  LabResultForm,
  MedicalRecordForm,
  MedicationForm,
} from "../../components";

const AppendRecord = () => {
  const tabItems = [
    {
      label: "Medical Records",
      key: "1",
      children: <MedicalRecordForm />,
    },
    {
      label: "Medications",
      key: "2",
      children: <MedicationForm />,
    },
    {
      label: "Lab Results",
      key: "3",
      children: <LabResultForm />,
    },
  ];

  return (
    <>
      <Tabs type="card" items={tabItems} />
    </>
  );
};

export default AppendRecord;
