import { Descriptions, Button } from "antd";
import type { DescriptionsProps } from "antd";

interface MedicalRecordItemProps {
  record: string;
  recordHash: string;
  sameDoctor: boolean;
}

const MedicalRecordItem = ({
  record,
  recordHash,
  sameDoctor,
}: MedicalRecordItemProps) => {
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
      <div className="grid grid-cols-4">
        <div className="flex col-span-3">
          <p className="font-semibold">{parsedRecord.visitType}: </p>
          <p className="truncate pl-4">
            {`${parsedRecord.location}, ${parsedRecord.date}, ${parsedRecord.time}`}
          </p>
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
        <Descriptions
          className="bg-[#D2DDEA] rounded-lg px-4 pt-2 mt-2 col-span-4"
          items={items}
          column={1}
        />
      </div>
    </div>
  );
};

export default MedicalRecordItem;
