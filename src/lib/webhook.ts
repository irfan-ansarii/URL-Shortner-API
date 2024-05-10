import { findWebhooks, updateWebhook } from "../services/webhooks";

/**
 * send request
 * @param url
 * @param options
 * @returns
 */
const sendRequest = async (url: string, options: RequestInit) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      return undefined;
    }
    return { success: true };
  } catch (error) {
    return undefined;
  }
};

/**
 * test webhook url
 * @param url
 * @returns
 */
export const testWebhookURL = async (url: string) => {
  const options: RequestInit = {
    method: "POST",
    headers: {
      "x-api-key": "shiprocket-secrect-key",
    },
    body: JSON.stringify({
      test: true,
    }),
  };

  return sendRequest(url, options);
};

/**
 * send webhook event
 * @param event
 * @param user
 * @param data
 * @returns
 */
export const sendWebhookEvent = async (
  event: string,
  user: { id: number },
  data: object
) => {
  const webhooks = await findWebhooks({ userId: user.id });

  if (!webhooks || webhooks.length === 0) return;

  await Promise.all(
    webhooks.map(async (webhook) => {
      const { url, secret, events } = webhook;

      if (!events.includes(event)) return;

      const options: RequestInit = {
        method: "POST",
        headers: {
          "x-api-key": secret,
          "Content-Type": "application/json",
        },
        body: typeof data === "object" ? JSON.stringify(data) : "{}",
      };

      await sendRequest(url, options);

      await updateWebhook(webhook.id, {
        lastActiveAt: new Date(),
      });
    })
  );
};
