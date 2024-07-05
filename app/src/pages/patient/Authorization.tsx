import { useState, useEffect } from "react";
import { Wallet } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button } from "antd";
import {
  authorizeDoctor,
  revokeDoctor,
  fetchAuthDoctor,
} from "../../utils/util";

const Authorization = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const [authorized, setAuthorized] = useState<string[]>([]);

  useEffect(() => {
    const getAuthDoctor = async () => {
      try {
        if (connection && wallet) {
          let response = await fetchAuthDoctor(connection, wallet as Wallet);
          setAuthorized((response.data as { authorized: string[] }).authorized);
        }
      } catch (error) {
        console.error("Error getting auth doctor:", error);
      }
    };

    getAuthDoctor();
  }, [connection, wallet]);

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
