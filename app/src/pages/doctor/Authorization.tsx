import axios from "axios";
import dayjs from "dayjs";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { Wallet, web3 } from "@project-serum/anchor";
import { useCallback, useEffect, useState } from "react";
import { fetchAuthPatient, fetchProfile } from "../../utils/util";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { PatientAuthorized, QRReader, PatientRequested } from "../../components";
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

interface RequestedPatient {
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
  const [patientAddress, setPatientAddress] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [authorized, setAuthorized] = useState<AuthorizedPatient[]>([]);
  const [requested, setRequested] = useState<RequestedPatient[]>([]);
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

    try {
      const response = await axios.get("http://localhost:4000/doctorRequests");
      const requests = response.data.map((request: any) => ({
        id: request._id,
        address: request.patientAddress,
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
    const isAuthorized = authorized.some(
      (patient) => patient.address === patientAddress
    );
    const isRequested = requested.some(
      (patient) => patient.address === patientAddress
    );

    if (isAuthorized || isRequested) {
      return false; // Already authorized, so return false
    }

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
    messageApi.open({
      type: "loading",
      content: "Transaction in progress..",
      duration: 0,
    });

    let validPatientAddress = await checkPatientRole(patientAddress);
    if (!validPatientAddress) {
      messageApi.destroy();
      messageApi.open({
        type: "error",
        content: "Invalid patient address",
      });
      setConfirmLoading(false);
      return;
    }

    let response = await axios.post("http://localhost:4000/doctorRequests", {
      patientAddress: patientAddress,
      doctorAddress: wallet.publicKey.toBase58(),
      requestDate: format(dayjs().toDate(), "MMMM d, yyyy"),
    });

    messageApi.destroy();
    if (response.status === 200) {
      const newRequested: RequestedPatient = {
        id: response.data._id, // Assuming _id is returned from the backend
        address: response.data.patientAddress,
        date: response.data.requestDate,
      };

      setRequested((prev) => [...prev, newRequested]);
      messageApi.open({
        type: "success",
        content: "Patient request authorized successfully",
      });
    } else {
      messageApi.open({
        type: "error",
        content: "Error authorizing patient request",
      });
    }
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

  const revokeRequestCallback = async (patientId: string) => {
    try {
      await axios.delete(`http://localhost:4000/doctorRequests/${patientId}`);
      setRequested((prev) => prev.filter((item) => item.id !== patientId));
      messageApi.open({
        type: "success",
        content: "Patient revoked successfully",
      });
    } catch (error) {
      messageApi.open({
        type: "error",
        content: "Error revoking patient request",
      });
    }
  };

  useEffect(() => {
    checkAuthority();
  }, [checkAuthority]);

  const displayData = () => {
    if (segmentedValue === "View All") {
      return (
        <>
          {authorized.length > 0 && (
            <>
              <div className="text-lg font-semibold">Authorized Patients</div>
              {authorized.map((item, index) => (
                <PatientAuthorized
                  key={index}
                  patientDetails={
                    item as unknown as { address: string; date: string }
                  }
                  revokePatientCallback={revokePatientCallback}
                />
              ))}
            </>
          )}
          {requested.length > 0 && (
            <>
              <div className="text-lg font-semibold">Pending Requests</div>
              {requested.map((item) => (
                <PatientRequested
                  key={item.id}
                  patientDetails={item}
                  revokePatientCallback={revokeRequestCallback}
                />
              ))}
            </>
          )}
          {authorized.length === 0 && requested.length === 0 && (
            <div className="text-center py-4 text-lg text-gray-500">
              No patients
            </div>
          )}
        </>
      );
    }

    if (segmentedValue === "Authorized") {
      return authorized.length > 0 ? (
        authorized.map((item, index) => (
          <PatientAuthorized
            key={index}
            patientDetails={
              item as unknown as { address: string; date: string }
            }
            revokePatientCallback={revokePatientCallback}
          />
        ))
      ) : (
        <div className="text-center py-4 text-lg text-gray-500">
          No authorized patients
        </div>
      );
    }

    if (segmentedValue === "Pending") {
      return requested.length > 0 ? (
        requested.map((item) => (
          <PatientRequested
            key={item.id}
            patientDetails={item}
            revokePatientCallback={revokeRequestCallback}
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
        All Patients (
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
          onChange={(value) => setSegmentedValue(value)}
        />
        <Flex gap="small">
          <Input placeholder="Search" prefix={<SearchOutlined />} />
          <Button icon={<FilterOutlined />}>Filter</Button>
        </Flex>
      </Space>

      {displayData()}
    </div>
  );
};

export default Authorization;
