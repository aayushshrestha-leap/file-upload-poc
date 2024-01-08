const zlib = require("zlib");

function compress(data) {
  return zlib.gzipSync(data, { to: "string" });
}

function decompress(data) {
  return zlib.gunzipSync(data, { to: "string" });
}

module.exports = {
  compress,
  decompress
};
