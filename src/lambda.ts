import serverless from 'serverless-http';
import { app } from './index.js';
import { handleScheduledEvent } from './scheduled.js';

const httpHandler = serverless(app);

function isScheduledEvent(event: unknown): event is { action: string } {
  return (
    typeof event === 'object' &&
    event !== null &&
    'action' in event &&
    typeof (event as { action: unknown }).action === 'string'
  );
}

export const handler = async (
  event: Parameters<typeof httpHandler>[0],
  context: Parameters<typeof httpHandler>[1],
): Promise<unknown> => {
  if (isScheduledEvent(event)) {
    await handleScheduledEvent(event.action);
    return { ok: true };
  }
  return httpHandler(event, context);
};
