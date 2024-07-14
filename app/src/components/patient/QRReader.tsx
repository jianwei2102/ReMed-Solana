import { Button } from "antd";
import { useState } from "react";
import QRReaderCamera from "./QRReaderCamera";

interface QRReaderProps {
  onScanSuccess: (result: string) => void; // New prop
}

const QRReader = ({ onScanSuccess }: QRReaderProps) => {
  const [openQr, setOpenQr] = useState<boolean>(false);

  const handleScanSuccess = (result: string) => {
    // Call the parent callback with the scan result
    onScanSuccess(result);
    // Close the QR scanner
    setOpenQr(false);
  };

  return (
    <div className="flex flex-col">
      <span className="text-md font-semibold">Or scan wallet's QR code</span>
      <div className="flex my-4">
        <Button className="w-full" onClick={() => setOpenQr(!openQr)}>
          {openQr ? "Close" : "Open"} QR Scanner
        </Button>
      </div>
      {openQr && <QRReaderCamera onScanSuccess={handleScanSuccess} />}{" "}
    </div>
  );
};

export default QRReader;
