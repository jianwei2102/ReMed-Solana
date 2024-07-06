import { Wallet } from "@project-serum/anchor";
import { Col, Row, Image, Button } from "antd";
import { revokeDoctor } from "../../utils/util";
import doctorImage from "../../assets/doctor.png";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

interface DoctorAuthorizedProps {
  address: string;
  revokeDoctorCallback: (doctorAddress: string) => void;
}

const DoctorAuthorized = ({
  address,
  revokeDoctorCallback,
}: DoctorAuthorizedProps) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const revokeDoc = async (doctorAddress: string) => {
    let response = await revokeDoctor(
      connection,
      wallet as Wallet,
      doctorAddress
    );
    if (response.status === "success") {
      revokeDoctorCallback(doctorAddress);
    }
  };

  return (
    <Row className="border mb-4 py-4 rounded-lg">
      <Col span={2} className="flex flex-col justify-center items-center">
        <Image width={64} className="rounded-full" src={doctorImage} />
      </Col>
      <Col span={14} className="flex flex-col justify-center items-start">
        <span className="bg-[#CCFCD9] text-[#008124] px-4 rounded-full">
          Pharmacist
        </span>
        <span className="font-semibold text-lg">Dr. Rayon Robert</span>
        Rayon Pharmacy
        <span>
          4.5 <span className="text-gray-500">(21)</span>
        </span>
      </Col>
      <Col span={4} className="flex flex-col justify-center items-center">
        <span className="font-semibold">Requested Date:</span>
        January 14, 2024
      </Col>
      <Col span={4} className="flex flex-col justify-center items-center">
        <Button
          className="rounded-full text-lg bg-[#1FC7C7] hover:!bg-[#16D1D1] mr-4"
          type="primary"
          block
        >
          View Profile
        </Button>
        <Button
          className="rounded-full mt-1 text-lg mr-4"
          type="primary"
          danger
          block
          onClick={() => revokeDoc(address)}
        >
          Revoke
        </Button>
      </Col>
    </Row>
  );
};

export default DoctorAuthorized;
