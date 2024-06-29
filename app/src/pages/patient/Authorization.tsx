import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

const Authorization = () => {
  const { publicKey } = useWallet();

  return (
    <div>
      <h2>Wallet Public Key:</h2>
      <p>{publicKey ? publicKey.toBase58() : "No wallet connected"}</p>
    </div>
  );
};

export default Authorization;