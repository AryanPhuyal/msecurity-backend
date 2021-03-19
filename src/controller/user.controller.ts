import { Request, Response } from "express";
import passwordTool from "../utility/hashpassword";
import asyncHandler from "express-async-handler";
import { getConnection } from "typeorm";
import User from "../entity/User.entity";
import jwtThing from "../utility/jwtToken";
import dotenv from "../../utils/dotenv";

class UserController {
  connectionManager = getConnection().manager;

  // create user
  create = asyncHandler(async (req: Request, res: Response) => {
    const {
      email,
      password,
      phone,
      firstname,
      lastname,
      middlename,
    } = req.body;

    const userCount = await this.connectionManager.count(User);
    const newUser = new User();
    if (userCount == 0) {
      newUser.role = "admin";
    } else {
      const userExists = this.connectionManager.findOne(User, {
        where: {
          email,
        },
      });
      if (userExists) {
        res.statusCode = 409;
        throw "User with this email already exists";
      }
    }
    newUser.email = email;
    newUser.phone = phone;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    newUser.middlename = middlename;
    newUser.password = await passwordTool.hashPassword(password);
    this.connectionManager.save(newUser);
    const user = await this.connectionManager.findOne(User, {
      where: { email: email },
      select: ["email", "firstname", "lastname", "role", "id", "middlename"],
    });
    res.json({
      success: true,
      message: `Successfully created user for ${email}`,
      user,
    });
  });

  // login User
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.connectionManager.findOne(User, {
      where: { email },
    });
    if (user) {
      const correct = passwordTool.matchPassword(password, user.password);
      if (!correct) {
        res.statusCode = 400;
        throw "User or password is not correct";
      }
      const token = jwtThing.generateToken(
        {
          id: user.id,
        },
        dotenv.JWT_SECRET!
      );
      res.json({
        success: true,
        message: "Login Success",
        token,
        user: {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          role: user.role,
        },
      });
    } else {
      res.statusCode = 400;
      throw "User with this email not found";
    }
  });

  // change password
  changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { newPassword, oldPassword } = req.body;
    const user = req.user;

    const currentUser = await this.connectionManager.findOne(User, {
      where: { id: user.id },
    });
    if (!currentUser) {
      res.statusCode = 401;
      throw "Unauthorized";
    }
    const checkPassword = passwordTool.matchPassword(
      oldPassword,
      currentUser.password
    );
    if (!checkPassword) {
      res.statusCode = 400;
      throw "Password is incorrect";
    }
    const newHash = await passwordTool.hashPassword(newPassword);

    await this.connectionManager
      .createQueryBuilder()
      .update(User)
      .set({ password: newHash })
      .where({ id: user.id })
      .execute();
    res.json({
      success: true,
      message: "Successfully updated Password",
    });
  });
  // update User
}
