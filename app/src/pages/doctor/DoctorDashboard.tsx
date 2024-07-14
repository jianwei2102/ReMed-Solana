import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { DoctorAuthCard } from "../../components";
import { fetchAuthPatient } from "../../utils/util";
import img from "../../assets/patientDashboard.png";
import { MdOutlinePeopleAlt } from "react-icons/md";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";

interface AuthorizedPatient {
  address: string;
  date: string;
}

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { connection } = useConnection();
  const wallet = useAnchorWallet() as Wallet;
  const [messageApi, contextHolder] = message.useMessage();

  const [authorized, setAuthorized] = useState<AuthorizedPatient[]>([]);

  useEffect(() => {
    if (connection && wallet) {
      fetchAuthPatient(connection, wallet).then((response) => {
        if (response.status === "success") {
          setAuthorized(
            (
              response.data as { authorized: AuthorizedPatient[] }
            )?.authorized.reverse()
          );
        }
      });
    }
  }, [connection, wallet]);

  const revokePatientCallback = (patientAddress: string) => {
    setAuthorized((prev) =>
      prev.filter((item) => item.address !== patientAddress)
    );
    messageApi.open({
      type: "success",
      content: "Patient revoked successfully",
    });
  };

  return (
    <div>
      {contextHolder}
      <div className="flex flex-row justify-between rounded-3xl text-white text-xl bg-[#37CAEC] mb-8">
        <div className="flex flex-col justify-center items-start pl-10 gap-3">
          <div className="font-semibold">
            Hello, {sessionStorage.getItem("name")}!! 👋
          </div>
          <div>
            Welcome to <span className="font-semibold">ReMed</span>, where you
            deliver trusted healthcare and manage patient records with ease!
          </div>
        </div>
        <img src={img} className="max-h-40" alt="Dashboard" />
      </div>

      <div className="flex flex-row justify-between gap-4">
        {/* <div className="basis-1/2 border rounded-lg p-4">
        <div className="flex flew-col justify-between h-12">
          <div className="flex justify-center items-center">
            <div className="p-2 bg-[#E8EDFF] rounded-full mr-2">
              <LuPill size="20" color="1F51FF" />
            </div>
            <div className="font-semibold text-xl">Current Medications</div>
          </div>
          <div className="flex justify-center items-center">
            <Button type="link" onClick={() => navigate("/medications")}>
              View All
            </Button>
          </div>
        </div>
        <div>
          <MedicationCard current={true} itemNo={1} />
          <MedicationCard current={true} itemNo={2} />
        </div>
      </div> */}

        <div className="basis-1/2 border rounded-lg p-4 min-h-96">
          <div className="flex flew-col justify-between">
            <div className="flex justify-center items-center h-12">
              <div className="p-2 bg-[#E8EDFF] rounded-full mr-2">
                <MdOutlinePeopleAlt size="20" color="1F51FF" />
              </div>
              <div className="flex flex-col gap-0">
                <span className="font-semibold text-xl">Patient List</span>
                {/* <span className="text-sm italic">Pending Action</span> */}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button
                type="link"
                onClick={() => navigate("/doctor/authorization")}
              >
                View All
              </Button>
            </div>
          </div>
          <div>
            {authorized
              ?.slice(0, 3)
              .map((item, index) => (
                <DoctorAuthCard
                  key={index}
                  patientDetails={
                    item as unknown as { address: string; date: string }
                  }
                  revokePatientCallback={revokePatientCallback}
                />
              ))}

            {authorized?.length === 0 && (
              <div className="text-center py-4 text-lg text-gray-500">
                No patients authorized yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
