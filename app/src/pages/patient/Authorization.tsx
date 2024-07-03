import { Buffer } from "buffer";
import idl from "../../assets/remed.json";
import { useState, useEffect, useCallback } from "react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, Idl, Wallet } from "@project-serum/anchor";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import { Button } from "antd";

const programID = new PublicKey(idl.metadata.address);

const Authorization = () => {
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  const getProvider = useCallback(() => {
    const provider = new AnchorProvider(
      connection,
      wallet as Wallet,
      AnchorProvider.defaultOptions()
    );
    return provider;
  }, [connection, wallet]);

  const [authorized, setAuthorized] = useState<string[]>([]);

  const addDoctor = async (doctorAddress: string) => {
    try {
      const anchorProvider = getProvider();
      const program = new Program(idl as Idl, programID, anchorProvider);

      const permissionListSeeds = [
        Buffer.from("permission_list"),
        anchorProvider.wallet.publicKey.toBuffer(),
      ];
      const [permissionsAccount] = await PublicKey.findProgramAddress(
        permissionListSeeds,
        program.programId
      );

      await program.methods
        .addDoc(doctorAddress)
        .accounts({
          permissionList: permissionsAccount,
          signer: anchorProvider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();

      setAuthorized((prev) => [...prev, doctorAddress]);
      console.log(`Added doc ${doctorAddress} to the permission list.`);
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const removeDoctor = async (doctorAddress: string) => {
    try {
      const anchorProvider = getProvider();
      const program = new Program(idl as Idl, programID, anchorProvider);

      const permissionListSeeds = [
        Buffer.from("permission_list"),
        anchorProvider.wallet.publicKey.toBuffer(),
      ];
      const [permissionsAccount] = await PublicKey.findProgramAddress(
        permissionListSeeds,
        program.programId
      );

      await program.methods
        .removeDoc(doctorAddress)
        .accounts({
          permissionList: permissionsAccount,
          signer: anchorProvider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([])
        .rpc();

      setAuthorized((prev) => prev.filter((doc) => doc !== doctorAddress));
      console.log(`Added doc ${doctorAddress} to the permission list.`);
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  const getDoctor = useCallback(async () => {
    try {
      const anchorProvider = getProvider();
      const program = new Program(idl as Idl, programID, anchorProvider);

      const permissionListSeeds = [
        Buffer.from("permission_list"),
        anchorProvider.wallet.publicKey.toBuffer(),
      ];

      const [permissionsAccount] = await PublicKey.findProgramAddress(
        permissionListSeeds,
        program.programId
      );

      const accountData = await program.account.permissionList.fetch(
        permissionsAccount
      );

      console.log(accountData.authorized);
      setAuthorized(accountData.authorized as string[]); // Update the state with the authorized list
    } catch (error) {
      console.error("Error reading doctor:", error);
    }
  }, [getProvider]);

  useEffect(() => {
    if (wallet) {
      getDoctor();
    }
  }, [wallet, getDoctor]);

  return (
    <div>
      <h2>Wallet Public Key:</h2>
      <p>{wallet ? wallet.publicKey.toString() : "No wallet connected"}</p>
      <Button onClick={() => addDoctor("newDoctorAddress4")}>Add Doc</Button>
      <Button onClick={() => removeDoctor("newDoctorAddress4")}>Remove Doc</Button>
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
