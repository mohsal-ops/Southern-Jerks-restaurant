"use client";

import {  formatNumber } from "@/lib/formatters";
import {

  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

type UsersByDayChartProp = {
  data: {
    date: string;
    totalUsers: number;
  }[];
};
export default function UserssByDayChart({ data }: UsersByDayChartProp) {
  return (
    <ResponsiveContainer width="100%" minHeight={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="hsl(var(--muted))" />
        <XAxis stroke="hsl(var(--primary))" dataKey="date" />
        <YAxis
          tickFormatter={(tick) => formatNumber(tick)}
          stroke="hsl(var(--primary))"
        />
        <Tooltip cursor={{fill :"hsl(var(--muted))"}} formatter={(value) => formatNumber(value as number)} />
        <Bar
          name="New users"
          dataKey="totalUsers"
          stroke="hsl(var(--primary))"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}


