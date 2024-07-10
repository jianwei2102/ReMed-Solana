import { useEffect, useState } from "react";
import { Col, Row, Button, message } from "antd";
import { Wallet, web3 } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { decryptProfile, fetchProfile, revokeDoctor } from "../../utils/util";

interface AuthorizationCardProps {
  doctorDetails: { address: string, date: string };
  revokeDoctorCallback: (doctorAddress: string) => void;
}

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

const AuthorizationCard = ({
  doctorDetails,
  revokeDoctorCallback,
}: AuthorizationCardProps) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [messageApi, contextHolder] = message.useMessage();

  const [profile, setProfile] = useState<Profile | undefined>();

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
    <Row className="border my-2 mr-2 py-4 px-8 rounded-lg">
      {contextHolder}
      <Col span={16} className="flex flex-col justify-center items-start">
        <span className="bg-[#CCFCD9] text-[#008124] px-4 rounded-full">
          {profile?.specialization}
        </span>
        <span className="font-semibold text-lg">{profile?.fullName}</span>
        {profile?.affiliations}
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
          onClick={() => revokeDoc(doctorDetails.address)}
        >
          Revoke
        </Button>
      </Col>
    </Row>
  );
};

export default AuthorizationCard;
