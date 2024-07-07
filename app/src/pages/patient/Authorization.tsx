import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { DoctorAuthorized } from "../../components";
import { useState, useEffect, useCallback } from "react";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button, Divider, Flex, Input, Space, Segmented, Modal } from "antd";
import {
  authorizeDoctor,
  fetchAuthDoctor,
  fetchProfile,
} from "../../utils/util";

const Authorization = () => {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [authorized, setAuthorized] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [doctorAddress, setDoctorAddress] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [segmentedValue, setSegmentedValue] = useState<string>("View All");

  const getAuthDoctor = useCallback(async () => {
    if (connection && wallet) {
      let response = await fetchAuthDoctor(connection, wallet as Wallet);
      setAuthorized((response.data as { authorized: string[] }).authorized);
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

  const authorizeDoc = async (doctorAddress: string) => {
    let response = await authorizeDoctor(
      connection,
      wallet as Wallet,
      doctorAddress
    );
    if (response.status === "success") {
      setAuthorized((prev: string[]) => [...prev, response.data as string]);
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
    setAuthorized((prev) => prev.filter((item) => item !== doctorAddress));
  };

  return (
    <div>
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
          title="Enter Doctor's Address"
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
        </Modal>
      </Space>

      <Divider />

      <div className="text-lg font-semibold">
        All Doctors ({authorized.length})
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

      {authorized.map((item, index) => (
        <DoctorAuthorized
          key={index}
          address={item}
          revokeDoctorCallback={revokeDoctorCallback}
        />
      ))}
    </div>
  );
};

export default Authorization;
