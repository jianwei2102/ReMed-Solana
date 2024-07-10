import { FaStar } from "react-icons/fa";
import { useEffect, useState } from "react";
import doctorImage from "../../assets/doctor.png";
import { Wallet, web3 } from "@project-serum/anchor";
import { Col, Row, Image, Button, message } from "antd";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { fetchProfile, decryptProfile, revokeDoctor } from "../../utils/util";

interface DoctorAuthorizedProps {
  doctorDetails: { address: string, date: string };
  revokeDoctorCallback: (doctorAddress: string) => void;
}

const DoctorAuthorized = ({
  doctorDetails,
  revokeDoctorCallback,
}: DoctorAuthorizedProps) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [messageApi, contextHolder] = message.useMessage();
  const [profile, setProfile] = useState<Profile | undefined>();

  interface Profile {
    specialization: string;
    medicalLicenseNumber: string;
    affiliations: string;
    workHours: string;
    education: string;
    experience: string;
    languagesSpoken: string[];
    contactInformation: string;
    fullName: string;
  }

  useEffect(() => {
    const getProfile = async () => {
      const publicKey = new web3.PublicKey(doctorDetails.address);
      const doctorWallet = { publicKey };
      let response = await fetchProfile(connection, doctorWallet as Wallet);
      if (response.status === "success") {
        const decryptedProfile = decryptProfile(
          (response.data as { personalDetails: string })["personalDetails"]
        );
        setProfile(JSON.parse(decryptedProfile));
      }
    };

    getProfile();
  }, [connection, doctorDetails]);

  const revokeDoc = async (doctorAddress: string) => {
    messageApi.open({
      type: "loading",
      content: "Transaction in progress..",
      duration: 0,
    });

    let response = await revokeDoctor(
      connection,
      wallet as Wallet,
      doctorAddress
    );
    messageApi.destroy();
    
    if (response.status === "success") {
      revokeDoctorCallback(doctorAddress);
    } else {
      messageApi.open({
        type: "error",
        content: "Error revoking doctor profile",
      });
    }
  };

  return (
    <Row className="border mb-4 py-4 rounded-lg">
      {contextHolder}
      <Col span={2} className="flex flex-col justify-center items-center">
        <Image width={64} className="rounded-full" src={doctorImage} />
      </Col>
      <Col span={14} className="flex flex-col justify-center items-start">
        <span className="bg-[#CCFCD9] text-[#008124] px-4 rounded-full">
          {profile?.specialization}
        </span>
        <span className="font-semibold text-lg">{profile?.fullName}</span>
        {profile?.affiliations}
        <div className="flex items-center justify-center">
          <FaStar color="blue" size={12} className="mr-1"/>
          4.5 <span className="text-gray-500">(21)</span>
        </div>
      </Col>
      <Col span={4} className="flex flex-col justify-center items-center">
        <span className="font-semibold">Requested Date:</span>
        {doctorDetails.date}
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
          onClick={() => revokeDoc(doctorDetails.address)}
        >
          Revoke
        </Button>
      </Col>
    </Row>
  );
};

export default DoctorAuthorized;
