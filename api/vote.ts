import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/supabase'
import type { VercelRequest, VercelResponse } from "@vercel/node";



export default async function handler(req:VercelRequest, res:VercelResponse) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Create Supabase client using correct env variable names
    const supabaseUrl = process.env.VITE_SUPABASE_URL as string
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY as string

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    try {
        const { id, type, currentVotes } = req.body;

        // Validation
        if (!id || !type || currentVotes === undefined) {
            return res.status(400).json({ error: 'Missing required fields: id, type, currentVotes' });
        }

        if (!['positive', 'negative'].includes(type)) {
            return res.status(400).json({ error: 'Invalid vote type. Must be "positive" or "negative"' });
        }

        // Prepare update data
        let updateData = {};
        if (type === 'positive') {
            updateData = { votes_positive: currentVotes + 1 };
        } else {
            updateData = { votes_negative: currentVotes + 1 };
        }

        const { data, error } = await supabase
            .from('facts')
            .update(updateData)
            .eq('id', id)
            .select();

        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({
            message: 'Vote updated successfully',
            data: data[0]
        });

    } catch (error) {
        return res.status(500).json({ error: 'Failed to update vote' });
    }
}