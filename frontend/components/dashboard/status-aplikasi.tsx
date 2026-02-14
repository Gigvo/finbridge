import React from "react";
import { ArrowRight, AlertCircle } from "lucide-react";

export default function StatusAplikasi() {
  const hasApplications = false; // Change to true when there are applications

  return (
    <div className="rounded-[16px] border border-gray-200 p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[20px] font-semibold text-black">
          Status Aplikasi
        </h2>
        <p className="text-[14px] text-[#717182]">
          Pembiayaan yang sedang diproses
        </p>
      </div>

      {/* Empty State */}
      {!hasApplications && (
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-[#9CA3AF]" />
          </div>
          <p className="text-[14px] text-[#717182] mb-6">
            Belum ada aplikasi pembiayaan
          </p>
          <button className="bg-black text-white px-6 py-3 rounded-[12px] font-semibold text-[14px] flex items-center gap-2 hover:bg-gray-800 transition-colors">
            Ajukan Sekarang
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Active Applications - Show when hasApplications is true */}
      {hasApplications && (
        <div className="space-y-4">
          {/* Example application card */}
          <div className="border border-gray-200 rounded-[12px] p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[16px]">
                Pembiayaan Modal Usaha
              </h3>
              <span className="text-[12px] bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                Diproses
              </span>
            </div>
            <p className="text-[14px] text-[#717182] mb-2">
              Rp 50.000.000 • 12 bulan
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
