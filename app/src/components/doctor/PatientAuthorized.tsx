import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Wallet, web3 } from "@project-serum/anchor";
import { fetchProfile, decryptData, revokePatient } from "../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Col,
  Row,
  Image,
  Button,
  message,
  Drawer,
  Divider,
  Avatar,
} from "antd";

interface PatientAuthorizedProps {
  patientDetails: { address: string; date: string };
  revokePatientCallback: (patientAddress: string) => void;
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
    <span className="inline-block text-black/85">
      {title ? `${title}:` : ""}
    </span>
    <span
      className={`${title ? "ml-2" : ""}`}
      dangerouslySetInnerHTML={{
        __html: (content as string).replace(/\n/g, "<br />"),
      }}
    />
  </div>
);

const PatientAuthorized = ({
  patientDetails,
  revokePatientCallback,
}: PatientAuthorizedProps) => {
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
      const patientWallet = { publicKey };
      let response = await fetchProfile(connection, patientWallet as Wallet);
      if (response.status === "success") {
        const decryptedProfile = decryptData(
          (response.data as { personalDetails: string })["personalDetails"],
          "profile"
        );
        setProfile(JSON.parse(decryptedProfile));
      } else {
        // Handle profile not found case
        setProfile(undefined);
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

    let response = await revokePatient(connection, wallet, patientAddress);
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
      <Row className="border mb-4 py-4 rounded-lg">
        {contextHolder}
        <Col span={2} className="flex flex-col justify-center items-center">
          <Avatar
            size={64}
            icon={
              profile?.patient ? (
                <Image
                  src={`https://${process.env.REACT_APP_ThirdWeb_Client_ID}.ipfscdn.io/ipfs/${profile?.patient.image}/`}
                  alt="Avatar Image"
                />
              ) : undefined
            }
            className="mr-2"
          />
        </Col>
        <Col span={14} className="flex flex-col justify-center items-start">
          <span className="font-semibold text-lg">
            {profile?.patient ? profile?.patient.name : "Profile not found"}
          </span>
          Contact: {profile?.patient ? profile?.patient.phoneNo : "N/A"}
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
            className="rounded-full text-lg bg-[#1FC7C7] hover:!bg-[#16D1D1] mr-4"
            type="primary"
            block
            onClick={showDrawer}
          >
            View Profile
          </Button>
          <Button
            className="rounded-full mt-1 text-lg mr-4"
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
        <div className="text-xl mb-6 italic">Patient Profile</div>
        {profile ? (
          <>
            <div className="mb-4 text-lg font-semibold">
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
            </div>
            <Row>
              <Col span={12}>
                <DescriptionItem
                  title="Full Name"
                  content={profile?.patient.name}
                />
              </Col>
              <Col span={12}>
                <DescriptionItem
                  title="Gender"
                  content={profile?.patient.gender}
                />
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
            <div className="mb-4 text-lg font-semibold">
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
            </div>
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
                <Link
                  to={"/doctor/viewRecord"}
                  state={{
                    address: patientDetails.address,
                    name: profile?.patient.name,
                  }}
                >
                  <Button size="large">View Record</Button>
                </Link>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col span={24} className="flex items-center justify-center">
                <Link
                  to={"/doctor/appendRecord"}
                  state={{
                    address: patientDetails.address,
                    name: profile?.patient.name,
                  }}
                >
                  <Button size="large">Append Record</Button>
                </Link>
              </Col>
            </Row>
          </>
        ) : (
          <div className="text-red-500 text-lg">
            Profile not found. Please revoke the authorization. <br />
            Account:
            {patientDetails.address}
          </div>
        )}
      </Drawer>
    </>
  );
};

export default PatientAuthorized;
