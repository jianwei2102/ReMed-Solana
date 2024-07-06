import React, { useState } from "react";
import { Flex, Radio } from "antd";
import { PatientRegister, DoctorRegister } from "..";

const UserRegister = () => {
  const [role, setRole] = useState("patient");

  const handleRoleChange = (e: any) => {
    const newRole = e.target.value;
    setRole(newRole);
  };

  return (
    <div>
      <div className="text-2xl font-bold">Profile Registration</div>
      <div className="flex content-center items-center mt-4">
        <span className="text-lg">Create as:</span>
        <Flex className="pl-4" vertical gap="middle">
          <Radio.Group
            defaultValue="patient"
            size="large"
            onChange={handleRoleChange}
          >
            <Radio.Button value="patient">Patient</Radio.Button>
            <Radio.Button value="doctor">Doctor</Radio.Button>
          </Radio.Group>
        </Flex>
      </div>
      {role === "patient" ? <PatientRegister /> : <DoctorRegister />}
    </div>
  );
};

export default UserRegister;
