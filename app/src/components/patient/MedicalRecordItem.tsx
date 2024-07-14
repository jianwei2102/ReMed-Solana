import { Space, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

interface MedicalRecordItemProps {
  record: string;
  recordsHash: string;
}

const MedicalRecordItem = ({ record, recordsHash }: MedicalRecordItemProps) => {
  const parsedRecord = JSON.parse(record);

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Reason for Visit",
      children: parsedRecord.reasonOfVisit,
    },
    {
      key: "2",
      label: "Diagnosis",
      children: parsedRecord.diagnosis,
    },
    {
      key: "3",
      label: "Symptoms",
      children: parsedRecord.symptoms.join(", "),
    },
    {
      key: "4",
      label: "Remark",
      children: parsedRecord.remark,
    },
  ];

  return (
    <div className="border rounded-lg p-4 mb-4">
      <Space size={2} direction="vertical">
        <div className="flex">
          <p className="font-semibold">{parsedRecord.visitType}: </p>
          <p className="truncate pl-4">
            {`${parsedRecord.location}, ${parsedRecord.date}, ${parsedRecord.time}`}
          </p>
        </div>
        <div className="flex">
          <p className="font-semibold"> Record Hash: </p>
          <p className="truncate pl-3">{` ${recordsHash}`}</p>
        </div>
        <Descriptions
          className="bg-[#D2DDEA] rounded-lg px-4 pt-2 mt-2"
          items={items}
          column={1}
        />
      </Space>
    </div>
  );
};

export default MedicalRecordItem;
