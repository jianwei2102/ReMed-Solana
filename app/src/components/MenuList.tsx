import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import Icon from "@ant-design/icons";
import type { GetProps } from "antd";
import { CgPill } from "react-icons/cg";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { PiUserCheck, PiTestTubeDuotone } from "react-icons/pi";
import { AiOutlineHome, AiOutlineSetting } from "react-icons/ai";

interface MenuListProps {
  darkTheme: boolean;
}

const MenuList = ({ darkTheme }: MenuListProps) => {
  const navigate = useNavigate();

  type CustomIconComponentProps = GetProps<typeof Icon>;
  const EcgSvg = () => (
    <svg width="1rem" height="1rem" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 2C9.43043 2 9.81257 2.27543 9.94868 2.68377L15 17.8377L17.0513 11.6838C17.1874 11.2754 17.5696 11 18 11H22C22.5523 11 23 11.4477 23 12C23 12.5523 22.5523 13 22 13H18.7208L15.9487 21.3162C15.8126 21.7246 15.4304 22 15 22C14.5696 22 14.1874 21.7246 14.0513 21.3162L9 6.16228L6.94868 12.3162C6.81257 12.7246 6.43043 13 6 13H2C1.44772 13 1 12.5523 1 12C1 11.4477 1.44772 11 2 11H5.27924L8.05132 2.68377C8.18743 2.27543 8.56957 2 9 2Z" />
    </svg>
  );
  const EcgIcon = (props: Partial<CustomIconComponentProps>) => (
    <Icon component={EcgSvg} {...props} />
  );

  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      className=" mt-1 flex flex-col gap-3 text-lg relative "
    >
      <Menu.Item
        key="dashboard"
        icon={<AiOutlineHome size={18} />}
        onClick={() => navigate("/")}
      >
        Dashboard
      </Menu.Item>
      <Menu.Item
        key="authorization"
        icon={<PiUserCheck size={18} />}
        onClick={() => navigate("/authorization")}
      >
        Authorize Doctor
      </Menu.Item>
      <Menu.Item
        key="medicalRecord"
        icon={<EcgIcon />}
        onClick={() => navigate("/medical-record")}
      >
        Medical Record
      </Menu.Item>
      <Menu.Item
        key="medications"
        icon={<CgPill size={18} />}
        onClick={() => navigate("/medications")}
      >
        Medications
      </Menu.Item>
      <Menu.Item
        key="labResults"
        icon={<PiTestTubeDuotone size={18} />}
        onClick={() => navigate("/labResults")}
      >
        Lab Results
      </Menu.Item>
      <Menu.Item
        key="settings"
        icon={<AiOutlineSetting size={18} />}
        onClick={() => navigate("/")}
      >
        Settings
      </Menu.Item>
      <Menu.Item
        key="notification"
        icon={<MdOutlineNotificationsActive size={18} />}
        onClick={() => navigate("/")}
      >
        Notification
      </Menu.Item>
    </Menu>
  );
};

export default MenuList;
