import { useEffect, useState } from "react";
import { fetchProfile } from "../utils/util";
import { Wallet } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Welcoming, UserRegister, PatientDashboard, DoctorDashboard } from "./";

const HomePage = () => {
  let [page, setPage] = useState("Welcoming");
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const getProfile = async () => {
      if (!connection || !wallet) {
        console.log("Connection or wallet not available");
        setPage("Welcoming");
        return;
      }

      let response = await fetchProfile(connection, wallet as Wallet);
      if (response.status === "success") {
        if ((response.data as { role: string }).role === "patient") {
          setPage("Patient");
        } else if ((response.data as { role: string }).role === "doctor") {
          setPage("Doctor");
        }
      } else {
        // Direct to register if unable to find profile
        setPage("Register");
      }
    };

    getProfile();
  }, [connection, wallet]);

  return (
    <>
      {page === "Welcoming" && <Welcoming />}
      {page === "Patient" && <PatientDashboard />}
      {page === "Doctor" && <DoctorDashboard />}
      {page === "Register" && <UserRegister />}
    </>
  );
};

export default HomePage;
