import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { getConnection } from "typeorm";
import Cost from "../entity/Cost.entity";
// only admin can access all the function
export default class CostController {
  connectionManager = getConnection().manager;
  create = asyncHandler(async (req: Request, res: Response) => {
    const { platform, price } = req.body;
    const findPlatform = await this.connectionManager.findOne(Cost, {
      where: { platform: platform.toLowerCase() },
    });
    if (findPlatform) {
      res.statusCode = 400;
      throw "Platform already exists";
    }
    const newPlatform = new Cost();
    newPlatform.platform = platform.toLowerCase();
    newPlatform.price = price;
    await this.connectionManager.save(newPlatform);
    const addedPlatform = await this.connectionManager.findOne(Cost, {
      where: { platform: platform.toLowerCase() },
    });
    res.json({
      success: true,
      message: "Successfully added Platform",
      platform: addedPlatform,
    });
  });
  updatePrice = asyncHandler(async (req: Request, res: Response) => {
    const { newPrice } = req.body;
    const { id } = req.params;
    const platform = await this.connectionManager.findOne(Cost, {
      where: { id },
    });
    if (!platform) {
      res.statusCode = 400;
      throw "Platform doesn't exists";
    }
    platform.price = newPrice;
    this.connectionManager
      .createQueryBuilder(Cost, "cosr")
      .update()
      .set({ price: newPrice })
      .where({ id: id })
      .execute();
    this.connectionManager.save(platform);
    res.json({
      success: true,
      message: "Successfully updated price",
    });
  });
  delete = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const platform = await this.connectionManager.findOne(Cost, {
      where: { id },
    });
    if (!platform) {
      res.statusCode = 400;
      throw "Platform doesn't exists";
    }
    this.connectionManager
      .createQueryBuilder(Cost, "cosr")
      .update()
      .set({ delete: true })
      .where({ id: id })
      .execute();
    this.connectionManager.save(platform);
    res.json({
      success: true,
      message: "Successfully updated price",
    });
  });
}
