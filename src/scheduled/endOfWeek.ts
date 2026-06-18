import { PROMO_MEDAL_CHANNEL_ID } from '../config.js';
import { postChannelMessage } from '../util/discord.js';

export const END_OF_WEEK_MESSAGE = [
  '-- End of Week --'
].join('\n');

export async function runEndOfWeekPromoReminder(): Promise<void> {
  await postChannelMessage(PROMO_MEDAL_CHANNEL_ID, END_OF_WEEK_MESSAGE);
}
