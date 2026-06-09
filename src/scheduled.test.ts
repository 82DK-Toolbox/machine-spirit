import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PROMO_MEDAL_CHANNEL_ID } from './config.js';

vi.mock('./util/discord.js', () => ({
  postChannelMessage: vi.fn(async (): Promise<void> => {}),
  fetchMembersWithRoles: vi.fn(async (): Promise<string[]> => []),
}));

vi.mock('./util/time.js', () => ({
  currentWeekLabel: vi.fn((): string => 'Jun 7'),
}));

const { handleScheduledEvent } = await import('./scheduled.js');
const { postChannelMessage } = await import('./util/discord.js');
const mockedPost = vi.mocked(postChannelMessage);

beforeEach(() => {
  mockedPost.mockClear();
});

describe('handleScheduledEvent', () => {
  it('posts weekly cutoff embed to promo channel', async () => {
    await handleScheduledEvent('weekly_promotion_cutoff');
    expect(mockedPost).toHaveBeenCalledTimes(1);
    const [channelId, body] = mockedPost.mock.calls[0]!;
    expect(channelId).toBe(PROMO_MEDAL_CHANNEL_ID);
    const embeds = (body as { embeds: Array<{ title: string }> }).embeds;
    expect(embeds).toHaveLength(1);
    expect(embeds[0]!.title).toContain('Weekly Promotion Cutoff');
    expect(embeds[0]!.title).toContain('Jun 7');
  });

  it('ignores unknown actions', async () => {
    await handleScheduledEvent('something_else');
    expect(mockedPost).not.toHaveBeenCalled();
  });
});
