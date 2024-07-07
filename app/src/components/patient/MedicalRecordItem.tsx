import { Space, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const items: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Reason for Visit",
    children: "Doesn't feel well",
  },
  {
    key: "2",
    label: "Diagnosis",
    children: "Fever, 40 C",
  },
  {
    key: "3",
    label: "Symptoms",
    children: "Headache, Fever",
  },
  {
    key: "4",
    label: "By",
    children: "Dr. Rayon, 0x..312a",
  },
];

const MedicalRecordItem = () => {
  return (
    <div className="border rounded-lg p-4">
        <Space size={1} direction="vertical">
          <div>Clinical Visit: Rayon Clinic, 21-02-2024, 12:41 P.M.</div>
          <div></div>Record Transaction: 0x...34123a
        </Space>
        <Descriptions
          className="bg-[#D2DDEA] rounded-lg px-4 pt-2"
          items={items}
          column={1}
        />
      </div>
  )
}

export default MedicalRecordItem