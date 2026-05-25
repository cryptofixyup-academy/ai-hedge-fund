import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { BottomPanel } from '../bottom-panel';

// Mock context hooks
const mockSetBottomPanelTab = vi.fn();
let mockCurrentBottomTab = 'output';

vi.mock('@/contexts/layout-context', () => ({
  useLayoutContext: () => ({
    currentBottomTab: mockCurrentBottomTab,
    setBottomPanelTab: mockSetBottomPanelTab,
  }),
}));

vi.mock('@/hooks/use-resizable', () => ({
  useResizable: () => ({
    height: 300,
    isDragging: false,
    elementRef: { current: null },
    startResize: vi.fn(),
  }),
}));

// Mock child tab components to avoid deep context chains
vi.mock('../tabs', () => ({
  OutputTab: () => <div data-testid="output-tab-content">Output content</div>,
  PortfolioDashboardTab: () => <div data-testid="portfolio-tab-content">Portfolio content</div>,
}));

const defaultProps = {
  isCollapsed: false,
  onCollapse: vi.fn(),
  onExpand: vi.fn(),
  onToggleCollapse: vi.fn(),
};

describe('BottomPanel', () => {
  it('renders both Output and Portfolio tab triggers', () => {
    render(<BottomPanel {...defaultProps} />);
    expect(screen.getByText('Output')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  it('renders nothing when collapsed', () => {
    const { container } = render(<BottomPanel {...defaultProps} isCollapsed={true} />);
    expect(container.firstChild).toBeNull();
  });

  it('shows Output tab content when active tab is output', () => {
    mockCurrentBottomTab = 'output';
    render(<BottomPanel {...defaultProps} />);
    expect(screen.getByTestId('output-tab-content')).toBeInTheDocument();
  });

  it('shows Portfolio tab content when active tab is portfolio', () => {
    mockCurrentBottomTab = 'portfolio';
    render(<BottomPanel {...defaultProps} />);
    expect(screen.getByTestId('portfolio-tab-content')).toBeInTheDocument();
  });

  it('calls setBottomPanelTab with "portfolio" when Portfolio tab is clicked', async () => {
    mockCurrentBottomTab = 'output';
    const user = userEvent.setup();
    render(<BottomPanel {...defaultProps} />);
    await user.click(screen.getByText('Portfolio'));
    expect(mockSetBottomPanelTab).toHaveBeenCalledWith('portfolio');
  });

  it('calls onToggleCollapse when close button is clicked', async () => {
    const onToggleCollapse = vi.fn();
    const user = userEvent.setup();
    render(<BottomPanel {...defaultProps} onToggleCollapse={onToggleCollapse} />);
    await user.click(screen.getByLabelText('Close panel'));
    expect(onToggleCollapse).toHaveBeenCalled();
  });
});
