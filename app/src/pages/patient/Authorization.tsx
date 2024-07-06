import { Button } from "antd";
import { useState, useEffect, useCallback } from "react";
import { Wallet } from "@project-serum/anchor";
import { useNavigate } from "react-router-dom";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  authorizeDoctor,
  revokeDoctor,
  fetchAuthDoctor,
  fetchProfile,
} from "../../utils/util";

const Authorization = () => {
  const navigate = useNavigate();
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [authorized, setAuthorized] = useState<string[]>([]);

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

  const revokeDoc = async (doctorAddress: string) => {
    let response = await revokeDoctor(
      connection,
      wallet as Wallet,
      doctorAddress
    );
    if (response.status === "success") {
      setAuthorized((prev) => prev.filter((item) => item !== response.data));
    }
  };

  return (
    <div>
      <h2>Wallet Public Key:</h2>
      <p>{wallet ? wallet.publicKey.toString() : "No wallet connected"}</p>
      <Button
        onClick={() =>
          authorizeDoc("4GCuAtDNWAJn5LwLJirkfbrvmRZ7ruYdB4ZE5MyWCLG1")
        }
      >
        Add Doc
      </Button>
      <Button
        onClick={() =>
          revokeDoc("4GCuAtDNWAJn5LwLJirkfbrvmRZ7ruYdB4ZE5MyWCLG1")
        }
      >
        Remove Doc
      </Button>
      <div>
        <h3>Authorized List:</h3>
        <ul>
          {authorized.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Authorization;
