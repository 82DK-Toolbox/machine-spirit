import { PROMO_MEDAL_CHANNEL_ID } from './config.js';
import { postChannelMessage } from './util/discord.js';
import { currentWeekLabel } from './util/time.js';

async function postWeeklyPromotionCutoff(): Promise<void> {
  const weekLabel = currentWeekLabel();
  await postChannelMessage(PROMO_MEDAL_CHANNEL_ID, {
    embeds: [
      {
        title: `Weekly Promotion Cutoff — Week of ${weekLabel}`,
        description:
          'A new week has begun. Submissions from the previous week are now cut off — post promotion and medal suggestions for the new week below.',
        color: 0x5865f2,
      },
    ],
  });
}

export async function handleScheduledEvent(action: string): Promise<void> {
  switch (action) {
    case 'weekly_promotion_cutoff':
      await postWeeklyPromotionCutoff();
      return;
    default:
      console.warn('unknown scheduled action', { action });
  }
}
