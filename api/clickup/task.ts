import type { IncomingMessage, ServerResponse } from 'http';

interface VercelRequest extends IncomingMessage {
  query: Record<string, string | string[]>;
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status: (statusCode: number) => VercelResponse;
  json: (data: any) => void;
}

/**
 * Serverless API Route for Vercel deployment
 * Proxies requests to ClickUp API securely without exposing CLICKUP_API_TOKEN to frontend.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow only GET
  if (req.method !== 'GET') {
    return res.status(405).json({
      code: 'METHOD_NOT_ALLOWED',
      message: 'Method Not Allowed',
    });
  }

  const { taskId } = req.query || {};
  const rawTaskId = Array.isArray(taskId) ? taskId[0] : taskId;

  if (!rawTaskId) {
    return res.status(400).json({
      code: 'TASK_NOT_FOUND',
      message: 'ClickUp task not found. Please check the Task ID.',
    });
  }

  // Extract clean ID from potential URL or hash
  const trimmed = String(rawTaskId).trim();
  const urlMatch = trimmed.match(/\/t\/(?:[0-9]+\/)?([a-zA-Z0-9]+)/);
  const cleanTaskId = urlMatch && urlMatch[1] ? urlMatch[1] : trimmed.replace(/^#/, '').split(/[?#]/)[0].trim();

  if (!cleanTaskId) {
    return res.status(400).json({
      code: 'TASK_NOT_FOUND',
      message: 'ClickUp task not found. Please check the Task ID.',
    });
  }

  const token = process.env.CLICKUP_API_TOKEN;
  if (!token) {
    return res.status(401).json({
      code: 'AUTH_FAILED',
      message: 'ClickUp authentication failed. Please check the server configuration.',
    });
  }

  try {
    const clickupUrl = `https://api.clickup.com/api/v2/task/${encodeURIComponent(
      cleanTaskId
    )}?include_subtasks=false&custom_task_ids=true`;

    const clickupRes = await fetch(clickupUrl, {
      method: 'GET',
      headers: {
        Authorization: token,
        'Content-Type': 'application/json',
      },
    });

    if (!clickupRes.ok) {
      if (clickupRes.status === 401) {
        return res.status(401).json({
          code: 'AUTH_FAILED',
          message: 'ClickUp authentication failed. Please check the server configuration.',
        });
      }
      if (clickupRes.status === 403) {
        return res.status(403).json({
          code: 'FORBIDDEN',
          message: "You don't have permission to access this ClickUp task.",
        });
      }
      if (clickupRes.status === 404) {
        return res.status(404).json({
          code: 'TASK_NOT_FOUND',
          message: 'ClickUp task not found. Please check the Task ID.',
        });
      }
      if (clickupRes.status === 429) {
        return res.status(429).json({
          code: 'RATE_LIMITED',
          message: 'ClickUp API rate limit reached. Please try again later.',
        });
      }

      return res.status(clickupRes.status).json({
        code: 'UNKNOWN',
        message: 'Unable to connect to ClickUp. Please try again.',
      });
    }

    const data = await clickupRes.json();
    return res.status(200).json(data);
  } catch {
    return res.status(500).json({
      code: 'NETWORK_ERROR',
      message: 'Unable to connect to ClickUp. Please try again.',
    });
  }
}
