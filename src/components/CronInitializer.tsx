'use client';

import { useEffect } from 'react';

export default function CronInitializer() {
    useEffect(() => {
        fetch('/api/init-cron').catch(err =>
            console.error('Failed to initialize cron:', err)
        );
    }, []);

    return null;
}
