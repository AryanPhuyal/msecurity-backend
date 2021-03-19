import fs from "fs";
import path from "path";

export const PRIVATE_KEY = fs.readFileSync(
  path.join(__dirname, "../keys/key.pem"),
  "utf8"
);
export const CERTIFICATE = fs.readFileSync(
  path.join(__dirname, "../keys/cert.pem")
);
