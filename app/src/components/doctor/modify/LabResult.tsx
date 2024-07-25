import dayjs from "dayjs";
import XRay from "../form/XRay";
import { format } from "date-fns";
import VitalSign from "../form/VitalSign";
import BloodCount from "../form/BloodCount";
import { useState, useEffect } from "react";
import { Wallet } from "@project-serum/anchor";
import { Button, Form, message, Radio } from "antd";
import { UploadFile } from "antd/es/upload/interface";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateHash, modifyRecord } from "../../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const LabResult = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const { mutateAsync: upload } = useStorageUpload();
  const [messageApi, contextHolder] = message.useMessage();

  const [labType, setLabType] = useState("Vital Signs");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const patientName = location.state?.patientName;
  const patientAddress = location.state?.patientAddress;

  // Extract initial data from location state
  useEffect(() => {
    const initialData = location.state?.record || {};
    const initialLabType = location.state?.labType;

    setLabType(initialLabType);

    if (initialLabType === "Vital Signs") {
      form.setFieldsValue({
        systolicBP: initialData.systolicBP,
        diastolicBP: initialData.diastolicBP,
        heartRate: initialData.heartRate,
        bodyTemperature: initialData.bodyTemperature,
      });
    } else if (initialLabType === "Blood Test") {
      form.setFieldsValue({
        whiteBloodCells: initialData.whiteBloodCells,
        redBloodCells: initialData.redBloodCells,
        hematocrit: initialData.hematocrit,
        hemoglobin: initialData.hemoglobin,
        platelets: initialData.platelets,
      });
    } else if (initialLabType === "X-Ray") {
      form.setFieldsValue({
        xrayResult: initialData.xrayResult,
      });
      // Initialize fileList with image URLs
      const initialFileList =
        initialData.xrayImages?.map((cid: string) => ({
          uid: cid,
          name: `${cid}.jpg`, // Customize this based on the file extension
          url: `https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${cid}/`,
        })) || [];
      setFileList(initialFileList);
    }
  }, [form, location.state?.record, location.state?.labType]);

  const uploadToIpfs = async (file: File): Promise<string> => {
    try {
      const uploadUrl = await upload({
        data: [file],
        options: {
          uploadWithoutDirectory: true,
          uploadWithGatewayUrl: true,
        },
      });

      const cid = uploadUrl[0].split("/ipfs/")[1].split("/")[0];
      console.log("IPFS CID:", cid);
      return cid;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  };

  const onFinish = async (values: any) => {
    try {
      if (labType === "X-Ray") {
        messageApi.open({
          type: "loading",
          content: "Uploading image file(s) to IPFS...",
          duration: 0,
        });

        // Only upload new files, retain existing files
        const newFileList = fileList.filter(
          (file) => !file.url?.includes("ipfs/")
        );
        const newCidPromises = newFileList.map((file) =>
          uploadToIpfs(file.originFileObj as File)
        );
        const newCids = await Promise.all(newCidPromises);

        values.xrayImages = [
          ...(location.state?.record?.xrayImages || []),
          ...newCids,
        ];
        messageApi.destroy();
      }

      const record = {
        ...values,
        date: format(dayjs().toDate(), "dd-MM-yyyy"),
        time: format(dayjs().toDate(), "hh:mm a"),
        type: labType,
        location: sessionStorage.getItem("affiliations")?.toString(),
      };
      const newRecordHash = generateHash(
        JSON.stringify(record),
        wallet?.publicKey.toBase58(),
        patientAddress
      );
      console.log(record, newRecordHash);

      messageApi.open({
        type: "loading",
        content: "Transaction in progress..",
        duration: 0,
      });

      let response = await modifyRecord(
        connection,
        wallet,
        location.state?.recordHash,
        newRecordHash,
        JSON.stringify(record),
        patientAddress
      );

      messageApi.destroy();
      if (response.status === "success") {
        navigate("/doctor/viewRecord", {
          state: { refresh: true, address: patientAddress, name: patientName },
        });
        form.resetFields();

        messageApi.open({
          type: "success",
          content: "Record modified successfully!",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Error modifying record!",
        });
      }
    } catch (error) {
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: "Error uploading file(s) to IPFS",
      });
      console.error("Error uploading file(s) to IPFS:", error);
    }
  };

  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  return (
    <div className="px-4">
      {contextHolder}
      <div className="font-semibold underline text-xl text-[#124588] mb-4">
        Create New Lab Result - {patientName}
      </div>
      <Radio.Group value={labType} onChange={(e) => setLabType(e.target.value)}>
        <Radio.Button value="Vital Signs" disabled={labType !== "Vital Signs"}>
          Vital Signs
        </Radio.Button>
        <Radio.Button value="Blood Test" disabled={labType !== "Blood Test"}>
          Blood Test
        </Radio.Button>
        <Radio.Button value="X-Ray" disabled={labType !== "X-Ray"}>
          X-Ray
        </Radio.Button>
      </Radio.Group>
      <Form
        {...formItemLayout}
        form={form}
        className="mt-4"
        layout="horizontal"
        onFinish={onFinish}
      >
        {labType === "Vital Signs" && <VitalSign />}
        {labType === "Blood Test" && <BloodCount />}
        {labType === "X-Ray" && (
          <XRay fileList={fileList} setFileList={setFileList} />
        )}

        <Form.Item className="grid justify-items-end ">
          <Button
            type="primary"
            htmlType="submit"
            className="px-8 py-4 mt-4 text-lg"
          >
            Submit Record
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LabResult;
