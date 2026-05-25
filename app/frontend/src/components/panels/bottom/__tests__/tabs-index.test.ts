import { describe, expect, it } from 'vitest';
import * as tabsIndex from '../tabs';

describe('tabs/index exports', () => {
  it('exports OutputTab', () => {
    expect(tabsIndex.OutputTab).toBeDefined();
    expect(typeof tabsIndex.OutputTab).toBe('function');
  });

  it('exports PortfolioDashboardTab', () => {
    expect(tabsIndex.PortfolioDashboardTab).toBeDefined();
    expect(typeof tabsIndex.PortfolioDashboardTab).toBe('function');
  });

  it('exports DebugConsoleTab', () => {
    expect(tabsIndex.DebugConsoleTab).toBeDefined();
    expect(typeof tabsIndex.DebugConsoleTab).toBe('function');
  });

  it('exports ProblemsTab', () => {
    expect(tabsIndex.ProblemsTab).toBeDefined();
    expect(typeof tabsIndex.ProblemsTab).toBe('function');
  });

  it('exports TerminalTab', () => {
    expect(tabsIndex.TerminalTab).toBeDefined();
    expect(typeof tabsIndex.TerminalTab).toBe('function');
  });
});
