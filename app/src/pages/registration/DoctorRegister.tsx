import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { createProfile } from "../../utils/util";
import { Form, Row, Col, Input, Button, Select, message } from "antd";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

const { Option } = Select;

const DoctorRegister = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    // Combine the title and full name
    const { fullName, ...rest } = values;
    const combinedFullName = `${fullName.title} ${fullName.name}`;

    // Update the values with the combined full name
    const formattedValues = {
      ...rest,
      fullName: combinedFullName,
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
      "doctor",
      JSON.stringify(formattedValues)
    );

    messageApi.destroy();
    if (response.status === "success") {
      messageApi.open({
        type: "success",
        content: "User profile created successfully",
      });
      navigate("/authorization");
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
        {/* Left Section */}
        <Col span={12} className=" !pl-4">
          <Form.Item>
            <div className="text-lg italic font-semibold">Doctor Profile</div>
          </Form.Item>
          <Form.Item
            name={["fullName"]}
            label="Full Name"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's full name!",
              },
            ]}
          >
            <Input.Group compact>
              <Form.Item
                name={["fullName", "title"]}
                noStyle
                initialValue="Dr."
              >
                <Select style={{ width: "25%" }} defaultValue="Dr.">
                  <Option value="Dr.">Dr.</Option>
                  <Option value="MD">MD</Option>
                  <Option value="DO">DO</Option>
                  <Option value="Prof.">Prof.</Option>
                  <Option value="Consultant">Consultant</Option>
                  <Option value="Specialist">Specialist</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name={["fullName", "name"]}
                noStyle
                rules={[
                  {
                    required: true,
                    message: "Please input the doctor's full name!",
                  },
                ]}
              >
                <Input placeholder="Rayon Robert" style={{ width: "70%" }} />
              </Form.Item>
            </Input.Group>
          </Form.Item>
          <Form.Item
            name={["specialization"]}
            label="Specialization"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's specialization!",
              },
            ]}
          >
            <Select
              placeholder="Select Specialization"
              style={{ width: "95%" }}
            >
              <Select.Option value="Radiologist">Radiologist</Select.Option>
              <Select.Option value="Oncologist">Oncologist</Select.Option>
              <Select.Option value="Neurologist">Neurologist</Select.Option>
              <Select.Option value="Pharmacist">Pharmacist</Select.Option>
              <Select.Option value="Pediatrician">Pediatrician</Select.Option>
              <Select.Option value="Cardiologist">Cardiologist</Select.Option>
              <Select.Option value="Gynecologist">Gynecologist</Select.Option>
              <Select.Option value="Ophthalmologist">
                Ophthalmologist
              </Select.Option>
              <Select.Option value="General Practitioner">
                General Practitioner
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name={["medicalLicenseNumber"]}
            label="Medical License Number"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's medical license number!",
              },
            ]}
          >
            <Input placeholder="123456789" style={{ width: "95%" }} />
          </Form.Item>
          <Form.Item
            name={["affiliations"]}
            label="Affiliations"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's affiliations!",
              },
            ]}
          >
            <Input
              placeholder="Hospital ABC, Clinic XYZ"
              style={{ width: "95%" }}
            />
          </Form.Item>
          <Form.Item
            name={["workHours"]}
            label="Work Hours"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's work hours!",
              },
            ]}
          >
            <Input
              placeholder="Mon-Fri 9:00 AM - 5:00 PM"
              style={{ width: "95%" }}
            />
          </Form.Item>
        </Col>

        {/* Right Section */}
        <Col span={12} className="!pl-4">
          <Form.Item></Form.Item>
          <Form.Item
            name={["education"]}
            label="Education"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's education!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Medical School, Degrees, Certifications"
              style={{ width: "95%", height: "80px" }}
            />
          </Form.Item>
          <Form.Item
            name={["experience"]}
            label="Experience"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's experience!",
              },
            ]}
          >
            <Input.TextArea
              placeholder="Years of practice, previous positions"
              style={{ width: "95%", height: "80px" }}
            />
          </Form.Item>
          <Form.Item
            name={["languagesSpoken"]}
            label="Languages Spoken"
            required
            rules={[
              {
                required: true,
                message: "Please input the languages the doctor can speak!",
              },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: "95%" }}
              placeholder="Type or select languages spoken"
              // onChange={handleChange}
              options={[
                { value: "English", label: "English" },
                { value: "Spanish", label: "Spanish" },
                { value: "French", label: "French" },
                { value: "German", label: "German" },
                { value: "Chinese", label: "Chinese" },
                { value: "Japanese", label: "Japanese" },
                { value: "Korean", label: "Korean" },
                { value: "Arabic", label: "Arabic" },
                { value: "Russian", label: "Russian" },
                { value: "Italian", label: "Italian" },
                { value: "Portuguese", label: "Portuguese" },
                { value: "Hindi", label: "Hindi" },
                { value: "Bengali", label: "Bengali" },
                { value: "Punjabi", label: "Punjabi" },
                { value: "Telugu", label: "Telugu" },
                { value: "Marathi", label: "Marathi" },
                { value: "Tamil", label: "Tamil" },
                { value: "Urdu", label: "Urdu" },
                { value: "Gujarati", label: "Gujarati" },
                { value: "Kannada", label: "Kannada" },
                { value: "Odia", label: "Odia" },
                { value: "Malay", label: "Malay" },
                { value: "Sindhi", label: "Sindhi" },
                { value: "Assamese", label: "Assamese" },
                { value: "Maithili", label: "Maithili" },
                { value: "Santali", label: "Santali" },
                { value: "Kashmiri", label: "Kashmiri" },
                { value: "Nepali", label: "Nepali" },
                { value: "Sanskrit", label: "Sanskrit" },
                { value: "Konkani", label: "Konkani" },
                { value: "Dogri", label: "Dogri" },
                { value: "Bodo", label: "Bodo" },
                { value: "Manipuri", label: "Manipuri" },
                { value: "Khasi", label: "Khasi" },
                { value: "Mizo", label: "Mizo" },
              ]}
            />
          </Form.Item>
          <Form.Item
            name={["contactInformation"]}
            label="Contact Information"
            required
            rules={[
              {
                required: true,
                message: "Please input the doctor's contact information!",
              },
            ]}
          >
            <Input placeholder="Phone number" style={{ width: "95%" }} />
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

export default DoctorRegister;