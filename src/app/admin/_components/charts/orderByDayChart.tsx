"use client";
import { formatCurrency } from "@/lib/formatters";


import dynamic from 'next/dynamic';
import { CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const LineChart = dynamic(() => import('recharts').then(mod => mod.LineChart), {
  ssr: false,
});

type OrderByDayChartProp = {
  data: {
    date: string;
    totalSales: number;
  }[];
};
export default function OrdersByDayChart({ data }: OrderByDayChartProp) {
  return (
    <ResponsiveContainer width="100%" minHeight={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="hsl(var(--muted))" />
        <XAxis stroke="hsl(var(--primary))" dataKey="date" />
        <YAxis
          tickFormatter={(tick) => formatCurrency(tick)}
          stroke="hsl(var(--primary))"
        />
        <Tooltip formatter={(value) => formatCurrency(value as number)} />
        <Line
          type="monotone"
          dot={false}        
          name="Total sales"
          dataKey="totalSales"
          stroke="hsl(var(--primary))"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}


