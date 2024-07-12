import { MediaRenderer, useStorageUpload } from "@thirdweb-dev/react";
import { useState } from "react";
import { Input } from "antd";

const Test = () => {
  const [file, setFile] = useState<File | undefined>();
  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const { mutateAsync: upload, isLoading } = useStorageUpload();

  const uploadToIpfs = async () => {
    if (file) {
      try {
        const uploadUrl = await upload({
          data: [file],
          options: {
            uploadWithoutDirectory: true,
            uploadWithGatewayUrl: true,
          },
        });

        console.log(uploadUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  return (
    <div>
      <Input
        type="file"
        onChange={(e) => {
          if (e.target.files) {
            setFile(e.target.files[0]);
            setFileUrl(URL.createObjectURL(e.target.files[0]));
          }
        }}
      />
      <button className="text" onClick={uploadToIpfs} disabled={isLoading}>
        {isLoading ? "Uploading..." : "Upload"}
      </button>

      <img src={fileUrl} alt="img" />
      <MediaRenderer src="" />
    </div >
  );
};

export default Test;
