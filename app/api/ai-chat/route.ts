import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI chat is not configured.' },
      { status: 503 }
    );
  }

  const { message } = await request.json();

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = client.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 1024,
          system: `You are a helpful assistant for HUBSS, a pavement marking company.
Help customers with questions about:
- Pavement marking services
- StreetPrint decorative surfaces
- Parking lot striping
- Safety solutions
Be professional, friendly, and knowledgeable about pavement marking.`,
          messages: [{ role: 'user', content: message }],
        });

        for await (const chunk of aiStream) {
          if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
            const data = JSON.stringify({ type: 'text', content: chunk.delta.text });
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        }

        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
