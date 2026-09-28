import { fail } from './validation.js';
export function createOllama(config) {
  return async function* chat(messages, { format, signal } = {}) {
    let response;
    try {
      response = await fetch(`${config.ollamaUrl}/api/chat`, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: config.ollamaModel, messages, stream: true, ...(format ? { format } : {}) }),
        signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(180000)]) : AbortSignal.timeout(180000) });
    } catch { throw fail(502, 'Cannot connect to Ollama or request timed out'); }
    if (!response.ok || !response.body) throw fail(502, 'Ollama request failed');
    let buffer = ''; let completed = false;
    for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
      buffer += chunk;
      let index;
      while ((index = buffer.indexOf('\n')) >= 0) {
        const line = buffer.slice(0, index); buffer = buffer.slice(index + 1);
        if (!line.trim()) continue;
        const item = JSON.parse(line);
        if (item.error) throw fail(502, 'Ollama generation failed');
        if (item.message?.content) yield item.message.content;
        if (item.done) completed = true;
      }
    }
    if (buffer.trim()) {
      const item = JSON.parse(buffer);
      if (item.error) throw fail(502, 'Ollama generation failed');
      if (item.message?.content) yield item.message.content;
      completed ||= item.done === true;
    }
    if (!completed) throw fail(502, 'Ollama returned an incomplete response');
  };
}
