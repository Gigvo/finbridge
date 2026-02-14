import React from "react";
import { TrendingUp } from "lucide-react";

export default function SkorKredit() {
  const currentScore = 650;
  const minScore = 300;
  const maxScore = 900;
  const progressPercentage =
    ((currentScore - minScore) / (maxScore - minScore)) * 100;

  return (
    <div className="rounded-[16px] border border-gray-200 p-6 bg-white">
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-[20px] font-semibold">Skor Kredit Anda</p>
          <p className="text-[14px] text-[#717182]">
            Diperbarui 5 menit yang lalu
          </p>
        </div>
        <TrendingUp className="w-6 h-6 text-[#00A63E]" />
      </div>
      <div className="flex flex-col items-center mb-6">
        <p className="text-[30px] text-[#99A1AF]">
          <span className="font-bold text-[60px] text-black">650</span>/900
        </p>
        <p className="text-[#155DFC] font-bold text-[16px]">
          Good • Layak Pembiayaan
        </p>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-[#4F7EF7] rounded-full transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex flex-row gap-4 justify-center">
        <div className="rounded-[10px] text-center bg-[#F9FAFB] p-4 min-w-[100px]">
          <p className="font-bold text-[24px]">300</p>
          <p className="text-xs text-[#717182]">Poor</p>
        </div>
        <div className="rounded-[10px] text-center bg-[#EFF6FF] border-2 border-[#4F7EF7] p-4 min-w-[100px]">
          <p className="font-bold text-[24px] text-[#4F7EF7]">650</p>
          <p className="text-xs text-[#4F7EF7]">Skor Anda</p>
        </div>
        <div className="rounded-[10px] text-center bg-[#F9FAFB] p-4 min-w-[100px]">
          <p className="font-bold text-[24px]">900</p>
          <p className="text-xs text-[#717182]">Excellent</p>
        </div>
      </div>
    </div>
  );
}
