import { Col, Row, Button } from "antd";

const AuthorizationCard = () => {
  return (
    <Row className="border my-2 mr-2 py-4 px-8 rounded-lg">
      <Col span={16} className="flex flex-col justify-center items-start">
        <span className="bg-[#CCFCD9] text-[#008124] px-4 rounded-full">
          Pharmacist
        </span>
        <span className="font-semibold text-lg">Dr. Rayon Robert</span>
        Rayon Pharmacy
        <span>
          4.5 <span className="text-gray-500">(21)</span>
        </span>
      </Col>
      <Col span={8} className="flex flex-col justify-center items-center">
        <Button
          className="rounded-full text-lg bg-[#1FC7C7] hover:!bg-[#16D1D1]"
          type="primary"
          block
        >
          View Profile
        </Button>
        <Button
          className="rounded-full mt-1 text-lg"
          type="primary"
          danger
          block
        >
          Revoke
        </Button>
      </Col>
    </Row>
  );
};

export default AuthorizationCard;
