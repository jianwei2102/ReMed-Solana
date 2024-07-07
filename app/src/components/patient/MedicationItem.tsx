import { Space } from "antd";
import { MedicationCard } from "../";

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
          <MedicationCard current={current} itemNo={1} />
          <MedicationCard current={current} itemNo={2} />
          <MedicationCard current={current} itemNo={1} />
        </div>
      </Space>
    </div>
  );
};

export default MedicationItem;
