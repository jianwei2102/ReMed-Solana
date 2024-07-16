import { Card, Form, Input } from "antd";

const BloodCount = () => {
  return (
    <Card title="Complete Blood Count (CBC)" className="border-2">
      <Form.Item
        name="whiteBloodCells"
        label="White Blood Cells (WBC)"
        rules={[
          {
            required: true,
            message: "Please input the white blood cell count!",
          },
        ]}
      >
        <Input
          addonAfter="x 10^3/μL"
          placeholder="7.2"
          style={{ width: "50%" }}
        />
      </Form.Item>
      <Form.Item
        name="redBloodCells"
        label="Red Blood Cells (RBC)"
        rules={[
          { required: true, message: "Please input the red blood cell count!" },
        ]}
      >
        <Input
          addonAfter="x 10^6/μL"
          placeholder="4.5"
          style={{ width: "50%" }}
        />
      </Form.Item>
      <Form.Item
        name="hematocrit"
        label="Hematocrit (HCT)"
        rules={[
          { required: true, message: "Please input the hematocrit level!" },
        ]}
      >
        <Input addonAfter="%" placeholder="40.5" style={{ width: "50%" }} />
      </Form.Item>
      <Form.Item
        name="hemoglobin"
        label="Hemoglobin (HGB)"
        rules={[
          { required: true, message: "Please input the hemoglobin level!" },
        ]}
      >
        <Input addonAfter="g/dL" placeholder="10.8" style={{ width: "50%" }} />
      </Form.Item>
      <Form.Item
        name="platelets"
        label="Platelets"
        rules={[
          { required: true, message: "Please input the platelet count!" },
        ]}
      >
        <Input
          addonAfter="x 10^3/μL"
          placeholder="220"
          style={{ width: "50%" }}
        />
      </Form.Item>
      <Card title="Reference Range" className="border-2 mt-4">
        <div>
          White Blood Cells (WBC):{" "}
          <span className="font-semibold">4.5-11.0</span> x 10^3/μL
        </div>
        <div>
          Red Blood Cells (RBC): <span className="font-semibold">4.5-5.9</span>{" "}
          x 10^6/μL
        </div>
        <div>
          Hematocrit (HCT): <span className="font-semibold">41.0-53.0</span>%
        </div>
        <div>
          Hemoglobin (HGB): <span className="font-semibold">12.0 - 16.0</span>{" "}
          g/dL
        </div>
        <div>
          Platelets: <span className="font-semibold">150-450</span> x 10^3/μL
        </div>
      </Card>
    </Card>
  );
};

export default BloodCount;
