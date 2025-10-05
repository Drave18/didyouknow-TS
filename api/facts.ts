import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/supabase'
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // When a web browser needs to make a cross-origin request that isn't a "simple"
  //  request (like POST with JSON data), it first sends an OPTIONS request to check
  //  if the actual request is allowed. This is called a "preflight" request.
  if (req.method == "OPTIONS") {
    return res.status(200).end
  }
    const supabaseUrl = process.env.VITE_SUPABASE_URL as string
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY as string

    const supabase = createClient<Database>(supabaseUrl, supabaseKey)
    //Internal server error=>500, 405=>method not allowed, 200=>Ok
    if(req.method=='GET'){
        try{
            const {data, error} = await supabase
            .from('facts')
            .select('*')
            .order('created_at', {ascending:false})
            if(error){
                return res.status(500).json({error:error.message})
            }
            return res.status(200).json(data)
        }
        catch(error){
            return res.status(500).json({error:'Failed to fetch'})
        }
    }
    return res.status(405).json({message:'Method not allowed'})
}
