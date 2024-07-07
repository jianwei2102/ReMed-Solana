import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Wallet } from "@project-serum/anchor";
import { createProfile } from "../../utils/util";
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
} from "antd";

const PatientRegister = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [messageApi, contextHolder] = message.useMessage();

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
    console.log("Received values of form: ", formattedValues);

    messageApi.open({
      type: "loading",
      content: "Transaction in progress..",
      duration: 0,
    });

    let response = await createProfile(
      connection,
      wallet as Wallet,
      "patient",
      JSON.stringify(formattedValues)
    );
    
    messageApi.destroy();
    if (response.status === "success") {
      messageApi.open({
        type: "success",
        content: "User profile created successfully",
      });
      navigate("/doctor/authorization");
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
            <DatePicker style={{ width: "95%" }} />
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
            name={["nextOfKin", "relationship"]} // Nested field for next of kin relationship
            label="Relationship"
            required
            rules={[
              { required: true, message: "Please input the relationship!" },
            ]}
          >
            <Input placeholder="Spouse" style={{ width: "95%" }} />
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
            <DatePicker style={{ width: "95%" }} />
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
