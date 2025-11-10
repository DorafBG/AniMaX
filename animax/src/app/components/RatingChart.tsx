"use client";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

type RatingData = {
  note: number;
  count: number;
};

export default function RatingChart({ data }: { data: RatingData[] }) {
  return (
    <div className="bg-purple-950 p-2 rounded-md shadow-md mb-8">
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data}>
          <XAxis dataKey="note" stroke="#bbb" />
          <YAxis stroke="#bbb" />
          <Bar dataKey="count" fill="#a855f7" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
