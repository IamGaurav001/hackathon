import crypto from "crypto";
import axios from "axios";
import dotenv from "dotenv";
import { analyzeCode } from "../utils/aiHelper.js";
import { getLatestCommitSHA } from "../githubHelper.js";
import { savePRReview } from "../dbController.js"; // ✅ Import database function

dotenv.config();

/**
 * GitHub Webhook Handler
 */
export function githubWebhookHandler(req, res) {
    const signature = `sha256=${crypto
        .createHmac("sha256", .env.GITHUB_SECRET)
        .update(JSON.stringify(req.body))
        .digest("hex")}`;

    }
    res.sendStatus(200);
}

/**
 * Process Pull Request
 */
async function processPR(pr) {
  console.log(`🔹 Processing PR: #${pr.number} in ${pr.base.repo.full_name}`);
  
  try {
      const { data: diffData } = await axios.get(pr.diff_url);
      console.log("✅ Diff Fetched Successfully");

      const reviewComments = await analyzeCode(diffData);
      
      // ✅ Save PR review in MongoDB
      await savePRReview(pr.number, pr.base.repo.full_name, reviewComments);
      
      // ✅ Post inline comments
      for (const comment of reviewComments) {
          await postInlineComment(
              pr.base.repo.full_name,
              pr.number,
              comment.line,
              comment.issue,
              comment.suggestion
          );
      }
  } catch (error) {
      console.error("❌ Error Processing PR:", error.message);
  }
}

/**
 * Apply AI-Suggested Fix
 */
async function acceptFix(repoFullName, prNumber, filename, lineNumber, fixContent) {
    const githubToken = process.env.GITHUB_TOKEN;
    const branch = "fix-ai-suggestions";
    const commitMessage = "🤖 Auto-fix suggested by AI Review Bot";

    try {
        const { data: file } = await axios(
            `https://api.github.com/repos/${repoFullName}/contents/${filename}`,
            { headers: { Authorization: `token ${githubToken}` } }
        );

        const content = Buffer.from(file.content, 'base64').toString('utf8').split("\n");
        content[lineNumber - 1] = fixContent;
        const newContent = Buffer.from(content.join("\n")).toString('base64');

        await axios.put(
            `https://api.github.com/repos/${repoFullName}/contents/${filename}`,
            {
                message: 
            { headers: { Authorization: `token ${githubToken}` } }
        );

        console.log(`✅ Fix Applied Automatically:}`);
    } catch (error) {
        console.error("❌ Error Applying Fix:", error.response?.data || error.message);
    }
}
