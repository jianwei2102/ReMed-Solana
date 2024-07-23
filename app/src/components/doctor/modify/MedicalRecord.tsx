import dayjs from "dayjs";
import { format } from "date-fns";
import { Wallet } from "@project-serum/anchor";
import { useLocation, useNavigate } from "react-router-dom";
import { generateHash, modifyRecord } from "../../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Space,
  TimePicker,
} from "antd";

const MedicalRecord = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const [messageApi, contextHolder] = message.useMessage();

  const patientName = location.state?.patientName;
  const patientAddress = location.state?.patientAddress;

  // Parse the record from location.state
  const record = location.state?.record;
  let initialValues = {
    visitType: record?.visitType,
    reasonOfVisit: record?.reasonOfVisit,
    diagnosis: record?.diagnosis,
    symptoms: record?.symptoms,
    date: dayjs(),
    time: dayjs(),
    location: record?.location,
    remark: record?.remark,
  };

  const onFinish = async (values: any) => {
    const record = {
      ...values,
      date: format(values.date.toDate(), "dd-MM-yyyy"),
      time: format(values.time.toDate(), "hh:mm a"),
    };
    const newRecordHash = generateHash(
      JSON.stringify(record),
      wallet.publicKey.toBase58(),
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
      // Reset the form fields to their initial state
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
  };

  const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 20 } };

  return (
    <div className="px-4">
      {contextHolder}
      <div className="font-semibold underline text-xl text-[#124588] mb-4">
        Modify Medical Record - {patientName}
      </div>
      <div className="font-semibold text-xl mb-4">Medical Record Details</div>
      <Form
        {...formItemLayout}
        form={form}
        className="mt-4"
        layout="horizontal"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Space direction="vertical" size="middle" className="flex">
          <Card title="General Information" className="border-2">
            <Form.Item
              name={"visitType"}
              label="Visit Type"
              required
              rules={[
                {
                  required: true,
                  message: "Please select the visit type!",
                },
              ]}
            >
              <Select placeholder="Select Visit Type" style={{ width: "35%" }}>
                <Select.Option value="Clinical Visit">
                  Clinical Visit
                </Select.Option>
                <Select.Option value="Follow-Up Visit">
                  Follow-Up Visit
                </Select.Option>
                <Select.Option value="Emergency Visit">
                  Emergency Visit
                </Select.Option>
                <Select.Option value="Health Screening">
                  Health Screening
                </Select.Option>
                <Select.Option value="Surgical Consultation">
                  Surgical Consultation
                </Select.Option>
                <Select.Option value="Specialist Consultation">
                  Specialist Consultation
                </Select.Option>
                <Select.Option value="Chronic Disease Management">
                  Chronic Disease Management
                </Select.Option>
                <Select.Option value="Annual Physical Examination">
                  Annual Physical Examination
                </Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name={"reasonOfVisit"}
              label="Reason of Visit"
              required
              rules={[
                {
                  required: true,
                  message: "Please input the patient's reason of visit!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Symptoms like cough, sore throat, and fever"
                style={{ width: "95%", height: "80px" }}
              />
            </Form.Item>
            <Form.Item
              name={"diagnosis"}
              label="Diagnosis"
              required
              rules={[
                {
                  required: true,
                  message: "Please input the diagnosis for patient!",
                },
              ]}
            >
              <Input.TextArea
                placeholder="Common Cold"
                style={{ width: "95%", height: "80px" }}
              />
            </Form.Item>
          </Card>
          <div className="flex flex-row gap-2">
            <Card title="Symptoms" className="basis-1/2 border-2">
              <span className="italic">
                Please try to add one or more symptoms diagnosed
              </span>
              <Form.Item
                className="mt-2"
                name={"symptoms"}
                label="Symptoms"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select the Symptoms!",
                  },
                ]}
              >
                <Select
                  mode="tags"
                  style={{ width: "100%" }}
                  placeholder="Type or select symptoms"
                  options={[
                    { value: "Asthenia", label: "Asthenia" },
                    { value: "Fever", label: "Fever" },
                    { value: "Cough", label: "Cough" },
                    { value: "Headache", label: "Headache" },
                    { value: "Sore Throat", label: "Sore Throat" },
                    {
                      value: "Shortness of Breath",
                      label: "Shortness of Breath",
                    },
                    { value: "Chest Pain", label: "Chest Pain" },
                    { value: "Fatigue", label: "Fatigue" },
                    { value: "Nausea", label: "Nausea" },
                    { value: "Vomiting", label: "Vomiting" },
                    { value: "Abdominal Pain", label: "Abdominal Pain" },
                    { value: "Diarrhea", label: "Diarrhea" },
                    { value: "Constipation", label: "Constipation" },
                    { value: "Muscle Pain", label: "Muscle Pain" },
                    { value: "Joint Pain", label: "Joint Pain" },
                    { value: "Dizziness", label: "Dizziness" },
                    { value: "Rash", label: "Rash" },
                    { value: "Itching", label: "Itching" },
                    { value: "Insomnia", label: "Insomnia" },
                    { value: "Weight Loss", label: "Weight Loss" },
                    { value: "Weight Gain", label: "Weight Gain" },
                    { value: "Back Pain", label: "Back Pain" },
                    { value: "Sweating", label: "Sweating" },
                    { value: "Chills", label: "Chills" },
                    { value: "Loss of Appetite", label: "Loss of Appetite" },
                    { value: "Urinary Pain", label: "Urinary Pain" },
                    {
                      value: "Frequent Urination",
                      label: "Frequent Urination",
                    },
                    { value: "Blurred Vision", label: "Blurred Vision" },
                    {
                      value: "Ringing in Ears",
                      label: "Ringing in Ears (Tinnitus)",
                    },
                    { value: "Mouth Sores", label: "Mouth Sores" },
                    { value: "Fainting", label: "Fainting" },
                    { value: "Swelling", label: "Swelling" },
                    { value: "Numbness", label: "Numbness" },
                    {
                      value: "Tingling Sensation",
                      label: "Tingling Sensation",
                    },
                    { value: "Coughing up Blood", label: "Coughing up Blood" },
                    { value: "Persistent Cough", label: "Persistent Cough" },
                    {
                      value: "Difficulty Swallowing",
                      label: "Difficulty Swallowing",
                    },
                    { value: "Mucus Production", label: "Mucus Production" },
                    { value: "Rash on Skin", label: "Rash on Skin" },
                    { value: "Abnormal Bleeding", label: "Abnormal Bleeding" },
                    { value: "Persistent Thirst", label: "Persistent Thirst" },
                    { value: "Sore Joints", label: "Sore Joints" },
                    { value: "Shivering", label: "Shivering" },
                    {
                      value: "Heart Palpitations",
                      label: "Heart Palpitations",
                    },
                  ]}
                />
              </Form.Item>
            </Card>
            <Card title="Additional Details" className="basis-1/2 border-2">
              <Form.Item
                name={"date"}
                label="Date"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select the date of visit!",
                  },
                ]}
              >
                <DatePicker style={{ width: "40%" }} maxDate={dayjs()} />
              </Form.Item>
              <Form.Item
                name={"time"}
                label="Time"
                required
                rules={[
                  {
                    required: true,
                    message: "Please select the time of visit!",
                  },
                ]}
              >
                <TimePicker style={{ width: "40%" }} />
              </Form.Item>
              <Form.Item
                name={"location"}
                label="Location"
                required
                rules={[
                  {
                    required: true,
                    message: "Please input the location of visit!",
                  },
                ]}
              >
                <Input placeholder="Clinic XYZ" style={{ width: "70%" }} />
              </Form.Item>
              <Form.Item name={"remark"} label="Remarks">
                <Input.TextArea
                  placeholder="Additional Information"
                  style={{ width: "100%", height: "80px" }}
                />
              </Form.Item>
            </Card>
          </div>
        </Space>
        <Form.Item className="grid justify-items-end ">
          <Button
            type="primary"
            htmlType="submit"
            className=" px-8 py-4 mt-4 text-lg"
          >
            Submit Record
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default MedicalRecord;
