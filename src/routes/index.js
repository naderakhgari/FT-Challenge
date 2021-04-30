import express from "express";

import { loadData } from "./loadData";

const router = express.Router();

router.get("/api", loadData);
router.get("/search/", loadData);

export default router;
