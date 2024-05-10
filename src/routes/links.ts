import express from "express";

import { asyncHandler } from "../middlewares/async-handler";
import { linkSchema, updateLinkSchema } from "../validations/linkSchema";
import { handler as notAllowedHandler } from "../middlewares/405-handler";
import { validateData } from "../middlewares/validate-data";

import {
  checkLinkAvailabilityController,
  createLinkController,
  deleteLinkController,
  findLinkController,
  findLinkSummaryController,
  findLinksController,
  updateLinkController,
} from "../controllers/links";

const router = express.Router();

/** get all links be current user */
router
  .route("/")
  .get(asyncHandler(findLinksController))
  .post(validateData(linkSchema), asyncHandler(createLinkController));

/** get links summary COUNT/SUM OF CLICK COUNT/AVERAGE OF CLICKS*/
router.route("/summary").get(asyncHandler(findLinkSummaryController));

/** GET/PUT/DELETE link routes */
router
  .route("/:id")
  .get(asyncHandler(findLinkController))
  .put(validateData(updateLinkSchema), asyncHandler(updateLinkController))
  .delete(asyncHandler(deleteLinkController));

/** check shortid availability */
router
  .route("/:shortId/availability")
  .get(asyncHandler(checkLinkAvailabilityController));

/** handle method not allowed */
router.all(
  ["/", "/:id", "/summary", "/:shortId/availability"],
  notAllowedHandler
);

export { router as links };
