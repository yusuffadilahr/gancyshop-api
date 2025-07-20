import { config } from "dotenv";
import OpenAI from "openai";

config()

const apiKeyOpenAi = process.env.OPEN_AI_SECRET_KEYS || ''
if (!apiKeyOpenAi) throw new Error("OpenAI API Key is missing. Please check your .env file.")
    
export const openAiHandler = new OpenAI({
    apiKey: apiKeyOpenAi
})