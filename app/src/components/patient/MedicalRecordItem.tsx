import { Link } from "react-router-dom";
import { Descriptions, Button } from "antd";
import type { DescriptionsProps } from "antd";

interface record {
  hash: string;
  data: any;
  addedBy: string;
  patientName: string;
  patientAddress: string;
}
interface MedicalRecordItemProps {
  record: record;
  sameDoctor: boolean;
}

const MedicalRecordItem = ({ record, sameDoctor }: MedicalRecordItemProps) => {
  const parsedRecord = JSON.parse(record.data);
  // console.log(parsedRecord);
  const dataToPass = {
    type: "medicalRecord",
    recordHash: record.hash,
    patientName: record.patientName,
    patientAddress: record.patientAddress,
    record: parsedRecord,
  };

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
            <Link to={"/doctor/modifyRecord"} state={dataToPass}>
              <Button type="primary" className="mr-2 ">
                Modify Record
              </Button>
            </Link>
          )}
        </div>
        <div className="flex col-span-3">
          <p className="font-semibold"> Record Hash: </p>
          <p className="truncate pl-3">{` ${record.hash}`}</p>
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
