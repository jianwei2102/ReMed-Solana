import { format } from "date-fns";
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
    const encryptedPersonalDetails = encryptData(personalDetails, "profile");
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

    return { status: "success", data: profileData };
  } catch (error) {
    console.error("Error reading profile:", error);
    return { status: "error", data: error };
  }
};

const encryptData = (data: String, dataType: String) => {
  // Encrypt the message using the key
  if (dataType === "profile") {
    return CryptoJS.AES.encrypt(
      data,
      process.env.REACT_APP_ENCRYPTION_KEY
    ).toString();
  } else if (dataType === "record") {
    return CryptoJS.AES.encrypt(
      data,
      process.env.REACT_APP_EMR_ENCRYPTION_KEY
    ).toString();
  }
  return "";
};

const decryptData = (data: String, dataType: String) => {
  // Decrypt the encrypted message using the same key
  if (dataType === "profile") {
    let decrypted = CryptoJS.AES.decrypt(
      data,
      process.env.REACT_APP_ENCRYPTION_KEY
    );
    // Convert the decrypted message from a CryptoJS object to a regular string
    return decrypted.toString(CryptoJS.enc.Utf8);
  } else if (dataType === "record") {
    let decrypted = CryptoJS.AES.decrypt(
      data,
      process.env.REACT_APP_EMR_ENCRYPTION_KEY
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
  return "";
};

const authorizeDoctor = async (
  connection: any,
  wallet: Wallet,
  doctorAddress: string
) => {
  try {
    const todayDate = format(new Date(), "MMMM d, yyyy");
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
      .authorizeDoctor(doctorPub.toString(), todayDate)
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
    console.error("Error revoking doctor:", error);
    return { status: "error", data: error };
  }
};

const revokePatient = async (
  connection: any,
  wallet: Wallet,
  patientAddress: string
) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const doctorSeeds = [
      Buffer.from("doctor_auth_list"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];
    const [doctorAuthList] = await PublicKey.findProgramAddress(
      doctorSeeds,
      program.programId
    );

    const patientPub = new PublicKey(patientAddress);
    const patientSeeds = [
      Buffer.from("patient_auth_list"),
      patientPub.toBuffer(),
    ];
    const [patientAuthList] = await PublicKey.findProgramAddress(
      patientSeeds,
      program.programId
    );

    await program.methods
      .revokePatient(patientPub.toString())
      .accounts({
        patientAuthList: patientAuthList,
        doctorAuthList: doctorAuthList,
        signer: anchorProvider.wallet.publicKey,
        patient: patientPub,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log(`Revoke patient ${patientAddress} from the permission list.`);
    return { status: "success", data: patientAddress };
  } catch (error) {
    console.error("Error revoking patient:", error);
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
    console.log("Authorized doctors: ", accountData.authorized);
    return { status: "success", data: accountData };
  } catch (error) {
    console.error("Error reading auth doctor:", error);
    return { status: "error", data: error };
  }
};

const fetchAuthPatient = async (connection: any, wallet: Wallet) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const doctorSeeds = [
      Buffer.from("doctor_auth_list"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];
    const [doctorAuthList] = await PublicKey.findProgramAddress(
      doctorSeeds,
      program.programId
    );

    const accountData = await program.account.authList.fetch(doctorAuthList);
    console.log("Authorized patient: ", accountData.authorized);
    return { status: "success", data: accountData };
  } catch (error) {
    console.error("Error reading auth patient:", error);
    return { status: "error", data: error };
  }
};

const generateHash = (
  recordData: String,
  patientPubKey: String,
  doctorPubKey: String
) => {
  const combinedString = `${recordData}-${patientPubKey}-${doctorPubKey}`;

  // Create SHA-256 hash
  const hash = CryptoJS.SHA256(combinedString).toString(CryptoJS.enc.Hex);
  return hash;
};

const appendRecord = async (
  connection: any,
  wallet: Wallet,
  recordHash: string,
  record: string,
  patientAddress: string,
  medicalRecords: string
) => {
  try {
    console.log(record.toString());
    const encryptedRecord = encryptData(record, "record");

    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const patientPub = new PublicKey(patientAddress);
    const patientSeeds = [
      Buffer.from("patient_auth_list"),
      patientPub.toBuffer(),
    ];
    const [patientAuthList] = await PublicKey.findProgramAddress(
      patientSeeds,
      program.programId
    );

    const recordSeeds = [Buffer.from("emr_list"), patientPub.toBuffer()];
    const [recordList] = await PublicKey.findProgramAddress(
      recordSeeds,
      program.programId
    );

    await program.methods
      .appendRecord(recordHash, encryptedRecord, medicalRecords)
      .accounts({
        patientAuthList: patientAuthList,
        emrList: recordList,
        signer: anchorProvider.wallet.publicKey,
        patient: patientPub,
        systemProgram: SystemProgram.programId,
      })
      .signers([])
      .rpc();

    console.log(`Added record ${recordHash} to the patient ${patientAddress}.`);
    return { status: "success", data: recordHash };
  } catch (error) {
    console.error("Error adding record:", error);
    return { status: "error", data: error };
  }
};

const fetchRecord = async (connection: any, wallet: Wallet) => {
  try {
    const anchorProvider = getProvider(connection, wallet);
    const program = new Program(idl as Idl, programID, anchorProvider);

    const recordSeeds = [
      Buffer.from("emr_list"),
      anchorProvider.wallet.publicKey.toBuffer(),
    ];

    const [recordAccount] = await PublicKey.findProgramAddress(
      recordSeeds,
      program.programId
    );

    const recordData = await program.account.emrList.fetch(recordAccount);

    return { status: "success", data: recordData };
  } catch (error) {
    console.error("Error reading record:", error);
    return { status: "error", data: error };
  }
};

const processRecords = (decryptedRecords: string[]): any[] => {
  const today = new Date();

  // Process records to determine current and past medications
  return decryptedRecords
    .map((medication) => {
      const medicationJSON = JSON.parse(medication);
      const { date, medications, time, location } = medicationJSON;

      // Convert date from "dd-mm-yyyy" to "mm/dd/yyyy"
      const [day, month, year] = date.split("-").map(Number);
      const formattedDate = new Date(year, month - 1, day);

      // Map medications to include current status
      const mappedMedications = medications.map((med: any) => {
        const medicationDate = new Date(formattedDate);
        medicationDate.setDate(medicationDate.getDate() + med.duration);

        return {
          ...med,
          current: today <= medicationDate,
        };
      });

      // Determine if any medication is current
      const isCurrent = mappedMedications.some((med: any) => med.current);

      // Sort medications so that current medications come first
      const sortedMedications = mappedMedications.sort((a: any, b: any) => {
        if (a.current && !b.current) return -1; // a comes first if current
        if (!a.current && b.current) return 1; // b comes first if current
        return 0; // maintain original order for same status
      });

      return {
        date,
        time,
        location,
        medications: sortedMedications,
        current: isCurrent,
      };
    })
    .sort((a: any, b: any) => {
      if (a.current && !b.current) return -1; // a comes first if current
      if (!a.current && b.current) return 1; // b comes first if current
      return 0; // maintain original order for same status
    });
};

export {
  getProvider,
  createProfile,
  fetchProfile,
  decryptData,
  authorizeDoctor,
  revokeDoctor,
  fetchAuthDoctor,
  fetchAuthPatient,
  revokePatient,
  generateHash,
  appendRecord,
  fetchRecord,
  processRecords,
};
