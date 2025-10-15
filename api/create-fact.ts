import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/supabase'
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req:VercelRequest, res:VercelResponse){
    res.setHeader(
        "Access-Control-Allow-Origin",
        "*"
    )
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (req.method =='OPTIONS'){
        return res.status(200).end()
    }
    if(req.method !=='POST'){
        return res.status(405).json({message:'Method not allowed'})
    }
    const supabaseUrl = process.env.VITE_SUPABASE_URL as string
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY as string

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)

    try{
        const {text, source, category} = req.body;
        if(!text || !source || !category){
            return res.status(400).json({error:"Missin required fields"})

        }
        const {data, error}= await supabase
            .from('facts')
            .insert([
                {
                    text,
                    source,
                    category: category.toLowerCase()
                }
            ])
            .select()
        if(error){
            return res.status(500).json({error:error.message})
        }
        return res.status(201).json(
            {
                message:'Fact created successfully',
                data:data[0]
            }
        )
    }
    catch(error){
        return res.status(500).json({error:'Failed to create fact'})
    }
}