import { describe, it, expect, beforeEach, vi } from 'vitest';

const { runEndOfWeekPromoReminder, httpHandler } = vi.hoisted(() => ({
  runEndOfWeekPromoReminder: vi.fn(async (): Promise<void> => {}),
  httpHandler: vi.fn(async () => ({ statusCode: 200 })),
}));

vi.mock('./scheduled/endOfWeek.js', () => ({
  runEndOfWeekPromoReminder,
}));

vi.mock('./index.js', () => ({ app: {} }));

vi.mock('serverless-http', () => ({
  default: () => httpHandler,
}));

const { handler } = await import('./lambda.js');

describe('lambda handler dispatch', () => {
  beforeEach(() => {
    runEndOfWeekPromoReminder.mockClear();
    httpHandler.mockClear();
  });

  it('routes a scheduled event to the promo reminder task', async () => {
    const result = await handler({ task: 'end-of-week-promo' }, {} as any, () => {});

    expect(runEndOfWeekPromoReminder).toHaveBeenCalledTimes(1);
    expect(httpHandler).not.toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  it('routes a Function URL (HTTP) event to the Express handler', async () => {
    const event = { requestContext: { http: { method: 'POST' } } };
    await handler(event, {} as any, () => {});

    expect(httpHandler).toHaveBeenCalledTimes(1);
    expect(runEndOfWeekPromoReminder).not.toHaveBeenCalled();
  });
});
