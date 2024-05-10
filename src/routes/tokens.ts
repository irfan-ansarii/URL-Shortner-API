import express from "express";

import { asyncHandler } from "../middlewares/async-handler";
import { handler as notAllowedHandler } from "../middlewares/405-handler";
import { validateData } from "../middlewares/validate-data";
import { tokenSchema } from "../validations/tokenSchema";

import {
  createTokenController,
  deleteTokenController,
  findTokensController,
  findTokenController,
  updateTokenController,
} from "../controllers/tokens";

const router = express.Router();

/** token CREATE/READ */
router
  .route("/")
  .get(asyncHandler(findTokensController))
  .post(validateData(tokenSchema), asyncHandler(createTokenController));

/** GET/PUT/DELETE token routes */
router
  .route("/:id")
  .get(asyncHandler(findTokenController))
  .put(asyncHandler(updateTokenController))
  .delete(asyncHandler(deleteTokenController));

/** handle method not allowed */
router.all(["/", "/:id"], notAllowedHandler);

export { router as tokens };
