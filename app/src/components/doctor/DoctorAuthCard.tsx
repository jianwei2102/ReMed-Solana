import { useEffect, useState } from "react";
import { Button, Col, message, Row } from "antd";
import { Wallet, web3 } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { decryptProfile, fetchProfile, revokePatient } from "../../utils/util";

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


const DoctorAuthCard = ({
    patientDetails,
    revokePatientCallback,
}: DoctorAuthCardProps) => {
    const { connection } = useConnection();
    const wallet = useAnchorWallet() as Wallet;
    const [messageApi, contextHolder] = message.useMessage();

    const [profile, setProfile] = useState<MedicalRecord | undefined>();

    useEffect(() => {
        const getProfile = async () => {
            const publicKey = new web3.PublicKey(patientDetails.address);
            const doctorWallet = { publicKey };
            let response = await fetchProfile(connection, doctorWallet as Wallet);
            if (response.status === "success") {
                const decryptedProfile = decryptProfile(
                    (response.data as { personalDetails: string })["personalDetails"]
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
        <Row className="border my-2 mr-2 py-4 px-8 rounded-lg">
            {contextHolder}
            <Col span={16} className="flex flex-col justify-center items-start">
                {/* <span className="bg-[#CCFCD9] text-[#008124] px-4 rounded-full">
                    as
                </span>
                <span className="font-semibold text-lg">as</span>
                as
                <span>
                    4.5 <span className="text-gray-500">(21)</span>
                </span> */}
                {profile?.patient.name}
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
                    onClick={() => revokePatientFunc(patientDetails.address)}
                >
                    Revoke
                </Button>
            </Col>
        </Row>
    )
}

export default DoctorAuthCard