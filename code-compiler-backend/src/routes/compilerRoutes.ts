import express from "express"
import { getLanguages } from "../controllers/getAllLanguages";
import { compileCode } from "../controllers/compileCode";


const router = express.Router();


router.get("/languages",getLanguages)
router.post("/run",compileCode)

export default router