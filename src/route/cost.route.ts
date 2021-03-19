import express, { Router } from "express";
import CostController from "../controller/cost.controller";

const router = Router();

const costController = new CostController();

router.post("/create", costController.create);
router.put("/update-platform/:id", costController.updatePrice);
router.delete("/delete-platform/:id", costController.delete);
