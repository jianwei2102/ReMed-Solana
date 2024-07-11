import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet, web3 } from "@project-serum/anchor";
import { Button, Col, message, Row, Divider, Drawer } from "antd";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { decryptData, fetchProfile, revokePatient } from "../../utils/util";

interface DoctorAuthCardProps {
    patientDetails: { address: string, date: string };
    revokePatientCallback: (doctorAddress: string) => void;
}

interface Patient {
    name: string;
    gender: string;
    bloodGroup: string;
    dateOfBirth: string;
    phoneNo: string;
    address: string;
}

interface NextOfKin {
    name: string;
    relationship: string;
    gender: string;
    dateOfBirth: string;
    phoneNo: string;
    address: string;
}

interface MedicalRecord {
    patient: Patient;
    nextOfKin: NextOfKin;
}

interface DescriptionItemProps {
    title: string;
    content: React.ReactNode;
}

const DescriptionItem = ({ title, content }: DescriptionItemProps) => (
    <div className="mb-[7px] text-black/65 text-[14px] leading-[1.5715]">
        <p className="inline-block mr-2 text-black/85">{title}:</p>
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
    const [profile, setProfile] = useState<MedicalRecord | undefined>();

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
                    (response.data as { personalDetails: string })["personalDetails"], "record"
                );
                setProfile(JSON.parse(decryptedProfile));
                console.log(JSON.parse(decryptedProfile));
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
                <Col span={16} className="flex flex-col justify-center items-start">
                    <span className="font-semibold text-lg">{profile?.patient.name}</span>
                    <span> Authorize:
                        <span className="text-gray-500"> {patientDetails.date}</span>
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
                        onClick={() => revokePatientFunc(patientDetails.address)}
                    >
                        Revoke
                    </Button>
                </Col>
            </Row>

            {/* Patient Profile Drawer */}
            <Drawer width={640} placement="right" closable={false} onClose={onClose} open={open}>
                <p className="block text-black/85 text-[18px] leading-[1.5715] mb-6">
                    Patient Profile
                </p>
                <p className="block mb-4 text-black/85 text-[16px] leading-[1.5715]">Patient</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Full Name" content={profile?.patient.name} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Gender" content={profile?.patient.gender} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Blood Group" content={profile?.patient.bloodGroup} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Date Of Birth" content={profile?.patient.dateOfBirth} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Phone No." content={profile?.patient.phoneNo} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Address" content={profile?.patient.address} />
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
                <p className="block mb-4 text-black/85 text-[16px] leading-[1.5715]">Next of Kin</p>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Full Name" content={profile?.nextOfKin.name} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Gender" content={profile?.nextOfKin.gender} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Relationship" content={profile?.nextOfKin.relationship} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Date of Birth" content={profile?.nextOfKin.dateOfBirth} />
                    </Col>
                </Row>
                <Row>
                    <Col span={12}>
                        <DescriptionItem title="Phone No." content={profile?.nextOfKin.phoneNo} />
                    </Col>
                    <Col span={12}>
                        <DescriptionItem title="Address" content={profile?.nextOfKin.address} />
                    </Col>
                </Row>
                <Divider />
                <Row className="flex justify-evenly ">
                    <Col span={12}>
                        <Button>View Record</Button>
                    </Col>
                    <Col span={12}>
                        <Button onClick={() => navigate('/doctor/medicalRecord')}>Append Record</Button>
                    </Col>
                </Row>
            </Drawer>
        </>
    )
}

export default DoctorAuthCard