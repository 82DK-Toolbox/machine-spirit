import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PROMO_MEDAL_CHANNEL_ID } from '../config.js';

const { postChannelMessage } = vi.hoisted(() => ({
  postChannelMessage: vi.fn(async (): Promise<void> => {}),
}));

vi.mock('../util/discord.js', () => ({
  postChannelMessage,
}));

const { runEndOfWeekPromoReminder, END_OF_WEEK_MESSAGE } = await import(
  './endOfWeek.js'
);

describe('runEndOfWeekPromoReminder', () => {
  beforeEach(() => {
    postChannelMessage.mockClear();
  });

  it('posts the end-of-week message to the promo channel', async () => {
    await runEndOfWeekPromoReminder();

    expect(postChannelMessage).toHaveBeenCalledTimes(1);
    expect(postChannelMessage).toHaveBeenCalledWith(
      PROMO_MEDAL_CHANNEL_ID,
      END_OF_WEEK_MESSAGE,
    );
    expect(END_OF_WEEK_MESSAGE).toContain('-- End of Week --');
  });
});
