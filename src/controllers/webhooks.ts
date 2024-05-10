import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../core/ApplicationError";
import { testWebhookURL } from "../lib/webhook";

import {
  createWebhook,
  deleteWebhook,
  findWebhooks,
  findWebhook,
  updateWebhook,
} from "../services/webhooks";
import { sendEmail } from "../lib/email";

export const createWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { user, body } = req;

  body.userId = user.id;

  const isOk = await testWebhookURL(body.url);

  if (!isOk) {
    const err = new ApplicationError(
      "The webhook URL must return 200 status",
      400
    );
    return next(err);
  }
  const result = await createWebhook(body);

  /** send webhook created email to user */
  await sendEmail(user.email!, "Webhook created", "webhook", {});

  return res.status(201).json({
    data: result,
  });
};

/**
 * find all links
 * @param req @default
 * @param res @default
 */
export const findWebhooksController = async (req: Request, res: Response) => {
  const { user, query } = req;

  const results = await findWebhooks({
    ...query,
    userId: user.id,
  });

  res.status(200).json({ data: results });
};

/**
 * find link by id
 * @param req @default
 * @param res @default
 */
export const findWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params, user } = req;

  const response = await findWebhook(params.id, { userId: user.id });

  if (!response) {
    const err = new ApplicationError(
      "The requested resource is not available",
      404
    );
    return next(err);
  }

  return res.status(200).json({
    data: response,
  });
};

/**
 * update webhook by id
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const updateWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params, user, body } = req;

  const response = await findWebhook(params.id, { userId: user.id });

  if (!response) {
    const err = new ApplicationError(
      "The requested resource is not available",
      404
    );
    return next(err);
  }

  const result = await updateWebhook(params.id, {
    ...body,
  });

  return res.status(200).json({
    data: result,
  });
};

/**
 * delete webhook by id
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const deleteWebhookController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params, user } = req;

  const response = await findWebhook(params.id, { userId: user.id });

  if (!response) {
    const err = new ApplicationError(
      "The requested resource is not available",
      404
    );
    return next(err);
  }

  const result = await deleteWebhook(params.id);

  return res.status(200).json({
    data: result,
  });
};
