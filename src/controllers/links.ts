import express, { NextFunction, Request, Response } from "express";
import shortid from "shortid";

import { ApplicationError } from "../core/ApplicationError";
import { sendWebhookEvent } from "../lib/webhook";

import {
  findLink,
  createLink,
  findLinks,
  updateLink,
  deleteLink,
  findLinkByShortId,
  findLinksSummary,
} from "../services/links";

const FAVICON_PREFIX = `https://www.google.com/s2/favicons?sz=64&domain_url=`;

/**
 * create
 * @param req @default
 * @param res @default
 */
export const createLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { shortId } = req.body;

  let isShortIdGenerated = false;

  // if key is not passed then generate the key
  if (!shortId) {
    while (!isShortIdGenerated) {
      const generatedShortId = shortid();

      const exist = await findLinkByShortId(generatedShortId);

      if (!exist) {
        req.body.shortId = generatedShortId;
        isShortIdGenerated = true;
      }
    }
  }

  // check if the key is not generated and it is given by the use
  if (!isShortIdGenerated) {
    const exist = await findLinkByShortId(shortId);

    if (exist) {
      const err = new ApplicationError("Short link already exist", 400, {
        errors: [
          {
            fileds: ["shortId"],
            message: "Short link already exist",
          },
        ],
      });
      return next(err);
    }
  }

  const host = req.get("host");
  const { protocol, body, user } = req;

  req.body = {
    ...body,
    shortUrl: `${protocol}://${host}/${body.shortId}`,
    favicon: `${FAVICON_PREFIX}${body.longUrl}`,
  };

  const response = await createLink({ ...req.body, userId: user.id });

  await sendWebhookEvent("link.created", user, response);

  return res.status(201).json({
    data: response,
  });
};

/**
 * find all links
 * @param req @default
 * @param res @default
 */
export const findLinksController = async (req: Request, res: Response) => {
  const { query } = req;

  const { data, meta } = await findLinks({
    ...query,
    userId: req.user.id,
  });

  res.status(200).json({ data, meta });
};

/**
 * find link by id
 * @param req @default
 * @param res @default
 */
export const findLinkController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  const response = await findLink(id, { userId: req.user.id });

  if (!response) {
    const err = new ApplicationError("Link Not Found", 404);
    return next(err);
  }

  return res.status(200).json({
    data: response,
  });
};

/**
 * get link summary
 * @param req @default
 * @param res @default
 */
export const findLinkSummaryController = async (
  req: Request,
  res: Response
) => {
  const response = await findLinksSummary({ userId: req.user.id });

  return res.status(200).json({
    data: response,
  });
};

/**
 * update link
 * @param req @default
 * @param res @default
 */
export const updateLinkController = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  const { params, user, body } = req;
  const { id } = params;

  const exist = await findLink(id, { userId: user.id });

  if (!exist) {
    const err = new ApplicationError("Link Not Found", 404);
    return next(err);
  }

  req.body = {
    ...body,
    favicon: `${FAVICON_PREFIX}${body.longUrl}`,
  };

  const response = await updateLink(id, { ...req.body });

  await sendWebhookEvent("link.updated", user, response);

  res.status(200).json({ data: response });
};

/**
 * delete link by given id
 * @param req @default
 * @param res @default
 */
export const deleteLinkController = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  const { user, params } = req;
  const { id } = params;

  const exist = await findLink(id, { userId: user.id });

  if (!exist) {
    const err = new ApplicationError("Link Not Found", 404);
    return next(err);
  }

  const response = await deleteLink(id);

  await sendWebhookEvent("link.deleted", user, response);

  res.status(200).json({ data: response });
};

/**
 * find link by shortId
 * @param req @default
 * @param res @default
 */
export const checkLinkAvailabilityController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { shortId } = req.params;

  const isValid = /^[a-zA-Z0-9]{2,}$/.test(shortId);

  if (!isValid) {
    const err = new ApplicationError(
      "Required at least 2 characters and consist of letters and numbers",
      400
    );
    return next(err);
  }

  const response = await findLinkByShortId(shortId);

  if (!response) {
    return res.status(200).json({
      success: true,
    });
  }
  return res.status(404).json({
    success: false,
  });
};
