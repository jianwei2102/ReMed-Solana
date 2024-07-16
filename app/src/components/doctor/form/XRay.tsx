import React from "react";
import { Card, Form, Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/es/upload/interface";

const { TextArea } = Input;

interface XRayProps {
  fileList: UploadFile[];
  setFileList: React.Dispatch<React.SetStateAction<UploadFile[]>>;
}

const XRay: React.FC<XRayProps> = ({ fileList, setFileList }) => {
  const handleUploadChange = ({ fileList }: { fileList: UploadFile[] }) => {
    setFileList(fileList);
  };

  return (
    <Card title="X-Ray Results" className="border-2">
      <Form.Item
        name="xrayResult"
        label="X-Ray Result"
        rules={[{ required: true, message: "Please input the X-Ray result!" }]}
      >
        <TextArea placeholder="No abnormalities detected." />
      </Form.Item>
      <Form.Item
        label="Upload X-Ray Images"
        rules={[
          {
            required: true,
            message: "Please upload at least one X-Ray image!",
          },
        ]}
      >
        <Upload
          multiple
          listType="picture"
          fileList={fileList}
          onChange={handleUploadChange}
          beforeUpload={() => false}
        >
          <Button icon={<UploadOutlined />}>Select Files</Button>
        </Upload>
      </Form.Item>
    </Card>
  );
};

export default XRay;
