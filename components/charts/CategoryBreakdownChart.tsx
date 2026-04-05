"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { formatCurrencyShort, formatCurrency } from "@/lib/utils";
import { CATEGORY_COLORS } from "@/lib/data";
import { cn } from "@/lib/utils";

interface CategoryChartProps {
  data: { name: string; value: number }[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div className="bg-card border border-border rounded-xl p-3 shadow-xl text-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.payload.fill }} />
        <span className="font-semibold text-foreground">{d.name}</span>
      </div>
      <p className="text-muted-foreground">{formatCurrency(d.value)}</p>
    </div>
  );
}

export function CategoryBreakdownChart({ data }: CategoryChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const top5 = data.slice(0, 6);

  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-in">
      <div className="mb-5">
        <h3 className="font-semibold text-foreground">Spending Breakdown</h3>
        <p className="text-xs text-muted-foreground mt-0.5">By category</p>
      </div>
      {data.length === 0 ? (
        <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">
          No expense data
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <div className="relative flex-shrink-0">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={top5}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {top5.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] || "#6b7280"}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-sm font-bold text-foreground">{formatCurrencyShort(total)}</p>
            </div>
          </div>
          <div className="flex-1 space-y-2.5 min-w-0">
            {top5.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: CATEGORY_COLORS[item.name] || "#6b7280" }}
                />
                <span className="text-xs text-muted-foreground truncate flex-1">{item.name}</span>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-xs font-medium text-foreground">
                    {formatCurrencyShort(item.value)}
                  </span>
                  <span className="text-xs text-muted-foreground w-9">
                    {((item.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
