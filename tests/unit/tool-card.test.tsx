import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ToolCard from '@/components/home/tool-card';
import enContent from '../../content/en.json';

const copy = enContent.tool;

describe('ToolCard', () => {
  it('renders success state after mock generation', async () => {
    render(<ToolCard copy={copy} />);

    const textarea = screen.getByLabelText(copy.inputLabel);
    fireEvent.change(textarea, { target: { value: 'Test prompt' } });

    fireEvent.click(screen.getByText(copy.generate));

    expect(screen.getByText(copy.loading)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(/Success:/)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });

  it('renders error state when keyword is trigger-error', async () => {
    render(<ToolCard copy={copy} />);

    const textarea = screen.getByLabelText(copy.inputLabel);
    fireEvent.change(textarea, { target: { value: 'trigger-error' } });

    fireEvent.click(screen.getByText(copy.generate));

    expect(screen.getByText(copy.loading)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByText(copy.mockError)).toBeInTheDocument();
      },
      { timeout: 2000 },
    );
  });
});
