"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function PerkembanganSkor() {
  const data = [
    { month: "Okt", score: 580 },
    { month: "Nov", score: 610 },
    { month: "Des", score: 630 },
    { month: "Jan", score: 650 },
  ];

  return (
    <div className="rounded-[16px] border border-gray-200 p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold text-black">
          Perkembangan Skor
        </h2>
        <p className="text-[14px] text-[#717182]">
          Riwayat skor kredit 4 bulan terakhir
        </p>
      </div>

      {/* Chart */}
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#E5E7EB"
              vertical={true}
              horizontal={true}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#717182", fontSize: 14 }}
              dy={10}
            />
            <YAxis
              domain={[500, 700]}
              ticks={[500, 550, 600, 650, 700]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#717182", fontSize: 14 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                fontSize: "14px",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#4F7EF7"
              strokeWidth={3}
              dot={{ fill: "#4F7EF7", r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Info Box */}
      <div className="bg-[#E8F5E9] rounded-[12px] p-4 flex items-start gap-3">
        <TrendingUp className="w-5 h-5 text-[#00A63E] flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[14px] font-semibold text-black">
            Skor meningkat +70 poin
          </p>
          <p className="text-[14px] text-[#2E7D32]">
            dalam 4 bulan terakhir. Pertahankan konsistensi pembayaran Anda!
          </p>
        </div>
      </div>
    </div>
  );
}
