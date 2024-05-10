import express from "express";

import { asyncHandler } from "../middlewares/async-handler";
import { handler as notAllowedHandler } from "../middlewares/405-handler";
import { validateData } from "../middlewares/validate-data";

import {
  createWebhookController,
  findWebhooksController,
  findWebhookController,
  updateWebhookController,
  deleteWebhookController,
} from "../controllers/webhooks";
import { webhookSchema } from "../validations/webhookSchema";

const router = express.Router();

/** get all webhooks */
router
  .route("/")
  .get(asyncHandler(findWebhooksController))
  .post(validateData(webhookSchema), asyncHandler(createWebhookController));

/** GET/PUT/DELETE webhook routes */
router
  .route("/:id")
  .get(asyncHandler(findWebhookController))
  .put(validateData(webhookSchema), asyncHandler(updateWebhookController))
  .delete(asyncHandler(deleteWebhookController));

/** handle method not allowed */
router.all(["/", "/:id"], notAllowedHandler);

export { router as webhooks };
