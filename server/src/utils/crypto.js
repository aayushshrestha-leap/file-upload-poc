const pako = require("pako");
const crypto = require("crypto");

function generateKey(password) {
  const salt = crypto.randomBytes(16);
  const key = crypto.pbkdf2Sync(password, salt, 10000, 32, "sha512");
  return key.toString("hex"); // Convert generated key to a string
}

function encryptData(data, secretKey) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"), // Convert string key to a Buffer
    iv
  );
  let encryptedData = cipher.update(data, null, "hex");
  encryptedData += cipher.final("hex");
  return `${iv.toString("hex")}:${encryptedData}`;
}

function decompressAndDecryptData(encryptedData, secretKey) {
  const [ivHex, encryptedDataHex] = encryptedData.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey, "hex"), // Convert string key to a Buffer
    iv
  );
  let decryptedData = decipher.update(encryptedDataHex, "hex", "binary");
  decryptedData += decipher.final("binary");
  const decompressedData = pako.ungzip(Buffer.from(decryptedData, "binary"), {
    to: "string"
  });
  return decompressedData;
}

module.exports = {
  generateKey,
  encryptData,
  decompressAndDecryptData
};
