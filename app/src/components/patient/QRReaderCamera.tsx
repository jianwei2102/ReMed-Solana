import QrScanner from "qr-scanner";
import QrFrame from "../../assets/qr-frame.svg";
import { useEffect, useRef, useState, useCallback } from "react";

interface QRReaderCameraProps {
  onScanSuccess: (result: string) => void; // New prop
}

const QRReaderCamera = ({ onScanSuccess }: QRReaderCameraProps) => {
  // QR States
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  // Success
  const onScan = useCallback(
    (result: QrScanner.ScanResult) => {
      // Check if the scanned data is 44 characters long (wallet address length)
      if (result?.data.length === 44) {
        onScanSuccess(result?.data); // Call the prop function with the scan result
      }
    },
    [onScanSuccess]
  );

  // Fail
  const onScanFail = (err: string | Error) => {
    // 🖨 Print the "err" to browser console.
    console.log(err);
  };

  useEffect(() => {
    const videoElement = videoEl.current; // Copy to a variable for cleanup
    if (videoElement && !scanner.current) {
      // 👉 Instantiate the QR Scanner
      scanner.current = new QrScanner(videoElement, onScan, {
        onDecodeError: onScanFail,
        // 📷 This is the camera facing mode. In mobile devices, "environment" means back camera and "user" means front camera.
        preferredCamera: "environment",
        // 🖼 This will help us position our "QrFrame.svg" so that user can only scan when qr code is put in between our QrFrame.svg.
        highlightScanRegion: true,
        // 🔥 This will produce a yellow (default color) outline around the qr code that we scan, showing a proof that our qr-scanner is scanning that qr code.
        highlightCodeOutline: true,
        // 📦 A custom div which will pair with "highlightScanRegion" option above 👆. This gives us full control over our scan region.
        overlay: qrBoxEl?.current || undefined,
      });

      // 🚀 Start QR Scanner
      scanner.current
        .start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    // 🧹 Clean up on unmount.
    // 🚨 This removes the QR Scanner from rendering and using camera when it is closed or removed from the UI.
    return () => {
      if (scanner.current) {
        scanner.current.stop();
        scanner.current = undefined;
      }
    };
  }, [onScan]); // Added `onScan` to the dependency array

  // ❌ If "camera" is not allowed in browser permissions, show an alert.
  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
      );
  }, [qrOn]);

  return (
    <div className="qr-reader">
      {/* QR */}
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box">
        <img
          src={QrFrame}
          alt="Qr Frame"
          width={256}
          height={256}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 fill-none"
        />
      </div>
    </div>
  );
};

export default QRReaderCamera;
