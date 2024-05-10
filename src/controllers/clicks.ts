import express, { NextFunction, Request, Response } from "express";
import geo from "geoip-lite";
import DeviceDetector from "device-detector-js";

import { ApplicationError } from "../core/ApplicationError";
import { findLinkByShortId, updateLink } from "../services/links";
import { createClick, findClick, findClicks } from "../services/clicks";
import { sendWebhookEvent } from "../lib/webhook";

import { NOT_FOUND_REDIRECT } from "../../config/CONSTANTS";

export const createClickController = async (req: Request, res: Response) => {
  const { shortId } = req.params;

  const response = await findLinkByShortId(shortId);

  const isArchived = response?.status === "archived";

  if (!response || !response.longUrl || isArchived) {
    // default route to error page
    return res.redirect(NOT_FOUND_REDIRECT!);
  }

  const { ip = "" } = req;
  const deviceDetector = new DeviceDetector();

  const geoData = geo.lookup(ip);
  const agent = req.get("User-Agent") || "";
  const referrer = req.get("Referrer");
  const device = deviceDetector.parse(agent);

  const analyticsData = {
    linkId: response.id,
    userId: response.userId,
    ipAddress: ip,
    referrer: device.bot || referrer || "direct",
    country: geoData?.country || "unknown",
    state: geoData?.city || "unknown",
    browser: device.client?.name || "unknown",
    deviceType: device.device?.type || "unknown",
    operatingSystem: device.os?.name || "unknown",
  };

  await Promise.all([
    createClick(analyticsData),
    updateLink(response.id, {
      clickCount: (response.clickCount || 0) + 1,
      lastClickedAt: new Date(),
    }),
    sendWebhookEvent("link.visited", { id: response.userId! }, response),
  ]);

  res.redirect(response.longUrl);
};

/**
 * get analytics all the links
 * @param req @default
 * @param res @default
 */
export const findClicksController = async (
  req: express.Request,
  res: express.Response
) => {
  const { query } = req;

  const { data, meta } = await findClicks({
    ...query,
    userId: req.user.id,
  });

  res.status(200).json({ data, meta });
};

/**
 * find click by id
 * @param req @default
 * @param res @default
 */
export const findClickController = async (
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  const { params } = req;
  const { query } = req;

  const response = await findClick(params.id, { userId: req.user.id });

  if (!response) {
    const err = new ApplicationError("Click Not Found", 404);
    return next(err);
  }

  res.status(200).json({ data: response });
};
