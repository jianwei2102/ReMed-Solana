import { Descriptions, DescriptionsProps } from "antd";

interface MedicationCardProps {
  medication: any; // Pass the individual medication data
}

const MedicationCard = ({ medication }: MedicationCardProps) => {
  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Medication",
      children: medication.medication,
    },
    {
      key: "2",
      label: "Frequency",
      children: medication.frequency,
    },
    {
      key: "3",
      label: "Administration",
      children: medication.administration,
    },
    {
      key: "4",
      label: "Duration",
      children: `${medication.duration} days`,
    },
  ];

  return (
    <Descriptions
      size="small"
      title={medication.indication}
      className={` ${
        medication.current ? "bg-[#CCFCD9]" : "bg-gray-100"
      } rounded-lg px-4 pt-2 my-2 mr-2`}
      items={items}
      column={1}
    />
  );
};

export default MedicationCard;
