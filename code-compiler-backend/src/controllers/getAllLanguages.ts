import { NextFunction, Request, Response } from "express";
import { getAllLanguages } from "../runners/getLanguages";

export const getLanguages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
   const languages = getAllLanguages();
    res.json(languages);
  } catch (error) {
    next(error);
  }
};
