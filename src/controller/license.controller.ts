import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getConnection } from "typeorm";
import { License } from "../entity/License.entity";
import randomKeyTool from "../utility/randomkey";
export default class LicenseController {
  connectionManager = getConnection().manager;

  // check unique license
  findUniqueLicense = async (key: string) => {
    const license = await this.connectionManager.findOne(License, {
      where: { license: key },
    });
    if (!license) {
      return true;
    }
    return false;
  };

  // check unique sn
  findUniqueSn = async (key: string) => {
    const license = await this.connectionManager.findOne(License, {
      where: { sn: key },
    });
    if (!license) {
      return true;
    }
    return false;
  };

  // only register partner can create license
  // payment should be done before create license
  // one partner cam hold up to dueUpTo without payment
  createLicense = asyncHandler(async (req: Request, res: Response) => {
    const { number, platformId } = req.body;

    for (var i = 0; i < number; i++) {
      let license: string;
      while (true) {
        license = (randomKeyTool.randomLicense as any) as string;
        if (this.findUniqueLicense(license)) {
          break;
        }
      }

      let sn: string;
      while (true) {
        sn = (randomKeyTool.randomLicense as any) as string;
        if (this.findUniqueSn(sn)) {
          break;
        }
      }
      const newLicense = new License();
      newLicense.license = license;
      newLicense.sn = sn;
      newLicense.partner = req.partner;
      this.connectionManager.save(newLicense);
    }
    res.json({
      success: true,
      message: `Successfully created ${number} Licenses`,
    });
  });

  // list all license for logged in partner
  // list all license for all partner
  getAllLicense = asyncHandler(async (req: Request, res: Response) => {});

  // activate license
  activateLicense = asyncHandler(async (req: Request, res: Response) => {});
  // check license
  checkLicense = asyncHandler(async (req: Request, res: Response) => {});

  //   only admin partner can transfer to other user
  transferLicense = asyncHandler(async (req: Request, res: Response) => {});

  //   refund key
  // return payment
  //   delete key assigned to that partner
  refund = asyncHandler(async (req: Request, res: Response) => {});
}
