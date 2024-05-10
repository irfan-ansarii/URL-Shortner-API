import { NextFunction, Request, Response } from "express";

import { ApplicationError } from "../core/ApplicationError";

import { findLink } from "../services/links";

import {
  findAnalytic,
  findAnalytics,
  findTimeSeries,
} from "../services/analytics";

/**
 * get analytics all the links
 * @param req @default
 * @param res @default
 */
export const findAnalyticsController = async (req: Request, res: Response) => {
  const { query } = req;

  const results = await findAnalytics({
    ...query,
    userId: req.user.id,
  });

  res.status(200).json({ data: results });
};

/**
 * get timeseries data for all links or specified id
 * @param req @default
 * @param res @default
 */
export const findTimeSeriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { query } = req;
  const { params } = req;

  if (params && params.id) {
    const response = await findLink(params.id, { userId: req.user.id });

    if (!response) {
      const err = new ApplicationError("Link Not Found", 404);
      return next(err);
    }
  }

  const results = await findTimeSeries(params.id, {
    ...query,
    userId: req.user.id,
  });

  res.status(200).json({ data: results });
};

/**
 * get analytics for the given id
 * @param req @default
 * @param res @default
 */
export const findAnalyticController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { params } = req;
  const { query } = req;

  const response = await findLink(params.id, { userId: req.user.id });

  if (!response) {
    const err = new ApplicationError("Link Not Found", 404);
    return next(err);
  }

  const result = await findAnalytic(params.id, {
    ...query,
    userId: req.user.id,
  });

  res.status(200).json({ data: result });
};
