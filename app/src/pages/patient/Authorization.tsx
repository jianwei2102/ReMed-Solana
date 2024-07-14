import { format } from "date-fns/format";
import { useNavigate } from "react-router-dom";
import { Wallet, web3 } from "@project-serum/anchor";
import { useState, useEffect, useCallback } from "react";
import { DoctorAuthorized, QRReader } from "../../components";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  authorizeDoctor,
  fetchAuthDoctor,
  fetchProfile,
} from "../../utils/util";
import {
  Button,
  Divider,
  Flex,
  Input,
  Space,
  Segmented,
  Modal,
  message,
} from "antd";

interface AuthorizedDoctor {
  address: string;
  date: string;
}

const Authorization = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const [messageApi, contextHolder] = message.useMessage();

  const [open, setOpen] = useState(false);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [authorized, setAuthorized] = useState<AuthorizedDoctor[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [segmentedValue, setSegmentedValue] = useState<string>("View All");

  const getAuthDoctor = useCallback(async () => {
    if (connection && wallet) {
      let response = await fetchAuthDoctor(connection, wallet);
      if (response.status === "success") {
        setAuthorized(
          (
            response.data as { authorized: AuthorizedDoctor[] }
          )?.authorized.reverse()
        );
      }
    }
  }, [connection, wallet]);

  const getProfile = useCallback(async () => {
    if (!connection || !wallet) {
      navigate("/");
      return;
    }

    let response = await fetchProfile(connection, wallet as Wallet);
    if (response.status === "success") {
      const role = (response.data as { role: string }).role;
      if (role === "patient") {
        getAuthDoctor();
      } else if (role === "doctor") {
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [connection, wallet, navigate, getAuthDoctor]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const checkDoctorRole = async (doctorAddress: string) => {
    try {
      const publicKey = new web3.PublicKey(doctorAddress);
      const doctorWallet = { publicKey } as Wallet;

      let response = await fetchProfile(connection, doctorWallet);
      if (response.status !== "success") {
        return false;
      }

      const { role } = response.data as { role: string };

      if (role === "doctor") {
        console.log(response.data);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error checking doctor role:", error);
      return false;
    }
  };

  const authorizeDoc = async (doctorAddress: string) => {
    messageApi.open({
      type: "loading",
      content: "Transaction in progress..",
      duration: 0,
    });

    let validDoctorAddress = await checkDoctorRole(doctorAddress);
    if (!validDoctorAddress) {
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: "Invalid doctor address",
      });
      setConfirmLoading(false);
      return;
    }

    let response = await authorizeDoctor(
      connection,
      wallet as Wallet,
      doctorAddress
    );
    messageApi.destroy();

    if (response.status === "success") {
      messageApi.open({
        type: "success",
        content: "Doctor authorized successfully",
      });

      const newAuthorized: AuthorizedDoctor = {
        address: doctorAddress,
        date: format(new Date(), "MMMM d, yyyy"),
      };

      setAuthorized((prev) => [...prev, newAuthorized]);
    } else {
      messageApi.open({
        type: "error",
        content: "Error authorizing doctor",
      });
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    await authorizeDoc(doctorAddress);
    setDoctorAddress("");
    setConfirmLoading(false);
    setOpen(false);
  };

  const revokeDoctorCallback = (doctorAddress: string) => {
    setAuthorized((prev) =>
      prev.filter((item) => item.address !== doctorAddress)
    );
    messageApi.open({
      type: "success",
      content: "Doctor revoked successfully",
    });
  };

  const handleScanSuccess = (result: string) => {
    setDoctorAddress(result);
    messageApi.open({
      type: "success",
      content: "QR Code Scanned Successfully",
    });
  };

  return (
    <div>
      {contextHolder}
      <Space className="flex justify-between">
        <Flex vertical>
          <span className="font-semibold text-xl">Authorized Doctors</span>
          <span className="text-lg">
            Ensure your medical records are managed by verified healthcare
            providers.
          </span>
        </Flex>

        <Button type="primary" size="large" onClick={() => setOpen(true)}>
          + Add New Doctor
        </Button>

        <Modal
          title="Enter Doctor's Wallet Address"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={() => setOpen(false)}
        >
          <Input
            placeholder="0x...123"
            value={doctorAddress}
            onChange={(e) => setDoctorAddress(e.target.value)}
          />
          <div className="text-sm text-gray-500 pt-2">
            Note: Ensure the address belongs to a registered healthcare
            provider.
          </div>
          <Divider />
          <QRReader onScanSuccess={handleScanSuccess} />{" "}
          {/* Pass the callback prop */}
        </Modal>
      </Space>

      <Divider />

      <div className="text-lg font-semibold">
        All Doctors ({authorized?.length ?? 0})
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
        <DoctorAuthorized
          key={index}
          doctorDetails={item as unknown as { address: string; date: string }}
          revokeDoctorCallback={revokeDoctorCallback}
        />
      ))}

      {authorized?.length === 0 && (
        <div className="text-center py-4 text-lg text-gray-500">
          No authorized doctors
        </div>
      )}
    </div>
  );
};

export default Authorization;
