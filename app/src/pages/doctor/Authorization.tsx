import { useNavigate } from "react-router-dom";
import { Wallet, web3 } from "@project-serum/anchor";
import { useCallback, useEffect, useState } from "react";
import { PatientAuthorized, QRReader } from "../../components";
import { fetchAuthPatient, fetchProfile } from "../../utils/util";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  Button,
  Divider,
  Flex,
  Input,
  message,
  Modal,
  Segmented,
  Space,
} from "antd";

interface AuthorizedPatient {
  address: string;
  date: string;
}

const Authorization = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [patientAddress, setPatientAddress] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [authorized, setAuthorized] = useState<AuthorizedPatient[]>([]);
  const [segmentedValue, setSegmentedValue] = useState<string>("View All");

  const getAuthPatient = useCallback(async () => {
    if (connection && wallet) {
      let response = await fetchAuthPatient(connection, wallet);
      if (response.status === "success") {
        setAuthorized(
          (
            response.data as { authorized: AuthorizedPatient[] }
          )?.authorized.reverse()
        );
      }
    }
  }, [connection, wallet]);

  const checkAuthority = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }

    let response = await fetchProfile(connection, wallet);
    if (response.status === "success") {
      const role = (response.data as { role: string }).role;
      if (role === "patient") {
        navigate("/");
      } else if (role === "doctor") {
        getAuthPatient();
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate, getAuthPatient]);

  const checkPatientRole = async (patientAddress: string) => {
    // Check if the given address is a patient
    try {
      const publicKey = new web3.PublicKey(patientAddress);
      const patientWallet = { publicKey } as Wallet;

      let response = await fetchProfile(connection, patientWallet);
      if (response.status !== "success") {
        return false;
      }

      const { role } = response.data as { role: string };

      if (role === "patient") {
        console.log(response.data);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking patient role:", error);
      return false;
    }
  };

  const authorizePatient = async (patientAddress: string) => {
    let validPatientAddress = await checkPatientRole(patientAddress);
    if (!validPatientAddress) {
      messageApi.open({
        type: "error",
        content: "Invalid patient address",
      });
      setConfirmLoading(false);
      return;
    }

    messageApi.open({
      type: "success",
      content: "Patient request authorized successfully",
    });
  };

  const handleScanSuccess = (result: string) => {
    setPatientAddress(result);
    messageApi.open({
      type: "success",
      content: "QR Code Scanned Successfully",
    });
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await authorizePatient(patientAddress);
    setPatientAddress("");
    setConfirmLoading(false);
    setOpen(false);
  };

  const revokePatientCallback = (patientAddress: string) => {
    setAuthorized((prev) =>
      prev.filter((item) => item.address !== patientAddress)
    );
    messageApi.open({
      type: "success",
      content: "Patient revoked successfully",
    });
  };

  useEffect(() => {
    checkAuthority();
  }, [checkAuthority]);

  return (
    <div>
      {contextHolder}
      <Space className="flex justify-between">
        <Flex vertical>
          <span className="font-semibold text-xl">Authorized Patients</span>
          <span className="text-lg">
            Ensure your patients are authorized to access and append their
            records.
          </span>
        </Flex>

        <Button type="primary" size="large" onClick={() => setOpen(true)}>
          + Request New Patient
        </Button>

        <Modal
          title="Enter Patient's Wallet Address"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={() => setOpen(false)}
        >
          <Input
            placeholder="0x...123"
            value={patientAddress}
            onChange={(e) => setPatientAddress(e.target.value)}
          />
          <div className="text-sm text-gray-500 pt-2">
            Note: Ensure the address belongs to a registered patient.
          </div>
          <Divider />
          <QRReader onScanSuccess={handleScanSuccess} />{" "}
          {/* Pass the callback prop */}
        </Modal>
      </Space>

      <Divider />

      <div className="text-lg font-semibold">
        All Patients ({authorized?.length ?? 0})
      </div>

      <Space className="flex justify-between items-center mb-4" size="middle">
        <Segmented
          options={["View All", "Authorized", "Pending"]}
          value={segmentedValue}
          onChange={setSegmentedValue}
        />

        <Flex gap="small">
          <Input placeholder="Search" prefix={<SearchOutlined />} />
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Flex>
      </Space>

      {authorized?.map((item, index) => (
        <PatientAuthorized
          key={index}
          patientDetails={item as unknown as { address: string; date: string }}
          revokePatientCallback={revokePatientCallback}
        />
      ))}

      {authorized?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500">
          No authorized patients
        </div>
      )}
    </div>
  );
};

export default Authorization;
