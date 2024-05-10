import express from "express";
import { handler as notAllowedHandler } from "../middlewares/405-handler";
import { asyncHandler } from "../middlewares/async-handler";
import { validateData } from "../middlewares/validate-data";
import { userSchema } from "../validations/authSchema";

import {
  deleteProfileController,
  updateProfileController,
} from "../controllers/profile";
import { session } from "../controllers/auth";

const router = express.Router();

/** get current user session */
router.get("/", session);

router.put(
  "/",
  validateData(userSchema),
  asyncHandler(updateProfileController)
);

router.delete("/", asyncHandler(deleteProfileController));

router.all(["/"], notAllowedHandler);

export { router as profile };
