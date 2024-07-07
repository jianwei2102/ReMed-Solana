import idl from "../assets/remed.json";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { AnchorProvider, Idl, Program, Wallet } from "@project-serum/anchor";

const programID = new PublicKey(idl.metadata.address);
const CryptoJS = require("crypto-js");

const getProvider = (connection: any, wallet: Wallet) => {
  if (!wallet) {
    throw new Error("Wallet is not connected");
  }
  const provider = new AnchorProvider(
    connection,
    wallet,
    AnchorProvider.defaultOptions()
  );
  return provider;
};

const createProfile = async (
  connection: any,
  wallet: Wallet,
  role: String,
  personalDetails: String
) => {
  try {
    // Encrypt the message using the key
    var encryptedPersonalDetails = CryptoJS.AES.encrypt(
      personalDetails,
      process.env.REACT_APP_ENCRYPTION_KEY
    ).toString();
    console.log(encryptedPersonalDetails);

    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const profileSeeds = [
      Buffer.from("profile"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];
    const [profileAccount] = await PublicKey.findProgramAddress(
      profileSeeds,
      program.programId
    );
    await program.methods
      .createProfile(role, encryptedPersonalDetails)
      .accounts({
        profile: profileAccount,
        signer: anchorProvider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();

    return { status: "success", data: encryptedPersonalDetails };
  } catch (error) {
    return { status: "error", data: error };
  }
};

const fetchProfile = async (connection: any, wallet: Wallet) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const profileSeeds = [
      Buffer.from("profile"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];

    const [profileAccount] = await PublicKey.findProgramAddress(
      profileSeeds,
      program.programId
    );

    const profileData = await program.account.profile.fetch(profileAccount);

    // Decrypt the encrypted message using the same key
    var decrypted = CryptoJS.AES.decrypt(
      profileData.personalDetails,
      process.env.REACT_APP_ENCRYPTION_KEY
    );
    // // Convert the decrypted message from a CryptoJS object to a regular string
    var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    console.log("Decrypted message: " + plaintext);

    console.log(profileData);
    return { status: "success", data: profileData };
  } catch (error) {
    console.error("Error reading profile:", error);
    return { status: "error", data: error };
  }
};

const authorizeDoctor = async (
  connection: any,
  wallet: Wallet,
  doctorAddress: string
) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const patientSeeds = [
      Buffer.from("patient_auth_list"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];
    const [patientAuthList] = await PublicKey.findProgramAddress(
      patientSeeds,
      program.programId
    );

    const doctorPub = new PublicKey(doctorAddress);
    const doctorSeeds = [Buffer.from("doctor_auth_list"), doctorPub.toBuffer()];
    const [doctorAuthList] = await PublicKey.findProgramAddress(
      doctorSeeds,
      program.programId
    );
    await program.methods
      .authorizeDoctor(doctorPub.toString())
      .accounts({
        patientAuthList: patientAuthList,
        doctorAuthList: doctorAuthList,
        signer: anchorProvider.wallet.publicKey,
        doctor: doctorPub,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log(`Added doc ${doctorAddress} to the permission list.`);
    return { status: "success", data: doctorAddress };
  } catch (error) {
    console.error("Error adding doctor:", error);
    return { status: "error", data: error };
  }
};

const revokeDoctor = async (
  connection: any,
  wallet: Wallet,
  doctorAddress: string
) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const patientSeeds = [
      Buffer.from("patient_auth_list"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];
    const [patientAuthList] = await PublicKey.findProgramAddress(
      patientSeeds,
      program.programId
    );

    const doctorPub = new PublicKey(doctorAddress);
    const doctorSeeds = [Buffer.from("doctor_auth_list"), doctorPub.toBuffer()];
    const [doctorAuthList] = await PublicKey.findProgramAddress(
      doctorSeeds,
      program.programId
    );

    await program.methods
      .revokeDoctor(doctorPub.toString())
      .accounts({
        patientAuthList: patientAuthList,
        doctorAuthList: doctorAuthList,
        signer: anchorProvider.wallet.publicKey,
        doctor: doctorPub,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log(`Revoke doc ${doctorAddress} from the permission list.`);
    return { status: "success", data: doctorAddress };
  } catch (error) {
    console.error("Error adding doctor:", error);
    return { status: "error", data: error };
  }
};

const fetchAuthDoctor = async (connection: any, wallet: Wallet) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const patientSeeds = [
      Buffer.from("patient_auth_list"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];
    const [patientAuthList] = await PublicKey.findProgramAddress(
      patientSeeds,
      program.programId
    );

    const accountData = await program.account.authList.fetch(patientAuthList);
    console.log(accountData.authorized);
    return { status: "success", data: accountData };
    //   setAuthorized(accountData.authorized as string[]); // Update the state with the authorized list
  } catch (error) {
    console.error("Error reading doctor:", error);
    return { status: "error", data: error };
  }
};

export {
  getProvider,
  createProfile,
  fetchProfile,
  authorizeDoctor,
  revokeDoctor,
  fetchAuthDoctor,
};
