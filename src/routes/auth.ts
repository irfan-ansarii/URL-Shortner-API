import express from "express";

import {
  signin as signinSchema,
  verifyOTP as verifyOTPSchema,
} from "../validations/authSchema";

import { validateData } from "../middlewares/validate-data";
import { asyncHandler } from "../middlewares/async-handler";

import { session, signin, verifyOtp } from "../controllers/auth";
import { checkAuth } from "../middlewares/check-auth";
import { handler as notAllowedHandler } from "../middlewares/405-handler";

const router = express.Router();

/** send otp to users email  */
router.post("/signin", validateData(signinSchema), asyncHandler(signin));

/** generate jwt  */
router.post("/verify", validateData(verifyOTPSchema), verifyOtp);

/** get current user session */
router.get("/session", checkAuth, session);

router.all(["/signin", "/verify", "/session"], notAllowedHandler);

export { router as auth };
