import { Button } from "antd";
import { LuPill } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { MdOutlinePeopleAlt } from "react-icons/md";
import img from "../../assets/patientDashboard.png";
import { AuthorizationCard, MedicationCard } from "../../components/";

const PatientDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex flex-row justify-between rounded-3xl text-white text-xl bg-[#37CAEC] mb-8">
        <div className="flex flex-col justify-center items-start pl-10 gap-3">
          <div className="font-semibold">Hello, {sessionStorage.getItem("name")}!! 👋</div>
          <div>
            Welcome to <span className="font-semibold">ReMed</span>, where you
            own your Medical Record!
          </div>
        </div>
        <img src={img} className="max-h-40" alt="Dashboard" />
      </div>

      <div className="flex flex-row justify-between gap-4">
        <div className="basis-1/2 border rounded-lg p-4">
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
        </div>

        <div className="basis-1/2 border rounded-lg p-4">
          <div className="flex flew-col justify-between">
            <div className="flex justify-center items-center h-12">
              <div className="p-2 bg-[#E8EDFF] rounded-full mr-2">
                <MdOutlinePeopleAlt size="20" color="1F51FF" />
              </div>
              <div className="flex flex-col gap-0">
                <span className="font-semibold text-xl">Doctor List</span>
                {/* <span className="text-sm italic">Pending Action</span> */}
              </div>
            </div>
            <div className="flex justify-center items-center">
              <Button type="link" onClick={() => navigate("/authorization")}>
                View All
              </Button>
            </div>
          </div>
          <div>
            <AuthorizationCard />
            <AuthorizationCard />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
