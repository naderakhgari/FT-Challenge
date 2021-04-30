import express from "express";

import { loadData } from "./loadData";

const router = express.Router();

router.get("/api", loadData);

export default router;
