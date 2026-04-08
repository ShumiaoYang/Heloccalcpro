/**
 * AI response JSON parser with guardrails for common LLM formatting issues.
 */

function stripModelArtifacts(rawText: string): string {
  let text = rawText.trim();

  // Remove hidden reasoning blocks if present
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Remove fenced markdown wrapper
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  return text;
}

function escapeControlCharsInJsonStrings(input: string): string {
  let output = '';
  let inString = false;
  let isEscaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const code = ch.charCodeAt(0);

    if (!inString) {
      output += ch;
      if (ch === '"') {
        inString = true;
      }
      continue;
    }

    if (isEscaped) {
      output += ch;
      isEscaped = false;
      continue;
    }

    if (ch === '\\') {
      output += ch;
      isEscaped = true;
      continue;
    }

    if (ch === '"') {
      output += ch;
      inString = false;
      continue;
    }

    // Raw control characters are invalid inside JSON strings.
    if (code >= 0x00 && code <= 0x1f) {
      switch (ch) {
        case '\n':
          output += '\\n';
          break;
        case '\r':
          output += '\\r';
          break;
        case '\t':
          output += '\\t';
          break;
        case '\b':
          output += '\\b';
          break;
        case '\f':
          output += '\\f';
          break;
        default:
          output += `\\u${code.toString(16).padStart(4, '0')}`;
          break;
      }
      continue;
    }

    output += ch;
  }

  return output;
}

function extractTopLevelJsonObject(text: string): string {
  const firstBrace = text.indexOf('{');
  if (firstBrace < 0) {
    return text;
  }

  let depth = 0;
  let inString = false;
  let isEscaped = false;

  for (let i = firstBrace; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (ch === '\\') {
        isEscaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{') {
      depth += 1;
      continue;
    }

    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        return text.slice(firstBrace, i + 1).trim();
      }
    }
  }

  return text.trim();
}

export function parseAiJsonResponse(rawText: string): Record<string, any> {
  const cleaned = extractTopLevelJsonObject(stripModelArtifacts(rawText));

  try {
    return JSON.parse(cleaned);
  } catch (firstError) {
    const repaired = escapeControlCharsInJsonStrings(cleaned);
    try {
      return JSON.parse(repaired);
    } catch (secondError) {
      const firstMessage = firstError instanceof Error ? firstError.message : String(firstError);
      const secondMessage = secondError instanceof Error ? secondError.message : String(secondError);
      throw new Error(`Failed to parse AI response JSON: ${firstMessage} | repaired parse failed: ${secondMessage}`);
    }
  }
}

