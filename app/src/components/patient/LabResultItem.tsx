import { useEffect, useState } from "react";
import { Space, Descriptions } from "antd";
import type { DescriptionsProps } from "antd";

const VitalSignsItems: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Blood Pressure (mmHg)",
    children: (
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">Systolic B.P</div>
          <div className="col-span-1">: 120</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">Diastolic B.P</div>
          <div className="col-span-1">: 80</div>
        </div>
      </div>
    ),
  },
  {
    key: "2",
    label: "Heart Rate (pulse)",
    children: "120 bpm",
  },
  {
    key: "3",
    label: "Body Temperature",
    children: "37°c",
  },
];

const BloodCountItems: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "Complete Blood Count (CBC)",
    children: (
      <div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">White Blood Cells (WBC)</div>
          <div className="col-span-1">: 7.2 x 10^3/μL</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">Red Blood Cells (RBC)</div>
          <div className="col-span-1">: 4.5 x 10^6/μL</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">Hematocrit (HCT)</div>
          <div className="col-span-1">: 40.5%</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">Hemoglobin (HGB)</div>
          <div className="col-span-1">: 10.8 g/dL</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">Platelets</div>
          <div className="col-span-1">: 220 x 10^3/μL</div>
        </div>
      </div>
    ),
  },
  {
    key: "2",
    label: "Reference range",
    children: (
      <div>
        <div>4.5-11.0 x10^3/μL</div>
        <div>4.5-5.9 x10^6/μL</div>
        <div>41.0-53.0 %</div>
        <div>12.0 - 16.0 g/dL</div>
        <div>150-450 x10^3/μL</div>
      </div>
    ),
  },
];

const XRayItems: DescriptionsProps["items"] = [
  {
    key: "1",
    label: "X-Ray Result",
    children: "No abnormalities detected.",
  },
  {
    key: "2",
    label: "Imaging Links",
    children: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.drugs.com/health-guide/images/ddca3f92-4b8e-4672-bb6b-f3594ad4e304.jpg"
      >
        https://www.drugs.com/health-guide/images/ddca3f92-4b8e-4672-bb6b-f3594ad4e304.jpg
      </a>
    ),
  },
];

interface LabResultItemProps {
  LabResult: string;
}

const LabResultItem = ({ LabResult }: LabResultItemProps) => {
  const [columnCount, setColumnCount] = useState(1);
  const [items, setItems] = useState<DescriptionsProps["items"]>([]);

  useEffect(() => {
    switch (LabResult) {
      case "Vital Signs":
        setColumnCount(3);
        setItems(VitalSignsItems);
        break;
      case "Blood Count":
        setColumnCount(2);
        setItems(BloodCountItems);
        break;
      case "X-Ray":
        setColumnCount(1);
        setItems(XRayItems);
        break;
      default:
        setColumnCount(1);
        setItems([]);
        break;
    }
  }, [LabResult]);

  return (
    <div className="border rounded-lg p-4 mb-4">
      <Space size={2} direction="vertical">
        <div>
          <span className="font-semibold">{LabResult} - </span>
          Rayon Clinic, 21-02-2024, 12:41 P.M.
        </div>
        <div>
          <span className="font-semibold">Transaction Hash:</span> 0x...34123a
        </div>
        <Descriptions
          column={columnCount}
          layout="vertical"
          items={items}
          className="bg-[#D2DDEA] rounded-lg px-4 pt-2 my-2"
          labelStyle={{ fontWeight: "700" }}
        />
        {LabResult === "Blood Count" && (
          <div>
            <div className="font-semibold">Report</div>
            <div className="text-[#FC5488]">
              Hemoglobin is slightly below average. 
            </div>
          </div>
        )}
      </Space>
    </div>
  );
};

export default LabResultItem;
