import serverless from 'serverless-http';
import type { Handler } from 'aws-lambda';
import { app } from './index.js';
import { runEndOfWeekPromoReminder } from './scheduled/endOfWeek.js';

const httpHandler = serverless(app);

export const handler: Handler = async (event: any, context: any) => {
  const isScheduled =
    event?.task === 'end-of-week-promo' ||
    (event && typeof event === 'object' && !('requestContext' in event));
  if (isScheduled) {
    await runEndOfWeekPromoReminder();
    return { ok: true };
  }
  return httpHandler(event, context);
};
