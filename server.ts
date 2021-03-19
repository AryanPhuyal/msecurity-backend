import express, { Request, Response } from "express";
import dotenv from "./utils/dotenv";
import { getConnection, createConnection } from "typeorm";
import https from "https";
import http from "http";

import path from "path";
const app = express();
import { CERTIFICATE, PRIVATE_KEY } from "./utils/keys";
var credentials = { key: PRIVATE_KEY, cert: CERTIFICATE };
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
app.use(express.static(path.join(__dirname, "../../client/build")));

app.use("*", (req: Request, res: Response) => res.send());

const connection = async () => {
  createConnection()
    .then((connection) => {
      console.log(
        `[Server is connected to database] [status ${connection.isConnected}]`
      );
      httpsServer.listen(dotenv.PORT_SSL, () => {
        console.log(`[Https Server is running ] [Port ${dotenv.PORT_SSL}]`);
      });
      httpServer.listen(dotenv.PORT, () => {
        console.log(`[Http server is running] [Port ${dotenv.PORT}]`);
      });
    })
    .catch((err) => {
      console.log(err.message);
    });
};
connection();
