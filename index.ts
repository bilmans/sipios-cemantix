import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function handler(_req: Request): Promise<Response> {
  return new Response(similarity(extractGuess(_req)));
}

const similarity = async (word1: string) => {
  const body = {
  sim1: word1,
  sim2: "chien",
  lang: "fr",
  type: "General Word2Vec",
};
const similarityResponse = await fetch(
  "http://nlp.polytechnique.fr/similarityscore",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  }
);
const similarityResponseJson = await similarityResponse.json();
return Number(similarityResponseJson.simscore);
}

const extractGuess = (_req: Request ) => (_req.body[0] as string)

serve(handler);