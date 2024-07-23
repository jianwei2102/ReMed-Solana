import axios from "axios";
import { format } from "date-fns/format";
import { useNavigate } from "react-router-dom";
import { Wallet, web3 } from "@project-serum/anchor";
import { useState, useEffect, useCallback } from "react";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { DoctorAuthorized, QRReader, DoctorRequested } from "../../components";
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

interface RequestedDoctor {
  id: string;
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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [requested, setRequested] = useState<RequestedDoctor[]>([]);
  const [authorized, setAuthorized] = useState<AuthorizedDoctor[]>([]);
  const [segmentedValue, setSegmentedValue] = useState<string>("View All");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

    try {
      const response = await axios.get("http://localhost:4000/doctorRequests");
      const requests = response.data
        .filter(
          (request: any) =>
            request.patientAddress === wallet.publicKey.toBase58()
        )
        .map((request: any) => ({
          id: request._id,
          address: request.doctorAddress,
          date: request.requestDate,
        }));
      setRequested(requests);
      console.log("Request fetched:", response.data);
    } catch (error) {
      console.error("Error fetching request:", error);
    }
  }, [connection, wallet]);

  const checkAuthority = useCallback(async () => {
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
    checkAuthority();
  }, [checkAuthority]);

  const checkDoctorRole = async (doctorAddress: string) => {
    const isAuthorized = authorized.some(
      (doctor) => doctor.address === doctorAddress
    );
    if (isAuthorized) {
      return false; // Already authorized, so return false
    }

    // Check if the address belongs to a registered healthcare provider
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
      return true;
    } else {
      messageApi.open({
        type: "error",
        content: "Error authorizing doctor",
      });
      return false;
    }
  };

  const handleScanSuccess = (result: string) => {
    setDoctorAddress(result);
    messageApi.open({
      type: "success",
      content: "QR Code Scanned Successfully",
    });
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

  const revokeRequestCallback = async (doctorId: string) => {
    try {
      await axios.delete(`http://localhost:4000/doctorRequests/${doctorId}`);
      setRequested((prev) => prev.filter((item) => item.id !== doctorId));
      messageApi.open({
        type: "success",
        content: "Doctor request revoked successfully",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error revoking doctor request",
      });
    }
  };

  const authorizeRequestCallback = async (
    doctorId: string,
    doctorAddress: string
  ) => {
    try {
      const response = await authorizeDoc(doctorAddress);
      if (response) {
        await revokeRequestCallback(doctorId);
      }
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error authorize doctor request",
      });
    }
  };

  const filteredAuthorized = authorized.filter((item) =>
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRequested = requested.filter((item) =>
    item.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayData = () => {
    if (segmentedValue === "View All") {
      return (
        <>
          {filteredAuthorized.length > 0 && (
            <>
              <div className="text-lg font-semibold">Authorized Doctors</div>
              {filteredAuthorized.map((item, index) => (
                <DoctorAuthorized
                  key={index}
                  doctorDetails={
                    item as unknown as { address: string; date: string }
                  }
                  revokeDoctorCallback={revokeDoctorCallback}
                />
              ))}
            </>
          )}
          {filteredRequested.length > 0 && (
            <>
              <div className="text-lg font-semibold">Pending Requests</div>
              {filteredRequested.map((item) => (
                <DoctorRequested
                  key={item.id}
                  doctorDetails={item}
                  revokeRequestCallback={revokeRequestCallback}
                  authorizeRequestCallback={authorizeRequestCallback}
                />
              ))}
            </>
          )}
          {filteredAuthorized.length === 0 &&
            filteredRequested.length === 0 && (
              <div className="text-center py-4 text-lg text-gray-500">
                No doctors found
              </div>
            )}
        </>
      );
    }

    if (segmentedValue === "Authorized") {
      return filteredAuthorized.length > 0 ? (
        filteredAuthorized.map((item, index) => (
          <DoctorAuthorized
            key={index}
            doctorDetails={item as unknown as { address: string; date: string }}
            revokeDoctorCallback={revokeDoctorCallback}
          />
        ))
      ) : (
        <div className="text-center py-4 text-lg text-gray-500">
          No authorized doctors
        </div>
      );
    }

    if (segmentedValue === "Pending") {
      return filteredRequested.length > 0 ? (
        filteredRequested.map((item) => (
          <DoctorRequested
            key={item.id}
            doctorDetails={item}
            revokeRequestCallback={revokeRequestCallback}
            authorizeRequestCallback={authorizeRequestCallback}
          />
        ))
      ) : (
        <div className="text-center py-4 text-lg text-gray-500">
          No pending requests
        </div>
      );
    }

    return null;
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
        All Doctors (
        {segmentedValue === "View All"
          ? authorized.length + requested.length
          : segmentedValue === "Authorized"
            ? authorized.length
            : requested.length}
        )
      </div>

      <Space className="flex justify-between items-center mb-4" size="middle">
        <Segmented
          options={["View All", "Authorized", "Pending"]}
          value={segmentedValue}
          onChange={setSegmentedValue}
        />

        <Flex gap="small">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Flex>
      </Space>

      {displayData()}
    </div>
  );
};

export default Authorization;
