import { Space, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

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
    children: "Three week",
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
    children: "Two week",
  },
];

interface MedicationItemProps {
  current: boolean;
}

const MedicationItem = ({ current }: MedicationItemProps) => {
  return (
    <div className={`border rounded-lg p-4 mb-4 ${!current && "bg-[#F3F3F3]"}`}>
      <Space size={2} direction="vertical">
        <div>
          <span className="font-semibold">Dispensed by: </span>
          Dr. Rayon, Rayon Pharmacy, 15-01-2024
        </div>
        <div>
          <span className="font-semibold">Transaction Hash:</span> 0x...34123a
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Descriptions
            size="small"
            title="Antihypertenstion"
            className={` ${
              current ? "bg-[#CCFCD9]" : "bg-white"
            } rounded-lg px-4 pt-2 my-2 mr-2`}
            items={items}
            column={1}
          />
          <Descriptions
            size="small"
            title="Pain Relief"
            className={` ${
              current ? "bg-[#CCFCD9]" : "bg-white"
            } rounded-lg px-4 pt-2 my-2 mr-2`}
            items={items2}
            column={1}
          />
          <Descriptions
            title="Antihypertenstion"
            className={` ${
              current ? "bg-[#CCFCD9]" : "bg-white"
            } rounded-lg px-4 pt-2 my-2 mr-2`}
            items={items}
            column={1}
          />
        </div>
      </Space>
    </div>
  );
};

export default MedicationItem;
