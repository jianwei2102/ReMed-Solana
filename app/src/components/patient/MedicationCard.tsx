import { Descriptions, DescriptionsProps } from "antd";

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Medication",
    children: "Lisinopril 10mg",
  },
  {
    key: "2",
    label: "Frequency",
    children: "Once a day",
  },
  {
    key: "3",
    label: "Administration",
    children: "Take in the morning",
  },
  {
    key: "4",
    label: "Duration",
    children: "Three weeks",
  },
];

const items2: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Medication",
    children: "Paracetamol 500mg",
  },
  {
    key: "2",
    label: "Frequency",
    children: "Thrice a day",
  },
  {
    key: "3",
    label: "Administration",
    children: "Take with water",
  },
  {
    key: "4",
    label: "Duration",
    children: "Two weeks",
  },
];

interface MedicationCardProps {
  current: boolean;
  itemNo: number;
}

const MedicationCard = ({ current, itemNo }: MedicationCardProps) => {
  return (
    <Descriptions
      size="small"
      title={itemNo === 1 ? "Antihypertenstion" : "Pain Relief"}
      className={` ${
        current ? "bg-[#CCFCD9]" : "bg-white"
      } rounded-lg px-4 pt-2 my-2 mr-2`}
      items={itemNo === 1 ? items : items2}
      column={1}
    />
  );
};

export default MedicationCard;
