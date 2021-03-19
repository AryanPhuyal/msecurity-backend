import jwt, { Secret } from "jsonwebtoken";
const generateToken = async (data: any, key: Secret) => {
  jwt.sign(data, key, (err: any, token: any) => {
    if (err) {
      throw err;
    } else {
      return token;
    }
  });
};

const decryptToken = (token: string, key: Secret) => {
  jwt.verify(token, key, (err, data) => {
    if (err) {
      throw err;
    } else {
      return data;
    }
  });
};

export default {
  generateToken,
  decryptToken,
};
