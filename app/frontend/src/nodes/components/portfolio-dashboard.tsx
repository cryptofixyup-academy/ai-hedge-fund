import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ArrowDown, ArrowUp, DollarSign, PercentIcon, TrendingUp, Wallet } from 'lucide-react';

export interface PortfolioOverviewData {
  portfolio_overview: {
    account_value: number;
    annual_return_percent: number;
    buying_power: number;
    cash: number;
  };
  holdings: Record<string, {
    value: number;
    pending_sell_qty?: number;
    pending_buy_qty?: number;
  }>;
  trade_adjustments: Record<string, {
    action: 'buy' | 'sell';
    qty: number;
    reason: string;
  }>;
  top_stocks_to_buy: Record<string, {
    name: string;
    price: number;
    shares_to_buy: number;
  }>;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
}

function SummaryCard({
  title,
  value,
  icon: Icon,
  valueClass,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  valueClass?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className={`text-2xl font-bold ${valueClass ?? ''}`}>{value}</div>
      </CardContent>
    </Card>
  );
}

export function PortfolioDashboard({ data }: { data: PortfolioOverviewData }) {
  const { portfolio_overview, holdings, trade_adjustments, top_stocks_to_buy } = data;

  const annualReturnPositive = portfolio_overview.annual_return_percent >= 0;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Portfolio Overview</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <SummaryCard
            title="Account Value"
            value={formatCurrency(portfolio_overview.account_value)}
            icon={DollarSign}
          />
          <SummaryCard
            title="Annual Return"
            value={`${annualReturnPositive ? '+' : ''}${portfolio_overview.annual_return_percent.toFixed(2)}%`}
            icon={PercentIcon}
            valueClass={annualReturnPositive ? 'text-green-500' : 'text-red-500'}
          />
          <SummaryCard
            title="Buying Power"
            value={formatCurrency(portfolio_overview.buying_power)}
            icon={TrendingUp}
          />
          <SummaryCard
            title="Cash"
            value={formatCurrency(portfolio_overview.cash)}
            icon={Wallet}
          />
        </div>
      </section>

      {/* Holdings */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Current Holdings</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead className="text-right">Value</TableHead>
                  <TableHead>Pending Orders</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(holdings)
                  .sort(([, a], [, b]) => b.value - a.value)
                  .map(([ticker, holding]) => (
                    <TableRow key={ticker}>
                      <TableCell className="font-semibold">{ticker}</TableCell>
                      <TableCell className="text-right">{formatCurrency(holding.value)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {holding.pending_sell_qty != null && (
                            <Badge variant="destructive" className="flex items-center gap-1">
                              <ArrowDown className="h-3 w-3" />
                              Sell {holding.pending_sell_qty}
                            </Badge>
                          )}
                          {holding.pending_buy_qty != null && (
                            <Badge variant="success" className="flex items-center gap-1">
                              <ArrowUp className="h-3 w-3" />
                              Buy {holding.pending_buy_qty}
                            </Badge>
                          )}
                          {holding.pending_sell_qty == null && holding.pending_buy_qty == null && (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Trade Adjustments */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Recommended Trade Adjustments</h2>
        <Card>
          <CardContent className="p-0">
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
                {Object.entries(trade_adjustments).map(([ticker, adj]) => (
                  <TableRow key={ticker}>
                    <TableCell className="font-semibold">{ticker}</TableCell>
                    <TableCell>
                      <Badge
                        variant={adj.action === 'buy' ? 'success' : 'destructive'}
                        className="flex items-center gap-1 w-fit"
                      >
                        {adj.action === 'buy' ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : (
                          <ArrowDown className="h-3 w-3" />
                        )}
                        {adj.action.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{adj.qty.toLocaleString()}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs">{adj.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* Top Stocks to Buy */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Top Stocks to Buy</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Shares</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(top_stocks_to_buy).map(([ticker, stock]) => (
                  <TableRow key={ticker}>
                    <TableCell className="font-semibold">{ticker}</TableCell>
                    <TableCell className="text-muted-foreground">{stock.name}</TableCell>
                    <TableCell className="text-right">{formatCurrency(stock.price)}</TableCell>
                    <TableCell className="text-right">{stock.shares_to_buy.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(stock.price * stock.shares_to_buy)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
