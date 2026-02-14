import React from "react";
import Image from "next/image";
import { Lightbulb, CircleCheckBig, CreditCard } from "lucide-react";

export default function RekomendasiCard() {
  return (
    <div className="rounded-[16px] border-1 border-gray-200 p-6">
      <p className="text-[16px]">Rekomendasi untuk Meningkatkan Skor</p>
      <p className="text-[16px] text-[#717182]">
        Tips yang dipersonalisasi untuk Anda
      </p>
      <div className="flex flex-col gap-4 pt-6">
        <div className="bg-[#EFF6FF] flex flex-row gap-3 p-4 rounded-[16px]">
          <Lightbulb className="w-5 h-5 text-[#155DF0]" />
          <div className="flex flex-col">
            <p>Hubungkan lebih banyak data</p>
            <p className="text-[#4A5565]">
              Menghubungkan data e-commerce dan ride-hailing dapat meningkatkan
              skor hingga 30 poin
            </p>
            <p>Hubungkan sekarang →</p>
          </div>
        </div>
        <div className="bg-[#F0FDF4] flex flex-row gap-3 p-4 rounded-[16px]">
          <CircleCheckBig className="w-5 h-5 text-[#00A63E]" />
          <div className="flex flex-col">
            <p>Bayar tagihan tepat waktu</p>
            <p className="text-[#4A5565]">
              Membayar tagihan listrik, air, dan pulsa tepat waktu selama 3
              bulan akan meningkatkan skor 20 poin
            </p>
          </div>
        </div>
        <div className="bg-[#FAF5FF] flex flex-row gap-3 p-4 rounded-[16px]">
          <CreditCard className="w-5 h-5 text-[#9810FA]" />
          <div className="flex flex-col">
            <p>Hubungkan lebih banyak data</p>
            <p className="text-[#4A5565]">
              Membayar tagihan listrik, air, dan pulsa tepat waktu selama 3
              bulan akan meningkatkan skor 20 poin
            </p>
            <p>Hubungkan sekarang →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
