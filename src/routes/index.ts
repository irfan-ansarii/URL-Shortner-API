import express from "express";

import { checkAuth } from "../middlewares/check-auth";
import { auth } from "./auth";
import { links } from "./links";
import { clicks } from "./clicks";
import { profile } from "./profile";
import { tokens } from "./tokens";
import { webhooks } from "./webhooks";
import { analytics } from "./analytics";

const router = express.Router();

/** authentication */
router.use("/auth", auth);

/** authorization */
router.use("*", checkAuth);

/** profile route */
router.use("/me", profile);

/** links */
router.use("/links", links);

/** analytics */
router.use("/clicks", clicks);

/** analytics */
router.use("/analytics", analytics);

/** api keys/token */
router.use("/tokens", tokens);

/** webhooks */
router.use("/webhooks", webhooks);

export { router as routes };
