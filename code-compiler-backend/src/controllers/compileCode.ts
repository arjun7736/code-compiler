import { NextFunction, Request, Response } from "express";
import { runCodeInDocker } from "../runners/runCode";

export const compileCode = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { language, code } = req.body;
    const result = await runCodeInDocker({ language, code });
    res.json(result);
  } catch (error) {
    next(error);
  }
};
