import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

async function handler(_req: Request): Promise<Response> {
  const guess = await extractGuess(_req)
  const number = await similarity(guess)
  const stringResponse = "The word " + guess + "has a score of" + number
  return new Response(JSON.stringify(stringResponse));
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

const extractGuess = async (req: Request) => {
  const slackPayload = await req.formData();
  const guess = await slackPayload.get("text")?.toString();
  if (!guess) {
    throw Error("Guess is empty or null");
  }
  return guess;
};
serve(handler);