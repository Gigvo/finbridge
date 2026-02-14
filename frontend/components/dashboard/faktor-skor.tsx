import React from "react";

export default function FaktorSkor() {
  return (
    <div className="border-1 rounded-[14px] border-gray-200 p-6">
      <p className="text-[16px]">Faktor-Faktor Skor Kredit</p>
      <p className="text-[16px]">Komponen yang mempengaruhi skor Anda</p>
      <div className="pt-6">
        <div>
          <div className="flex flex-row justify-between">
            <p className="text-sm text-[#364153]">Riwayat Pembayaran</p>
            <p>Excellent</p>
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-black rounded-full transition-all"
              style={{ width: `85%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between">
            <p className="text-sm text-[#364153]">Volume Transaksi</p>
            <p>Good</p>
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-black rounded-full transition-all"
              style={{ width: `85%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between">
            <p className="text-sm text-[#364153]">Konsistensi Keuangan</p>
            <p>Good</p>
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-black rounded-full transition-all"
              style={{ width: `85%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex flex-row justify-between">
            <p className="text-sm text-[#364153]">Diversifikasi Data</p>
            <p>Good</p>
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded-full mb-8 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-black rounded-full transition-all"
              style={{ width: `85%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
