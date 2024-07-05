import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Remed } from "../target/types/remed";
import { SystemProgram, Keypair, PublicKey } from "@solana/web3.js";

describe("remed", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Remed as Program<Remed>;

  // PLEASE DON'T HACK ME - 1
  // user - 7JZKzBpbNAyGWrbpfNs61zZu9RWeUhhCC77UaLWcdocS
  const secretKeyBytes = [
    69, 44, 51, 26, 12, 165, 235, 38, 77, 18, 86, 53, 244, 9, 197, 45, 191, 99,
    238, 46, 27, 96, 115, 218, 254, 224, 244, 139, 194, 24, 93, 166, 93, 165,
    140, 70, 236, 226, 163, 70, 11, 119, 129, 52, 157, 69, 40, 68, 8, 44, 177,
    168, 121, 115, 102, 91, 63, 100, 188, 242, 32, 254, 182, 175,
  ];

  // PLEASE DON'T HACK ME - 2
  // doc - 4GCuAtDNWAJn5LwLJirkfbrvmRZ7ruYdB4ZE5MyWCLG1
  const secretKeyBytesDoc = [
    196, 119, 8, 58, 119, 162, 112, 34, 211, 246, 240, 210, 91, 78, 183, 161,
    202, 102, 64, 164, 80, 29, 99, 126, 101, 77, 38, 240, 140, 158, 65, 239, 48,
    120, 58, 75, 67, 242, 59, 209, 116, 203, 40, 215, 125, 74, 95, 236, 45, 100,
    58, 15, 85, 64, 255, 185, 23, 203, 194, 210, 15, 248, 194, 154,
  ];
  const user1 = Keypair.fromSecretKey(Uint8Array.from(secretKeyBytes));
  const user1_pub = new PublicKey(
    "7JZKzBpbNAyGWrbpfNs61zZu9RWeUhhCC77UaLWcdocS"
  );
  const doc1 = Keypair.fromSecretKey(Uint8Array.from(secretKeyBytesDoc));
  const doc1_pub = new PublicKey(
    "4GCuAtDNWAJn5LwLJirkfbrvmRZ7ruYdB4ZE5MyWCLG1"
  );

  // it("Is initialized!", async () => {
  //   // Add your test here.
  //   // const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature");
  //   console.log(user1.publicKey.toString());
  // });

  // it("Create Profile", async () => {
  //   //Profile
  //   const profileSeeds = [Buffer.from("profile"), user1.publicKey.toBuffer()];
  //   const [profileAcc] = await anchor.web3.PublicKey.findProgramAddress(
  //     profileSeeds,
  //     program.programId
  //   );

  //   await program.methods
  //     .createProfile(
  //       "Patient",
  //       "U2FsdGVkX18zk0GR77VdQHE6hB9fJWZ94qcpkbureWo8Kk7q3CWwh+HuwdIv3B156BEXjkF5+1Fb6QWQ7LBQQ6LFyTHC1VOAT07aIJygPttZpNl0jTAC8oXexIurg3/mPiYprPtHYFnugdLTrGCC2Obt6DJiHjwq4t6zzyU+cAtd4W+Wi4KAjXQNs1YfOHe8FlAraToXtba3AB30lqVli624qUpvYetfeFpn7FV3/NG4rcI3DWcffR+60dk2EVNuxPwJWzlraiWIauxmHNwScJmq0ehUKd3wAd6w3D1qJ6GEx92vD0PckUf6NO38D5napFT5BPIQ3DJXbZx3JEmmms/4ylXcJcctWXIME3CUEAyeJzKLzwXC7j/SoVxJcuCuUVcRnbbM1CJwDbfsShH+n7x/E0tqtMplJv+sJpZNDUSMYT7wgytIQS70+Ca3Dxw0opHb1A655k47gOb0ObwlGA=="
  //     )
  //     .accounts({
  //       profile: profileAcc,
  //       signer: user1.publicKey,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .signers([user1])
  //     .rpc();
  // });

  // it("Display Profile", async () => {
  //   //Profile
  //   const profileSeeds = [Buffer.from("profile"), user1.publicKey.toBuffer()];
  //   const [profileAcc] = await anchor.web3.PublicKey.findProgramAddress(
  //     profileSeeds,
  //     program.programId
  //   );

  //   const permissionAccount = await program.account.profile.fetch(profileAcc);
  //   console.log("On-chain data is:", permissionAccount);
  // });

  it("Add New Doc!", async () => {
    // Generate keypair for the new account
    const doc = new Keypair();

    const seeds = [
      Buffer.from("patient_auth_list"),
      user1.publicKey.toBuffer(),
    ];
    const [patientAuthList, patientNonce] =
      await anchor.web3.PublicKey.findProgramAddress(seeds, program.programId);
    const doctorPub = new PublicKey("4GCuAtDNWAJn5LwLJirkfbrvmRZ7ruYdB4ZE5MyWCLG1");
    const docSeeds = [
      Buffer.from("doctor_auth_list"),
      doctorPub.toBuffer(),
    ];
    const [doctorAuthList, docNonce] =
      await anchor.web3.PublicKey.findProgramAddress(
        docSeeds,
        program.programId
      );

    await program.methods
      .authorizeDoctor(doctorPub.toString())
      // .revokeDoctor(doc1_pub.toString())
      // .revokeDoctor("5BkN3HvH4RWamDJ8yanBEyKnVFyqqJeko879nVabbUew")
      .accounts({
        patientAuthList: patientAuthList,
        doctorAuthList: doctorAuthList,
        signer: user1.publicKey,
        doctor: doctorPub,
        systemProgram: SystemProgram.programId,
      })
      .signers([user1])
      .rpc();

    // // Fetch the created account
    const permissionAccount = await program.account.authList.fetch(
      patientAuthList
    );
    console.log("On-chain data is:", permissionAccount.authorized.toString());
  });

  // it("Remove Doc!", async () => {
  //   const seeds = [Buffer.from("permission_list"), user1.publicKey.toBuffer()];
  //   const [permissionsAccount, nonce] =
  //     await anchor.web3.PublicKey.findProgramAddress(seeds, program.programId);

  //   await program.methods
  //     .removeDoc("93DqU4dtvCczEVzGqUKW8Uw6jxt2dQh9jkHzxho6xiru")
  //     .accounts({
  //       permissionList: permissionsAccount,
  //       signer: user1.publicKey,
  //       systemProgram: SystemProgram.programId,
  //     })
  //     .signers([user1])
  //     .rpc();

  //   console.log(`Removed doc to the permission list.`);
  //   // // Fetch the created account
  //   const permissionAccount = await program.account.permissionList.fetch(permissionsAccount);
  //   console.log("On-chain data is:", permissionAccount.authorized.toString());
  // });

  // it("Display doc", async () => {
  //   const seeds = [Buffer.from("permission_list"), user1.publicKey.toBuffer()];
  //   const [permissionsAccount, nonce] =
  //     await anchor.web3.PublicKey.findProgramAddress(seeds, program.programId);

  //   // // Fetch the created account
  //   const permissionAccount = await program.account.permissionList.fetch(
  //     permissionsAccount
  //   );
  //   console.log("On-chain data is:", permissionAccount.authorized.toString());
  // });

  // it("Append record", async () => {
  //   const seeds = [Buffer.from("permission_list"), user1.publicKey.toBuffer()];
  //   const [permissionsAccount, nonce] =
  //     await anchor.web3.PublicKey.findProgramAddress(seeds, program.programId);

  //   const medicSeeds = [
  //     Buffer.from("medication_list1"),
  //     user1.publicKey.toBuffer(),
  //   ];
  //   const [medicationsAccount, mediNonce] =
  //     await anchor.web3.PublicKey.findProgramAddress(
  //       medicSeeds,
  //       program.programId
  //     );

  //   try {
  //     const txHash = await program.methods
  //       .appendRecord("TEST2")
  //       .accounts({
  //         permissionList: permissionsAccount,
  //         medicationList: medicationsAccount,
  //         patient: user1.publicKey,
  //         signer: doc1.publicKey,
  //         systemProgram: SystemProgram.programId,
  //       })
  //       .signers([doc1])
  //       .rpc();
  // const medicalRecord = await program.account.medicationList.fetch(medicationsAccount);
  // console.log("On-chain data is:", medicalRecord.medication.toString());
  //     console.log(`Use 'solana confirm -v ${txHash}' to see the logs`);
  //   } catch (error) {
  //     console.error("Append failed:", error);
  //   }
  // });

  // it("Display records", async () => {
  //   const medicSeeds = [Buffer.from("medication_list1"), user1.publicKey.toBuffer()];
  //   const [medicationsAccount, medicNonce] = await anchor.web3.PublicKey.findProgramAddress(
  //     medicSeeds,
  //     program.programId
  //   );

  //   // // Fetch the created account
  //   const medicalRecord = await program.account.medicationList.fetch(medicationsAccount);
  //   console.log("On-chain data is:", medicalRecord.medication.toString());
  // });
});
