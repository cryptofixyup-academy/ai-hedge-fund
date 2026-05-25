import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFlowContext } from '@/contexts/flow-context';
import { useNodeContext } from '@/contexts/node-context';
import { cn } from '@/lib/utils';
import { ArrowDownCircle, ArrowUpCircle, BarChart3, DollarSign, Percent, ShoppingCart, TrendingUp, Wallet } from 'lucide-react';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value);
}

function MetricCard({ icon: Icon, label, value, sub, highlight }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  highlight?: 'positive' | 'negative' | 'neutral';
}) {
  const valueColor = highlight === 'positive' ? 'text-green-500' : highlight === 'negative' ? 'text-red-500' : 'text-primary';
  return (
    <Card className="bg-transparent flex-1 min-w-[140px]">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
        </div>
        <div className={cn("text-xl font-bold", valueColor)}>{value}</div>
        {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      </CardContent>
    </Card>
  );
}

function OverviewSection({ overview }: { overview: NonNullable<ReturnType<typeof useNodeContext>['outputNodeData']>['portfolio_overview'] }) {
  if (!overview) return null;
  const returnHighlight = overview.annual_return_percent >= 0 ? 'positive' : 'negative';
  return (
    <Card className="bg-transparent mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5" /> Account Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3">
          <MetricCard icon={DollarSign} label="Account Value" value={formatCurrency(overview.account_value)} />
          <MetricCard icon={Percent} label="Annual Return" value={`${overview.annual_return_percent.toFixed(2)}%`} highlight={returnHighlight} />
          <MetricCard icon={Wallet} label="Buying Power" value={formatCurrency(overview.buying_power)} />
          <MetricCard icon={DollarSign} label="Cash" value={formatCurrency(overview.cash)} />
        </div>
      </CardContent>
    </Card>
  );
}

function HoldingsSection({ holdings }: { holdings: NonNullable<ReturnType<typeof useNodeContext>['outputNodeData']>['holdings'] }) {
  if (!holdings || Object.keys(holdings).length === 0) return null;
  const sorted = Object.entries(holdings).sort(([, a], [, b]) => b.value - a.value);
  return (
    <Card className="bg-transparent mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" /> Holdings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-center">Pending</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(([ticker, holding]) => (
              <TableRow key={ticker}>
                <TableCell className="font-bold">{ticker}</TableCell>
                <TableCell className="text-right font-mono">{formatCurrency(holding.value)}</TableCell>
                <TableCell className="text-center">
                  {holding.pending_sell_qty && (
                    <span className="inline-flex items-center gap-1 text-red-500 text-xs font-medium">
                      <ArrowDownCircle className="h-3 w-3" /> Sell {holding.pending_sell_qty}
                    </span>
                  )}
                  {holding.pending_buy_qty && (
                    <span className="inline-flex items-center gap-1 text-green-500 text-xs font-medium">
                      <ArrowUpCircle className="h-3 w-3" /> Buy {holding.pending_buy_qty}
                    </span>
                  )}
                  {!holding.pending_sell_qty && !holding.pending_buy_qty && (
                    <span className="text-muted-foreground text-xs">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TradeAdjustmentsSection({ adjustments }: { adjustments: NonNullable<ReturnType<typeof useNodeContext>['outputNodeData']>['trade_adjustments'] }) {
  if (!adjustments || Object.keys(adjustments).length === 0) return null;
  return (
    <Card className="bg-transparent mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ArrowDownCircle className="h-5 w-5" /> Trade Adjustments
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ticker</TableHead>
              <TableHead>Action</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(adjustments).map(([ticker, adj]) => (
              <TableRow key={ticker}>
                <TableCell className="font-bold">{ticker}</TableCell>
                <TableCell>
                  <span className={cn(
                    "font-semibold uppercase text-xs px-2 py-0.5 rounded",
                    adj.action === 'buy' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                  )}>
                    {adj.action}
                  </span>
                </TableCell>
                <TableCell className="text-right font-mono">{adj.qty}</TableCell>
                <TableCell className="text-muted-foreground text-sm max-w-xs">{adj.reason}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function TopStocksSection({ stocks }: { stocks: NonNullable<ReturnType<typeof useNodeContext>['outputNodeData']>['top_stocks_to_buy'] }) {
  if (!stocks || Object.keys(stocks).length === 0) return null;
  return (
    <Card className="bg-transparent mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" /> Top Stocks to Buy
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {Object.entries(stocks).map(([ticker, stock]) => (
            <Card key={ticker} className="bg-muted/30 border-border">
              <CardContent className="p-3">
                <div className="font-bold text-base text-green-500">{ticker}</div>
                <div className="text-xs text-muted-foreground truncate mb-2">{stock.name}</div>
                <div className="text-sm font-mono font-semibold">{formatCurrency(stock.price)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {stock.shares_to_buy.toLocaleString()} shares
                </div>
                <div className="text-xs text-green-500/80 font-medium mt-0.5">
                  {formatCurrency(stock.price * stock.shares_to_buy)}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function PortfolioDashboardTab({ className }: { className?: string }) {
  const { currentFlowId } = useFlowContext();
  const { getOutputNodeDataForFlow } = useNodeContext();
  const outputData = getOutputNodeDataForFlow(currentFlowId?.toString() || null);

  const hasPortfolioData = outputData?.portfolio_overview || outputData?.holdings || outputData?.trade_adjustments || outputData?.top_stocks_to_buy;

  return (
    <div className={cn("h-full overflow-y-auto font-mono text-sm", className)}>
      {hasPortfolioData ? (
        <>
          <OverviewSection overview={outputData?.portfolio_overview} />
          <HoldingsSection holdings={outputData?.holdings} />
          <TradeAdjustmentsSection adjustments={outputData?.trade_adjustments} />
          <TopStocksSection stocks={outputData?.top_stocks_to_buy} />
        </>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No portfolio data available. Run an analysis to populate the dashboard.
        </div>
      )}
    </div>
  );
}
