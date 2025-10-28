import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ToolCard from '@/components/home/tool-card';
import enContent from '../../content/en.json';
import { TOOL_SUMMARIZER_SLUG } from '@/lib/tools/config';

const copy = enContent.tool;

describe('ToolCard', () => {
  const originalFetch = global.fetch;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    global.fetch = fetchMock as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    global.fetch = originalFetch;
  });

  it('renders success state after mock generation', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ summary: 'Mock summary response' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    render(<ToolCard copy={copy} slug={TOOL_SUMMARIZER_SLUG} locale="en" />);

    const textarea = screen.getByLabelText(copy.inputLabel);
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });

    fireEvent.click(screen.getByText(copy.generate));

    expect(screen.getAllByText(copy.loading).length).toBeGreaterThan(0);
    const [requestUrl, requestInit] = fetchMock.mock.calls[0] ?? [];
    expect(requestUrl).toBe(`/api/tools/${TOOL_SUMMARIZER_SLUG}`);
    const parsedBody = JSON.parse((requestInit?.body as string) ?? '{}');
    expect(parsedBody).toMatchObject({ prompt: 'Test prompt', length: 3, locale: 'en' });

    await waitFor(
      () => {
        expect(screen.getByText(copy.successTitle)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(screen.getByText('Mock summary response')).toBeInTheDocument();
  });

  it('renders error state when keyword is trigger-error', async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ message: 'Provider error' }),
        {
          status: 502,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    render(<ToolCard copy={copy} slug={TOOL_SUMMARIZER_SLUG} locale="en" />);

    const textarea = screen.getByLabelText(copy.inputLabel);
    fireEvent.change(textarea, { target: { value: 'trigger-error' } });

    fireEvent.click(screen.getByText(copy.generate));

    expect(screen.getAllByText(copy.loading).length).toBeGreaterThan(0);
    const [, errorInit] = fetchMock.mock.calls[0] ?? [];
    const errorBody = JSON.parse((errorInit?.body as string) ?? '{}');
    expect(errorBody).toMatchObject({ prompt: 'trigger-error', length: 3, locale: 'en' });

    await waitFor(
      () => {
        expect(screen.getByText(copy.errorTitle)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );

    expect(screen.getByText('Provider error')).toBeInTheDocument();
  });
});
