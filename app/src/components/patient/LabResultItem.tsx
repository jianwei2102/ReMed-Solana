import { Link } from "react-router-dom";
import { Descriptions, Image, Button } from "antd";

interface LabResultItemProps {
  record: {
    data: string;
    hash: string;
    addedBy: string;
    patientAddress: string;
    patientName: string;
  };
  sameDoctor: boolean;
}

const LabResultItem = ({ record, sameDoctor }: LabResultItemProps) => {
  const parsedRecord = JSON.parse(record.data);

  const type = parsedRecord.type || "";
  const dataToPass = {
    type: "labResult",
    labType: type,
    recordHash: record.hash,
    patientName: record.patientName,
    patientAddress: record.patientAddress,
    record: parsedRecord,
  };

  // Reference ranges for Blood Count
  const referenceRanges = {
    whiteBloodCells: { min: 4.5, max: 11.0 },
    redBloodCells: { min: 4.5, max: 5.9 },
    hematocrit: { min: 41.0, max: 53.0 },
    hemoglobin: { min: 12.0, max: 16.0 },
    platelets: { min: 150, max: 450 },
  };

  const getDescriptionItems = (type: string) => {
    switch (type) {
      case "Vital Signs":
        return [
          {
            key: "1",
            label: "Blood Pressure (mmHg)",
            children: (
              <div className="flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">Systolic B.P</div>
                  <div className="col-span-1">: {parsedRecord.systolicBP}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">Diastolic B.P</div>
                  <div className="col-span-1">: {parsedRecord.diastolicBP}</div>
                </div>
              </div>
            ),
          },
          {
            key: "2",
            label: "Heart Rate (pulse)",
            children: `${parsedRecord.heartRate} bpm`,
          },
          {
            key: "3",
            label: "Body Temperature",
            children: `${parsedRecord.bodyTemperature}°C`,
          },
        ];
      case "Blood Count":
        return [
          {
            key: "1",
            label: "Complete Blood Count (CBC)",
            children: (
              <div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">White Blood Cells (WBC)</div>
                  <div className="col-span-1">
                    : {parsedRecord.whiteBloodCells} x 10<sup>3</sup>/μL
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">Red Blood Cells (RBC)</div>
                  <div className="col-span-1">
                    : {parsedRecord.redBloodCells} x 10<sup>6</sup>/μL
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">Hematocrit (HCT)</div>
                  <div className="col-span-1">
                    : {parsedRecord.hematocrit} %
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">Hemoglobin (HGB)</div>
                  <div className="col-span-1">
                    : {parsedRecord.hemoglobin} g/dL
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">Platelets</div>
                  <div className="col-span-1">
                    : {parsedRecord.platelets} x 10<sup>3</sup>/μL
                  </div>
                </div>
              </div>
            ),
          },
          {
            key: "2",
            label: "Reference range",
            children: (
              <div>
                <div>
                  4.5-11.0 x10<sup>3</sup>/μL
                </div>
                <div>
                  4.5-5.9 x10<sup>6</sup>/μL
                </div>
                <div>41.0-53.0 %</div>
                <div>12.0 - 16.0 g/dL</div>
                <div>
                  150-450 x10<sup>3</sup>/μL
                </div>
              </div>
            ),
          },
        ];
      case "X-Ray":
        return [
          {
            key: "1",
            label: "X-Ray Result",
            children: parsedRecord.xrayResult,
          },
          {
            key: "2",
            label: "Imaging Links",
            children: (
              <div className="flex gap-4">
                {parsedRecord.xrayImages.map((image: string, index: number) => (
                  <div
                    key={index}
                    className="flex flex-col justify-center items-center"
                  >
                    <Image
                      src={`https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${image}/`}
                      alt="X-Ray Image"
                      width={200}
                      height={200}
                    />
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      // href={`https://gateway.ipfs.io/ipfs/${image}`}
                      href={`https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${image}/`}
                      className="ml-4 text-blue-800 hover:underline"
                    >
                      {`Image ${index + 1}`}
                    </a>
                  </div>
                ))}
              </div>
            ),
          },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="grid grid-cols-4">
        <div className="flex col-span-3">
          <p className="font-semibold">{type}: </p>
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
          items={getDescriptionItems(type)}
          column={type === "Vital Signs" ? 3 : type === "Blood Count" ? 2 : 1}
          layout="vertical"
          labelStyle={{ fontWeight: "700" }}
        />
        {type === "Blood Count" && (
          <div>
            <div className="font-semibold">Report</div>
            <div className="text-[#FC5488]">
              {parsedRecord.hemoglobin < referenceRanges.hemoglobin.min && (
                <div>
                  Hemoglobin is <span className="font-semibold"> below </span>{" "}
                  the normal range.
                </div>
              )}
              {parsedRecord.hemoglobin > referenceRanges.hemoglobin.max && (
                <div>
                  Hemoglobin is <span className="font-semibold"> above </span>{" "}
                  the normal range.
                </div>
              )}
              {parsedRecord.whiteBloodCells <
                referenceRanges.whiteBloodCells.min && (
                <div>
                  WBC is <span className="font-semibold"> below </span> the
                  normal range.
                </div>
              )}
              {parsedRecord.whiteBloodCells >
                referenceRanges.whiteBloodCells.max && (
                <div>
                  WBC is <span className="font-semibold"> above </span> the
                  normal range.
                </div>
              )}
              {parsedRecord.redBloodCells <
                referenceRanges.redBloodCells.min && (
                <div>
                  RBC is <span className="font-semibold"> below </span> the
                  normal range.
                </div>
              )}
              {parsedRecord.redBloodCells >
                referenceRanges.redBloodCells.max && (
                <div>
                  RBC is <span className="font-semibold"> above </span> the
                  normal range.
                </div>
              )}
              {parsedRecord.hematocrit < referenceRanges.hematocrit.min && (
                <div>
                  Hematocrit is <span className="font-semibold"> below </span>{" "}
                  the normal range.
                </div>
              )}
              {parsedRecord.hematocrit > referenceRanges.hematocrit.max && (
                <div>
                  Hematocrit is <span className="font-semibold"> above </span>{" "}
                  the normal range.
                </div>
              )}
              {parsedRecord.platelets < referenceRanges.platelets.min && (
                <div>
                  Platelets are <span className="font-semibold"> below </span>{" "}
                  the normal range.
                </div>
              )}
              {parsedRecord.platelets > referenceRanges.platelets.max && (
                <div>
                  Platelets are <span className="font-semibold"> above </span>{" "}
                  the normal range.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabResultItem;
