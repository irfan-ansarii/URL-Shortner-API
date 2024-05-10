import express from "express";

import { asyncHandler } from "../middlewares/async-handler";
import { handler as notAllowedHandler } from "../middlewares/405-handler";

import {
  findClicksController,
  findClickController,
} from "../controllers/clicks";

const router = express.Router();

/** get analytics for a link */
router.get("/", asyncHandler(findClicksController));

/** get analytics for a link */
router.get("/:id", asyncHandler(findClickController));

/** handle method not allowed */
router.all(["/", "/:id/"], notAllowedHandler);

export { router as clicks };
