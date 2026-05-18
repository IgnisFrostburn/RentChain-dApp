import cron from 'node-cron';
import { supabase } from './supabase';

const apiKey = process.env.NEXT_PUBLIC_BLOCKFROST_PROJECT_ID;

export function startTransactionCheckCron() {
    cron.schedule('*/10 * * * * *', async () => {
        console.log('Running transaction check...');

        try {
            const { data: transactions, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('status', 'pending')
                .order('created_at', { ascending: true })
                .limit(50);

            if (error) throw error;

            for (const tx of transactions || []) {
                try {
                    const response = await fetch(
                        `https://cardano-preview.blockfrost.io/api/v0/txs/${tx.tx_hash}`,
                        {
                            headers: {
                                'project_id': apiKey!
                            }
                        }
                    );

                    if (response.ok) {
                        await supabase
                            .from('transactions')
                            .update({
                                status: 'confirmed',
                                updated_at: new Date()
                            })
                            .eq('tx_hash', tx.tx_hash);

                        console.log(`Transaction ${tx.tx_hash} confirmed`);
                    }
                } catch (err) {
                    console.error(`Error checking transaction ${tx.tx_hash}:`, err);
                }
            }
        } catch (error) {
            console.error('Cron job error:', error);
        }
    });

    console.log('Transaction check cron started (every 10 seconds)');
}