import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
require("@solana/wallet-adapter-react-ui/styles.css");

const WalletConnect = () => {
  return (
    <WalletModalProvider>
      <WalletMultiButton className="bg-[#124588] rounded-xl hover:bg-[#124588] transition-all duration-200" />
    </WalletModalProvider>
  );
};

export default WalletConnect;
