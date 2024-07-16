import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, web3 } from "@project-serum/anchor";
import {
  Button,
  Col,
  message,
  Row,
  Divider,
  Drawer,
  Avatar,
  Image,
} from "antd";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { decryptData, fetchProfile, revokePatient } from "../../utils/util";

interface DoctorAuthCardProps {
  patientDetails: { address: string; date: string };
  revokePatientCallback: (doctorAddress: string) => void;
}

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

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className="mb-[7px] text-black/65 text-[14px] leading-[1.5715]">
    <span className="inline-block mr-2 text-black/85">{title}:</span>
    {content}
  </div>
);

const DoctorAuthCard = ({
  patientDetails,
  revokePatientCallback,
}: DoctorAuthCardProps) => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<PatientProfile | undefined>();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const getProfile = async () => {
      const publicKey = new web3.PublicKey(patientDetails.address);
      const doctorWallet = { publicKey };
      let response = await fetchProfile(connection, doctorWallet as Wallet);
      if (response.status === "success") {
        const decryptedProfile = decryptData(
          (response.data as { personalDetails: string })["personalDetails"],
          "profile"
        );
        setProfile(JSON.parse(decryptedProfile));
        // console.log(JSON.parse(decryptedProfile));
      }
    };

    getProfile();
  }, [connection, patientDetails]);

  const revokePatientFunc = async (patientAddress: string) => {
    messageApi.open({
      type: "loading",
      content: "Transaction in progress..",
      duration: 0,
    });

    let response = await revokePatient(
      connection,
      wallet as Wallet,
      patientAddress
    );
    messageApi.destroy();

    if (response.status === "success") {
      revokePatientCallback(patientAddress);
    } else {
      messageApi.open({
        type: "error",
        content: "Error revoking patient profile",
      });
    }
  };

  return (
    <>
      <Row className="border my-2 mr-2 py-4 px-8 rounded-lg">
        {contextHolder}
        <Col span={16} className="flex flex-row justify-start items-center">
          <Avatar
            size={48}
            icon={
              <Image
                src={`https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${profile?.patient.image}/`}
                alt="Avatar Image"
              />
            }
            className="mr-2"
          />
          <div className="flex flex-col ml-2">
            <span className="font-semibold text-lg">
              {profile?.patient.name}
            </span>
            <span>
              Authorize:
              <span className="text-gray-500"> {patientDetails.date}</span>
            </span>
          </div>
        </Col>
        <Col span={8} className="flex flex-col justify-center items-center">
          <Button
            className="rounded-full text-lg bg-[#1FC7C7] hover:!bg-[#16D1D1]"
            type="primary"
            block
            onClick={showDrawer}
          >
            View Profile
          </Button>
          <Button
            className="rounded-full mt-1 text-lg"
            type="primary"
            danger
            block
            onClick={() => revokePatientFunc(patientDetails.address)}
          >
            Revoke
          </Button>
        </Col>
      </Row>

      {/* Patient Profile Drawer */}
      <Drawer
        width={640}
        placement="right"
        closable={false}
        onClose={onClose}
        open={open}
      >
        <p className="text-xl mb-6 italic">Patient Profile</p>
        <p className="mb-4 text-lg font-semibold">
          <Avatar
            size={32}
            icon={
              <Image
                src={`https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${profile?.patient.image}/`}
                alt="Avatar Image"
              />
            }
            className="mr-2"
          />
          Patient
        </p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Full Name"
              content={profile?.patient.name}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Gender" content={profile?.patient.gender} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Blood Group"
              content={profile?.patient.bloodGroup}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Date Of Birth"
              content={profile?.patient.dateOfBirth}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Phone No."
              content={profile?.patient.phoneNo}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Address"
              content={profile?.patient.address}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Authorized Date"
              content={patientDetails.date}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Account Address"
              content={patientDetails.address}
            />
          </Col>
        </Row>
        <Divider />
        <p className="mb-4 text-lg font-semibold">
          <Avatar
            size={32}
            icon={
              <Image
                src={`https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${profile?.nextOfKin.image}/`}
                alt="Avatar Image"
              />
            }
            className="mr-2"
          />
          Next of Kin
        </p>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Full Name"
              content={profile?.nextOfKin.name}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Gender"
              content={profile?.nextOfKin.gender}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Relationship"
              content={profile?.nextOfKin.relationship}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Date of Birth"
              content={profile?.nextOfKin.dateOfBirth}
            />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem
              title="Phone No."
              content={profile?.nextOfKin.phoneNo}
            />
          </Col>
          <Col span={12}>
            <DescriptionItem
              title="Address"
              content={profile?.nextOfKin.address}
            />
          </Col>
        </Row>
        <Divider />
        <Row>
          <Col span={24} className="flex items-center justify-center ">
            <Button size="large">View Record</Button>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col span={24} className="flex items-center justify-center">
            <Button
              size="large"
              onClick={() =>
                navigate(
                  `/doctor/appendRecord?address=${patientDetails.address}&name=${profile?.patient.name}`
                )
              }
            >
              Append Record
            </Button>
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default DoctorAuthCard;
