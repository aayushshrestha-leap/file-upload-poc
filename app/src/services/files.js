import axios from "axios";
import { compress } from "../utils/string";

export function uploadFile(data) {
  const compressedContent = compress(data);

  console.log(compressedContent);

  const file = new File([compressedContent], "compressed.json.gz", {
    type: "application/gzip"
  });

  const formData = new FormData();
  formData.append("file", file);

  axios.post("http://localhost:3000/api/upload", formData, {
    headers: {
      "Content-Type": "application/octet-stream"
    }
  });
}
