import React from "react";
import logo from "../assets/logo.svg";

const Logo = () => {
  return (
    <div className="flex items-center justify-center text-white p-10">
      <img src={logo} alt="logo" />
      <div className="pl-1 tracking-widest text-xl">
        Re
        <span className="text-[#16D1D1]">Med</span>
      </div>
    </div>
  );
};

export default Logo;
