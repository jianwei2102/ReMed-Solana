import { useEffect, useState } from "react";
import { Wallet, web3 } from "@project-serum/anchor";
import { Col, Row, Button, message, Drawer, Divider } from "antd";
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

interface DescriptionItemProps {
  title: string;
  content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
  <div className="mb-[7px] text-black/65 text-[14px] leading-[1.5715]">
    <p className="inline-block text-black/85"> {title ? `${title}:` : ""}</p>
    <span className={`${title ? "ml-2" : ""}`} dangerouslySetInnerHTML={{ __html: (content as string).replace(/\n/g, '<br />') }} />
  </div>
);

const AuthorizationCard = ({
  doctorDetails,
  revokeDoctorCallback,
}: AuthorizationCardProps) => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState<Profile | undefined>();

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

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
    <>
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
            onClick={showDrawer}
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

      {/* Doctor Profile Drawer */}
      <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
        <p className="block text-black/85 text-[18px] leading-[1.5715] mb-6">
          Doctor Profile
        </p>
        <p className="block mb-4 text-black/85 text-[16px] leading-[1.5715]">Personal Info</p>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Full Name" content={profile?.fullName} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Medical License Number" content={profile?.medicalLicenseNumber} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Affiliations" content={profile?.affiliations} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Specialization" content={profile?.specialization} />
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <DescriptionItem title="Work Hours" content={profile?.workHours} />
          </Col>
          <Col span={12}>
            <DescriptionItem title="Contact Details" content={profile?.contactInformation} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Language Spoken" content={profile?.languagesSpoken.join(', ')} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem
              title="Authorized Date"
              content={doctorDetails.date}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <DescriptionItem title="Account Address" content={doctorDetails.address} />
          </Col>
        </Row>
        <Divider />
        <p className="block mb-4 text-black/85 text-[16px] leading-[1.5715]">Education</p>
        <Row>
          <Col span={24}>
            <DescriptionItem title="" content={profile?.education} />
          </Col>
        </Row>
        <Divider />
        <p className="block mb-4 text-black/85 text-[16px] leading-[1.5715]">Experience</p>
        <Row>
          <Col span={24}>
            <DescriptionItem title="" content={profile?.experience} />
          </Col>
        </Row>
      </Drawer>
    </>
  );
};

export default AuthorizationCard;
