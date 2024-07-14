import { Col, Row } from "antd";
import img from "../assets/welcomingIllustration.png";

const Welcoming = () => {
  return (
    <>
      <Row className="flex justify-center mt-32">
        <Col>
          <img
            className="w-full h-full object-contain"
            src={img}
            alt="Patient Illustration"
          />
        </Col>
      </Row>
      <Row className="flex justify-center mt-16">
        <Col>
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-4xl font-semibold">Welcome to ReMed</div>
            <div className="text-lg text-gray-500 mt-4 text-center">
              Deliver trusted healthcare and manage patient records with ease!
              <div className="italic text-sm mt-2">
                Login with your Solana wallet to get started!
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Welcoming;
