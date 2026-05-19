'use client'

import { formatRelative } from "date-fns";
import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function TrafficSourceChart() {
  const [data, setData] = useState([]);
  const [totalActiveUsers, setTotalActiveUsers] = useState<number>(0)
  const [pending, setPending] = useState<boolean>(true)
  useEffect(() => {
      setPending(true)
        fetch("/api/analytics", {
            method: 'GET',
            headers: { "Content-Type": "application/json", },
            
    }).then((res) => res.json())
            .then((data) => {
          const totalActiveUsers = data.rows[0].metricValues[0].value
          const formattedData = data.rows.map((row: any) => ({
          name: row.dimensionValues[0].value,
          value: parseInt(row.metricValues[0].value),
          }));
        setTotalActiveUsers(totalActiveUsers)
              setData(formattedData);
              setPending(false)
      });
  }, []);



  return (<>
    {!pending ? (
      <>
    <ResponsiveContainer width="100%" minHeight={300}>
     <PieChart width={400} height={400}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={120}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
        </PieChart>
    </ResponsiveContainer>
      <p><span className="text-sm font-semibold text-accent-foreground">totalActiveUsers: </span>{totalActiveUsers}</p>
      </>
    
    
    ) : (
        <>
          <div className=" text-accent-foreground"> fetching data ...</div>
        </>
      
      )}
    </>
  );
}
