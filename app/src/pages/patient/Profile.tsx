import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "@project-serum/anchor";
import { Avatar, Card, Col, Image, Row, Space } from "antd";
import { decryptData, fetchProfile } from "../../utils/util";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

interface PatientDetails {
  name: string;
  gender: string;
  bloodGroup: string;
  dateOfBirth: string;
  phoneNo: string;
  address: string;
  image: string;
}

interface NextOfKinDetails {
  name: string;
  gender: string;
  relationship: string;
  dateOfBirth: string;
  phoneNo: string;
  address: string;
  image: string;
}

interface ProfileDetails {
  patient: PatientDetails;
  nextOfKin: NextOfKinDetails;
}

const Profile = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;

  const [details, setDetails] = useState<ProfileDetails | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      if (!connection || !wallet) {
        navigate("/");
        return;
      }

      let response = await fetchProfile(connection, wallet);
      if (response.status === "success") {
        const role = (response.data as { role: string }).role;
        if (role === "patient") {
          let personalDetails = (response.data as { personalDetails: string })[
            "personalDetails"
          ];
          let details = JSON.parse(decryptData(personalDetails, "profile"));
          setDetails(details);
        } else if (role === "doctor") {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    };

    getProfile();
  }, [connection, wallet, navigate]);

  return (
    <Space direction="vertical" size={22} className="w-full">
      <Card
        title={
          <Row className="py-2" gutter={10}>
            <Col>
              <Avatar
                size={48}
                icon={
                  <Image
                    src={`https://69784692103c87e7e76471acf5f2c663.ipfscdn.io/ipfs/${details?.patient.image}/`}
                    alt="Avatar Image"
                  />
                }
              />
            </Col>
            <Col>
              <div>{details?.patient.name}</div>
              <div className="font-normal">{wallet.publicKey.toBase58()}</div>
            </Col>
          </Row>
        }
        extra={"QR Code"}
      >
        <div className="w-full">
          <Row>
            <Col span={4} className="font-bold">
              Gander
            </Col>
            <Col span={20}>{details?.patient.gender}</Col>
          </Row>
          <Row>
            <Col span={4} className="font-bold">
              Blood Group
            </Col>
            <Col span={20}>{details?.patient.gender}</Col>
          </Row>
          <Row>
            <Col span={4} className="font-bold">
              Date of Birth
            </Col>
            <Col span={20}>{details?.patient.gender}</Col>
          </Row>
          <Row>
            <Col span={4} className="font-bold">
              Phone No.
            </Col>
            <Col span={20}>{details?.patient.gender}</Col>
          </Row>
          <Row>
            <Col span={4} className="font-bold">
              Address
            </Col>
            <Col span={20}>{details?.patient.gender}</Col>
          </Row>
        </div>
      </Card>
      <Card size="small" title="Small size card" style={{ width: "100%" }}>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </Card>
    </Space>
  );
};

export default Profile;
