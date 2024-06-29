import { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnect = () => {
  const [balance, setBalance] = useState(0);

  // connection context object that is injected into the browser by the wallet
  const { connection } = useConnection();
  // user's public key of the wallet they connected to our application
  const { publicKey } = useWallet();

  // when the status of `connection` or `publicKey` changes, we execute the code block below
  useEffect(() => {
    const getInfo = async () => {
      if (connection && publicKey) {
        // we get the account info for the user's wallet data store and set the balance in our application's state
        const info = await connection.getAccountInfo(publicKey);
        setBalance(info!.lamports / LAMPORTS_PER_SOL);
        console.log(info!.lamports / LAMPORTS_PER_SOL);
      }
    };
    getInfo();
    // the code above will execute whenever these variables change in any way
  }, [connection, publicKey]);

  return (
    <WalletModalProvider>
      {/* button component for connecting to solana wallet */}
      <WalletMultiButton className="bg-[#124588] rounded-xl hover:bg-[#124588] transition-all duration-200" />
      {/* <main className="min-h-screen text-white">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
          <div className="col-span-1 lg:col-start-2 lg:col-end-4 rounded-lg bg-[#2a302f] h-60 p-4">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-semibold">account info ✨</h2>
              
              <WalletMultiButton className="!bg-helius-orange !rounded-xl hover:!bg-[#161b19] transition-all duration-200" />
            </div>

            <div className="mt-8 bg-[#222524] border-2 border-gray-500 rounded-lg p-2">
              <ul className="p-2">
                <li className="flex justify-between">
                  <p className="tracking-wider">Wallet is connected...</p>
                  <p className="text-helius-orange italic font-semibold">
                    {publicKey ? "yes" : "no"}
                  </p>
                </li>

                <li className="text-sm mt-4 flex justify-between">
                  <p className="tracking-wider">Balance...</p>
                  <p className="text-helius-orange italic font-semibold">
                    {balance}
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      */}
    </WalletModalProvider>
  );
};

export default WalletConnect;
