import axios from "axios";
import dayjs from "dayjs";
import { useState } from "react";
import { format } from "date-fns";
import { FaInfo } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Wallet } from "@project-serum/anchor";
import { createProfile } from "../../utils/util";
import { useStorageUpload } from "@thirdweb-dev/react";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Button,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  message,
  Image,
  Avatar,
  Tooltip,
} from "antd";

const PatientRegister = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const { mutateAsync: upload } = useStorageUpload();
  const [messageApi, contextHolder] = message.useMessage();

  const [nokFile, setNokFile] = useState<File | undefined>();
  const [nokFileUrl, setNokFileUrl] = useState<string | undefined>();
  const [patientFile, setPatientFile] = useState<File | undefined>();
  const [patientFileUrl, setPatientFileUrl] = useState<string | undefined>();

  const uploadToIpfs = async (file: File) => {
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
    const formattedValues = {
      ...values,
      patient: {
        ...values.patient,
        dateOfBirth: format(new Date(values.patient.dateOfBirth), "dd-MM-yyyy"),
      },
      nextOfKin: {
        ...values.nextOfKin,
        dateOfBirth: format(
          new Date(values.nextOfKin.dateOfBirth),
          "dd-MM-yyyy"
        ),
      },
    };

    try {
      messageApi.open({
        type: "loading",
        content: "Uploading image file(s) to IPFS..",
        duration: 0,
      });

      if (patientFile) {
        const patientCid = await uploadToIpfs(patientFile);
        formattedValues.patient.image = patientCid; // Replace image with CID
      }

      if (nokFile) {
        const nokCid = await uploadToIpfs(nokFile);
        formattedValues.nextOfKin.image = nokCid; // Replace image with CID
      }

      messageApi.destroy();
      console.log("Received values of form: ", formattedValues);
    } catch (error) {
      console.error("Error uploading file(s) to IPFS:", error);
    }

    messageApi.open({
      type: "loading",
      content: "Transaction in progress..",
      duration: 0,
    });

    let response = await createProfile(
      connection,
      wallet,
      "patient",
      JSON.stringify(formattedValues)
    );

    await axios.post("http://localhost:4000/users", {
      username: formattedValues.patient.name,
      address: wallet.publicKey.toBase58(),
      role: "doctor",
    });

    messageApi.destroy();
    if (response.status === "success") {
      messageApi.open({
        type: "success",
        content: "User profile created successfully",
      });
      setTimeout(() => {
        navigate("/doctor/authorization");
      }, 500);
    } else {
      messageApi.open({
        type: "error",
        content: "Error creating user profile",
      });
    }
  };

  return (
    <Form form={form} className="mt-4" layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Row gutter={16} className="rounded-md border">
        {/* User (Patient) Information */}
        <Col span={12} className="border-r !pl-4">
          <Form.Item>
            <div className="text-lg italic font-semibold">User Information</div>
          </Form.Item>
          <Form.Item
            name={["patient", "name"]} // Nested field for patient name
            label="Full Name"
            required
            rules={[
              { required: true, message: "Please input the user's full name!" },
            ]}
          >
            <Input placeholder="Samuel Robinson" style={{ width: "95%" }} />
          </Form.Item>
          <Form.Item
            name={["patient", "gender"]} // Nested field for patient gender
            label="Gender"
            required
            rules={[
              { required: true, message: "Please select the user's gender!" },
            ]}
          >
            <Select placeholder="Select Gender" style={{ width: "95%" }}>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["patient", "bloodGroup"]} // Nested field for patient blood group
            label="Blood Group"
            required
            rules={[
              {
                required: true,
                message: "Please select the user's blood group!",
              },
            ]}
          >
            <Select placeholder="Select Blood Group" style={{ width: "95%" }}>
              <Select.Option value="A+">A+</Select.Option>
              <Select.Option value="A-">A-</Select.Option>
              <Select.Option value="B+">B+</Select.Option>
              <Select.Option value="B-">B-</Select.Option>
              <Select.Option value="O+">O+</Select.Option>
              <Select.Option value="O-">O-</Select.Option>
              <Select.Option value="AB+">AB+</Select.Option>
              <Select.Option value="AB-">AB-</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["patient", "dateOfBirth"]} // Nested field for patient date of birth
            label="Date of Birth"
            required
            rules={[
              {
                required: true,
                message: "Please select the user's date of birth!",
              },
            ]}
          >
            <DatePicker style={{ width: "95%" }} maxDate={dayjs()} />
          </Form.Item>
          <Form.Item
            name={["patient", "phoneNo"]} // Nested field for patient phone number
            label="Phone No."
            required
            rules={[
              {
                required: true,
                message: "Please input the user's phone number!",
              },
            ]}
          >
            <Input placeholder="0121234123" style={{ width: "95%" }} />
          </Form.Item>
          <Form.Item
            name={["patient", "address"]} // Nested field for patient address
            label="Address"
            required
            rules={[
              { required: true, message: "Please input the user's address!" },
            ]}
          >
            <Input
              placeholder="No 1, Jalan Utama, Selangor"
              style={{ width: "95%" }}
            />
          </Form.Item>
          <Form.Item
            name={["patient", "image"]} // Nested field for patient image
            label={
              <span className="flex justify-center items-center">
                Profile Image
                <Tooltip title="Image will be uploaded to IPFS">
                  <Avatar
                    size={20}
                    className="bg-blue-300 ml-1"
                    icon={<FaInfo />}
                  />
                </Tooltip>
              </span>
            }
          >
            <Row className="flex justify-center items-center">
              <Col span={18}>
                <Input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setPatientFile(e.target.files[0]);
                      setPatientFileUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </Col>
              <Col span={6} className="pl-2">
                {patientFileUrl && (
                  <Avatar
                    size={48}
                    icon={<Image src={patientFileUrl} alt="img" />}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
        </Col>

        {/* Next of Kin Information */}
        <Col span={12} className="!pl-4">
          <Form.Item>
            <div className="text-lg italic font-semibold">
              Next of Kin Information
            </div>
          </Form.Item>
          <Form.Item
            name={["nextOfKin", "name"]} // Nested field for next of kin name
            label="Next of Kin Name"
            required
            rules={[
              {
                required: true,
                message: "Please input the next of kin's full name!",
              },
            ]}
          >
            <Input placeholder="Fave Robinson" style={{ width: "95%" }} />
          </Form.Item>
          <Form.Item
            name={["nextOfKin", "gender"]} // Nested field for next of kin gender
            label="Gender"
            required
            rules={[
              {
                required: true,
                message: "Please select the next of kin's gender!",
              },
            ]}
          >
            <Select placeholder="Select Gender" style={{ width: "95%" }}>
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["nextOfKin", "relationship"]} // Nested field for next of kin relationship
            label="Relationship"
            required
            rules={[
              { required: true, message: "Please select the relationship!" },
            ]}
          >
            <Select placeholder="Select Relationship" style={{ width: "95%" }}>
              <Select.Option value="Spouse">Spouse</Select.Option>
              <Select.Option value="Parent">Parent</Select.Option>
              <Select.Option value="Sibling">Sibling</Select.Option>
              <Select.Option value="Child">Child</Select.Option>
              <Select.Option value="Friend">Friend</Select.Option>
              <Select.Option value="Other">Other</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["nextOfKin", "dateOfBirth"]} // Nested field for next of kin date of birth
            label="Date of Birth"
            required
            rules={[
              {
                required: true,
                message: "Please select the next of kin's date of birth!",
              },
            ]}
          >
            <DatePicker style={{ width: "95%" }} maxDate={dayjs()} />
          </Form.Item>
          <Form.Item
            name={["nextOfKin", "phoneNo"]} // Nested field for next of kin phone number
            label="Phone No."
            required
            rules={[
              {
                required: true,
                message: "Please input the next of kin's phone number!",
              },
            ]}
          >
            <Input placeholder="0131234123" style={{ width: "95%" }} />
          </Form.Item>
          <Form.Item
            name={["nextOfKin", "address"]} // Nested field for next of kin address
            label="Address"
            required
            rules={[
              {
                required: true,
                message: "Please input the next of kin's address!",
              },
            ]}
          >
            <Input
              placeholder="No 1, Jalan Utama, Selangor"
              style={{ width: "95%" }}
            />
          </Form.Item>
          <Form.Item
            name={["nextOfKin", "image"]} // Nested field for next of kin image
            label={
              <span className="flex justify-center items-center">
                Profile Image
                <Tooltip title="Image will be uploaded to IPFS">
                  <Avatar
                    size={20}
                    className="bg-blue-300 ml-1"
                    icon={<FaInfo />}
                  />
                </Tooltip>
              </span>
            }
          >
            <Row className="flex justify-center items-center">
              <Col span={18}>
                <Input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files) {
                      setNokFile(e.target.files[0]);
                      setNokFileUrl(URL.createObjectURL(e.target.files[0]));
                    }
                  }}
                />
              </Col>
              <Col span={6} className="pl-2">
                {nokFileUrl && (
                  <Avatar
                    size={48}
                    icon={<Image src={nokFileUrl} alt="img" />}
                  />
                )}
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          className="px-8 py-4 mt-4 text-lg"
        >
          Create Profile
        </Button>
      </Form.Item>
    </Form>
  );
};

export default PatientRegister;
