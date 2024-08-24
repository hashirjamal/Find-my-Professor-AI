import { HfInference } from '@huggingface/inference'

import { NextResponse } from "next/server";
import { Pinecone } from '@pinecone-database/pinecone'

export async function POST(req){

    const systemPrompt = `
    You are a rate my professor agent to help students find classes, that takes in user questions and answers them.
    For every user question, the top 3 professors that match the user question are returned.
    Use them to answer the question if needed.
    `
    try{

        const pc = new Pinecone({ apiKey: process.env.PC_KEY })
        const index = pc.index("professor-rag")

        const hf = new HfInference(process.env.HF_KEY);

        const body = await req.json();

        const {userMessage} = body;

        const res = await hf.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs: userMessage,
          });
        
        const similarSearch = await index.namespace("ns-1").query(
            {
                vector:res,
                topK:3,
                includeMetadata:true,
            }
        )

        let prompt = ""

        similarSearch.matches.forEach(p=>{
            let data = p.metadata;

            prompt+=`Question: ${userMessage} 
            Returned Results:
  Professor: ${p.id}
  Review: ${data.stars}
  Subject: ${data.subject}
  Stars: ${data.stars}
  \n\n
            `

        })

        // console.log(similarSearch);

       const llmRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${process.env.OPEN_ROUTER_KEY}`,
             
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              "model": "meta-llama/llama-3.1-8b-instruct:free",
              "messages": [
                {"role": "user", "content": prompt},
                {"role": "system", "content": systemPrompt},
              ],
            })
          });


          let jsonRes = await llmRes.json();

        console.log(jsonRes.choices[0].message)

        return NextResponse.json(jsonRes);
    }
    catch(e){
        

    }





}