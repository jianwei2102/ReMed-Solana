import { Card, Form, InputNumber } from "antd";

const VitalSign = () => {
  return (
    <Card title="Vital Signs" className="border-2">
      <Form.Item
        name="systolicBP"
        label="Systolic B.P"
        required
        rules={[
          {
            required: true,
            message: "Please input the systolic blood pressure!",
          },
        ]}
      >
        <InputNumber
          addonAfter="mmHg"
          placeholder="120"
          style={{ width: "35%" }}
        />
      </Form.Item>
      <Form.Item
        name="diastolicBP"
        label="Diastolic B.P"
        required
        rules={[
          {
            required: true,
            message: "Please input the diastolic blood pressure!",
          },
        ]}
      >
        <InputNumber
          addonAfter="mmHg"
          placeholder="80"
          style={{ width: "35%" }}
        />
      </Form.Item>
      <Form.Item
        name="heartRate"
        label="Heart Rate"
        required
        rules={[
          {
            required: true,
            message: "Please input the heart rate!",
          },
        ]}
      >
        <InputNumber
          addonAfter="bpm"
          placeholder="120"
          style={{ width: "35%" }}
        />
      </Form.Item>
      <Form.Item
        name="bodyTemperature"
        label="Body Temperature"
        required
        rules={[
          {
            required: true,
            message: "Please input the body temperature!",
          },
        ]}
      >
        <InputNumber
          addonAfter="°C"
          placeholder="37"
          style={{ width: "35%" }}
        />
      </Form.Item>
    </Card>
  );
};

export default VitalSign;
