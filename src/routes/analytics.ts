import express from "express";

import { asyncHandler } from "../middlewares/async-handler";
import { handler as notAllowedHandler } from "../middlewares/405-handler";

import {
  findAnalyticController,
  findAnalyticsController,
  findTimeSeriesController,
} from "../controllers/analytics";

const router = express.Router();

/** get analytics for a link */
router.get("/", asyncHandler(findAnalyticsController));

/** get analytics for a link */
router.get("/timeseries", asyncHandler(findTimeSeriesController));

/** get analytics for a link */
router.get("/:id", asyncHandler(findAnalyticController));

/** get analytics for a link */
router.get("/:id/timeseries/", asyncHandler(findTimeSeriesController));

/** handle method not allowed */
router.all(
  ["/", "/:id/", "/timeseries", "/:id/timeseries/"],
  notAllowedHandler
);

export { router as analytics };
