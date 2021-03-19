import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;
const PORT_SSL = process.env.PORT_SSL;

const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL = process.env.MAIL_EMAIL;
const PASSWORD = process.env.MAIL_PASSWORD;
const SERVICE = process.env.MAIL_SERVER;
const MAIL_TOKEN = process.env.MAIL_TOKEN;
export default {
  PORT,
  PORT_SSL,
  JWT_SECRET,
  EMAIL,
  PASSWORD,
  SERVICE,
  MAIL_TOKEN,
};
