import { OpenAIStream } from "ai"; // Assuming this is a custom module providing stream utilities
import type OpenAI from "openai"; // Importing type for OpenAI
import zodToJsonSchema from "zod-to-json-schema"; // Importing a utility for converting Zod schemas to JSON schemas

const consumeStream = async (stream: ReadableStream) => {
  const reader = stream.getReader();
  while (true) {
    const { done } = await reader.read();
    if (done) break;
  }
};

export function runOpenAICompletion(
  openai: OpenAI, // Parameter openai with type OpenAI
  params: {
    functions: any[]; // Assuming functions is an array of any type
  } & Omit<
    Parameters<typeof OpenAI.prototype.chat.completions.create>[0],
    "functions"
  >
) {
  let text = "";
  let hasFunction = false;
  let onTextContent: (text: string, isFinal: boolean) => void = () => {};
  let onFunctionCall: Record<string, any> = {}; // Defining onFunctionCall as a record of string keys and any values

  (async () => {
    consumeStream(
      OpenAIStream(
        (await openai.chat.completions.create({
          ...params,
          stream: true,
          functions: params.functions.map((fn) => ({
            name: fn.name,
            description: fn.description,
            parameters: zodToJsonSchema(fn.parameters) as Record<
              string,
              unknown
            >,
          })),
        })) as any,
        {
          async experimental_onFunctionCall(functionCallPayload) {
            hasFunction = true;

            if (!onFunctionCall[functionCallPayload.name]) {
              return;
            }

            const zodSchema = params.functions.find(
              (fn) => fn.name === functionCallPayload.name
            )?.parameters;

            if (!zodSchema) {
              throw new Error(
                `No schema found for function: ${functionCallPayload.name}`
              );
            }

            const parsedArgs = zodSchema.safeParse(
              functionCallPayload.arguments
            );

            if (!parsedArgs.success) {
              throw new Error(
                `Invalid function call arguments for function: ${functionCallPayload.name}`
              );
            }

            onFunctionCall[functionCallPayload.name](parsedArgs.data);
          },
          onToken(token) {
            text += token;
            if (text.startsWith("{")) return;
            onTextContent(text, false);
          },
          onFinal() {
            if (hasFunction) return;
            onTextContent(text, true);
          },
        }
      )
    );
  })();

  return {
    onTextContent: (
      callback: (text: string, isFinal: boolean) => void | Promise<void>
    ) => {
      onTextContent = callback;
    },
    onFunctionCall: <TName extends string>(
      name: TName,
      callback: (args: any) => void | Promise<void>
    ) => {
      onFunctionCall[name] = callback;
    },
  };
}
