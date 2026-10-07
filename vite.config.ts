import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv, type Plugin } from 'vite';

function clickupApiDevPlugin(): Plugin {
  return {
    name: 'clickup-api-dev-proxy',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/clickup/task')) {
          return next();
        }

        res.setHeader('Content-Type', 'application/json');

        const parsedUrl = new URL(req.url, 'http://localhost');
        const rawTaskId = parsedUrl.searchParams.get('taskId');

        if (!rawTaskId) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              code: 'TASK_NOT_FOUND',
              message: 'ClickUp task not found. Please check the Task ID.',
            })
          );
          return;
        }

        const trimmed = String(rawTaskId).trim();
        const urlMatch = trimmed.match(/\/t\/(?:[0-9]+\/)?([a-zA-Z0-9]+)/);
        const cleanTaskId =
          urlMatch && urlMatch[1] ? urlMatch[1] : trimmed.replace(/^#/, '').split(/[?#]/)[0].trim();

        if (!cleanTaskId) {
          res.statusCode = 400;
          res.end(
            JSON.stringify({
              code: 'TASK_NOT_FOUND',
              message: 'ClickUp task not found. Please check the Task ID.',
            })
          );
          return;
        }

        // Re-read env dynamically on each dev request in case user just filled in .env
        const env = loadEnv('development', process.cwd(), '');
        const token = env.CLICKUP_API_TOKEN || process.env.CLICKUP_API_TOKEN;

        if (!token) {
          res.statusCode = 401;
          res.end(
            JSON.stringify({
              code: 'AUTH_FAILED',
              message: 'ClickUp authentication failed. Please check the server configuration.',
            })
          );
          return;
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
              res.statusCode = 401;
              res.end(
                JSON.stringify({
                  code: 'AUTH_FAILED',
                  message: 'ClickUp authentication failed. Please check the server configuration.',
                })
              );
              return;
            }
            if (clickupRes.status === 403) {
              res.statusCode = 403;
              res.end(
                JSON.stringify({
                  code: 'FORBIDDEN',
                  message: "You don't have permission to access this ClickUp task.",
                })
              );
              return;
            }
            if (clickupRes.status === 404) {
              res.statusCode = 404;
              res.end(
                JSON.stringify({
                  code: 'TASK_NOT_FOUND',
                  message: 'ClickUp task not found. Please check the Task ID.',
                })
              );
              return;
            }
            if (clickupRes.status === 429) {
              res.statusCode = 429;
              res.end(
                JSON.stringify({
                  code: 'RATE_LIMITED',
                  message: 'ClickUp API rate limit reached. Please try again later.',
                })
              );
              return;
            }

            res.statusCode = clickupRes.status;
            res.end(
              JSON.stringify({
                code: 'UNKNOWN',
                message: 'Unable to connect to ClickUp. Please try again.',
              })
            );
            return;
          }

          const data = await clickupRes.json();
          res.statusCode = 200;
          res.end(JSON.stringify(data));
        } catch {
          res.statusCode = 500;
          res.end(
            JSON.stringify({
              code: 'NETWORK_ERROR',
              message: 'Unable to connect to ClickUp. Please try again.',
            })
          );
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    clickupApiDevPlugin(),
  ],
});
