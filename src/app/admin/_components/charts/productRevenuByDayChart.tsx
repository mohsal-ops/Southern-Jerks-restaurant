"use client";

import {  formatCurrency, formatNumber } from "@/lib/formatters";
import {

  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
} from "recharts";

type UsersByDayChartProp = {
  data: {
    name: string;
    revenue: number;
  }[];
};
export default function ProductRevenueByDayChart({ data }: UsersByDayChartProp) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <PieChart >
        
        <Tooltip cursor={{fill :"hsl(var(--muted))"}} formatter={(value) => formatCurrency(value as number)} />
        <Pie
          data={data}
          label={item => item.name}
          innerRadius={40}
          nameKey="New users"
          dataKey="revenue"
          fill="hsl(var(--primary))"
        />
      </PieChart>
    </ResponsiveContainer>
  );
}


