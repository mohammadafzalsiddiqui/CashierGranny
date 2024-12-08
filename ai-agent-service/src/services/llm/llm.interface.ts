import { AIMessageResponse, FunctionCallResponse, QueryContext } from '../agent/agent.interfaces.js';

export interface LLMService {
  interpretUserQuery(query: string, context: QueryContext[]): Promise<AIMessageResponse>;
  generateFinalResponse(
    query: string,
    functionResponses: FunctionCallResponse[],
    context: QueryContext[]
  ): Promise<string>;
}

export interface LLMConfig {
  apiKey: string;
  model?: string;
}
