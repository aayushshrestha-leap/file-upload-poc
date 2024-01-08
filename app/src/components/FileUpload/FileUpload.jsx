import { useState } from "react";
import { uploadFile } from "../../services/files";

export function FileUpload() {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;

      uploadFile(fileContent);
    };

    reader.onerror = (event) => {
      console.log(event.target.error);
    };

    reader.readAsText(file);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "12px"
        }}
      >
        <input
          accept=".json"
          style={{
            display: "none"
          }}
          id="file"
          type="file"
          onChange={handleFileChange}
        />
        <label
          style={{
            border: "1px solid black",
            padding: "6px 12px",
            borderRadius: "4px",
            cursor: "pointer"
          }}
          htmlFor="file"
        >
          Choose File
        </label>

        <span
          style={{
            marginLeft: "12px"
          }}
        >
          {file ? file.name : "No file selected"}
        </span>
      </div>

      <button type="submit">Upload</button>
    </form>
  );
}
