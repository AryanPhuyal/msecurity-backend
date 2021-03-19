import { Request, Response } from "express";
import { getConnection } from "typeorm";
import asyncHandler from "express-async-handler";
import Partner from "../entity/Partner.entity";
import passwordTool from "../utility/hashpassword";
import dotenv from "../../utils/dotenv";
import jwtTools from "../utility/jwtToken";

class PartnerController {
  connectionManager = getConnection().manager;
  // only admin user can create partner
  //   password is mailed to end user via email
  //body
  // --name
  // --email
  // --location
  // --phone
  createPartner = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, location, phone, password } = req.body;
    const partnerCount = await this.connectionManager.count(Partner);
    const newPartner = new Partner();
    if (partnerCount == 0) {
      newPartner.role == "admin";
    } else {
      const partnerExists = await this.connectionManager
        .createQueryBuilder(Partner, "partner")
        .select("partner.id")
        .where("partner.email = :email OR partner.phone :phone ", {
          email,
          phone,
        })
        .getCount();
      if (partnerExists >= 1) {
        res.statusCode = 409;
        throw "Partner with this email already exists";
      }
    }
    newPartner.name = name;
    newPartner.password = await passwordTool.hashPassword(password);
    newPartner.location = location;
    newPartner.email = email;
    newPartner.phone = phone;
    await this.connectionManager.save(newPartner);

    res.json({
      success: true,
      message:
        "Successfully created partner. Check your mail to change password",
    });
  });

  //   change password of partner via emailed link
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const partner = req.partner;
    if (!partner) {
      res.statusCode = 401;
      throw "Unauthorize";
    }

    const getPartner = await this.connectionManager.findOne(Partner, {
      where: {
        id: partner.id,
      },
    });
    if (!getPartner) {
      res.statusCode = 400;
      throw "this user not found";
    }
    const comparePassword = passwordTool.matchPassword(
      oldPassword,
      getPartner.password
    );
    if (!comparePassword) {
      res.statusCode = 400;
      throw "Password doesn't match. Try Again";
    }
    await this.connectionManager
      .createQueryBuilder(Partner, "partner")
      .update()
      .set({ password: await passwordTool.hashPassword(newPassword) })
      .where({ id: getPartner.id })
      .execute();

    res.json({
      success: true,
      message: "Successfully updated password",
    });
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const partner = await this.connectionManager.findOne(Partner, {
      where: { email },
    });
    if (!partner) {
      res.statusCode = 400;
      throw "User not exists";
    }
    const matchPassword = passwordTool.matchPassword(
      password,
      partner.password
    );
    if (!matchPassword) {
      res.statusCode = 400;
      throw "User or Password is incorrect";
    }
    const token = jwtTools.generateToken(
      {
        id: partner.id,
      },
      dotenv.JWT_SECRET!
    );

    res.json({
      success: true,
      token: token,
      user: {
        email: partner.email,
        location: partner.location,
        name: partner.name,
        id: partner.id,
        dueUpTO: partner.dueUpTo,
        role: partner.role,
        commission: partner.commission,
      },
    });
  });
}
