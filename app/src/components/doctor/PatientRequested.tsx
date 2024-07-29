import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Wallet, web3 } from "@project-serum/anchor";
import { useConnection } from "@solana/wallet-adapter-react";
import { fetchProfile, decryptData } from "../../utils/util";
import { Avatar, Button, Col, message, Row, Image } from "antd";

interface Patient {
  name: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  phoneNo: string;
  address: string;
  image: string;
}

interface NextOfKin {
  name: string;
  gender: string;
  relationship: string;
  dateOfBirth: string;
  phoneNo: string;
  address: string;
  image: string;
}

interface PatientProfile {
  patient: Patient;
  nextOfKin: NextOfKin;
}

interface PatientRequestedProps {
  patientDetails: {
    id: string;
    address: string;
    date: string;
  };
  revokePatientCallback: (patientId: string) => void;
}

const PatientRequested = ({
  patientDetails,
  revokePatientCallback,
}: PatientRequestedProps) => {
  const { connection } = useConnection();
  const [messageApi, contextHolder] = message.useMessage();

  const [profile, setProfile] = useState<PatientProfile | undefined>();

  useEffect(() => {
    const getProfile = async () => {
      const publicKey = new web3.PublicKey(patientDetails.address);
      const patientWallet = { publicKey };
      let response = await fetchProfile(connection, patientWallet as Wallet);
      if (response.status === "success") {
        const decryptedProfile = decryptData(
          (response.data as { personalDetails: string })["personalDetails"],
          "profile"
        );
        setProfile(JSON.parse(decryptedProfile));
      }
    };

    getProfile();
  }, [connection, patientDetails]);

  const revokePatientFunc = async () => {
    messageApi.open({
      type: "loading",
      content: "Transaction in progress..",
      duration: 0,
    });

    try {
      // Call the callback with patient ID
      await revokePatientCallback(patientDetails.id);
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error revoking patient profile",
      });
    } finally {
      messageApi.destroy();
    }
  };

  return (
    <>
      <Row className="border mb-4 py-4 rounded-lg">
        {contextHolder}
        <Col span={2} className="flex flex-col justify-center items-center">
          <Avatar
            size={64}
            icon={
              <Image
                src={`https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${profile?.patient.image}/`}
                alt="Avatar Image"
              />
            }
            className="mr-2"
          />
        </Col>
        <Col span={14} className="flex flex-col justify-center items-start">
          <span className="font-semibold text-lg">{profile?.patient.name}</span>
          Contact: {profile?.patient.phoneNo}
          <div className="flex items-center justify-center">
            <FaStar color="blue" size={12} className="mr-1" />
            4.5 <span className="text-gray-500">(21)</span>
          </div>
        </Col>
        <Col span={4} className="flex flex-col justify-center items-center">
          <span className="font-semibold">Requested Date:</span>
          {patientDetails.date}
        </Col>
        <Col span={4} className="flex flex-col justify-center items-center">
          <Button
            className="rounded-full mt-1 text-lg mr-4"
            type="primary"
            danger
            block
            onClick={revokePatientFunc} // Trigger revoke function
          >
            Remove
          </Button>
        </Col>
      </Row>
    </>
  );
};

export default PatientRequested;
