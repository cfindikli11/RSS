import cron from 'node-cron';
import { fetchAllFeeds } from './rssService.js';
import config from '../config/config.js';

let scheduledJob = null;

export function startScheduledRefresh() {
    if (scheduledJob) {
        console.log('⚠️  Scheduled refresh already running');
        return;
    }

    // Run every 15 minutes
    scheduledJob = cron.schedule('*/15 * * * *', async () => {
        console.log('🔄 Scheduled feed refresh triggered');
        try {
            await fetchAllFeeds();
        } catch (error) {
            console.error('Error in scheduled refresh:', error);
        }
    });

    console.log('✅ Scheduled feed refresh started (every 15 minutes)');
}

export function stopScheduledRefresh() {
    if (scheduledJob) {
        scheduledJob.stop();
        scheduledJob = null;
        console.log('🛑 Scheduled feed refresh stopped');
    }
}

export default {
    startScheduledRefresh,
    stopScheduledRefresh,
};
