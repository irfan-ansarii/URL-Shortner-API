import * as z from "zod";

export const signin = z.strictObject({
  email: z
    .string({ required_error: "Email is a required field" })
    .email({ message: "Invalid email" }),
});

export const verifyOTP = z.strictObject({
  email: z
    .string({ required_error: "Email is a required field" })
    .email({ message: "Invalid email" }),
  otp: z
    .string({ required_error: "OTP is a required field" })
    .regex(/^\d{6}$/, { message: "OTP must be 6 characters" }),
});

export const userSchema = z
  .object({
    firstName: z.union([
      z
        .string({ required_error: "First Name is a required filed" })
        .min(2, { message: "First Name must be atleast 2 characters" }),
      z.undefined(),
    ]),
    lastName: z.union([
      z
        .string({ required_error: "Last Name is a required filed" })
        .min(2, { message: "Last Name must be atleast 2 characters" }),
      z.undefined(),
    ]),
    phone: z.union([
      z
        .string({ required_error: "Phone is a required field" })
        .length(10, { message: "Phone must be 10 characters" }),
      z.undefined(),
    ]),
    email: z.union([
      z
        .string({ required_error: "Email is a required field" })
        .email({ message: "Invalid email" }),
      z.undefined(),
    ]),
  })
  .strict();
