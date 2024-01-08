import pako from "pako";

export function compress(data) {
  return pako.gzip(data);
}
