import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import { analyzeCode } from "../utils/aiHelper.js";
import { getLatestCommitSHA } from "../githubHelper.js";
import { savePRRev
/**
 * GitHub Webhook Handler
 */
export function githubWebhookHandler(req, res) {
    const signature = `sha256=${crypto
        .createHmac("sha256", process.env.GITHUB_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex")}`;

    if (req.headers["x-hub-signature-256"] !== signature) {
        return res.status(401).send("Unauthorized");
    }

