import express, { Router } from "express";
import LicenseController from "../controller/license.controller";

const router = Router();

const licenseController = new LicenseController();

router.post("/create", licenseController.createLicense);
