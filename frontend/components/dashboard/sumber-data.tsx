import React from "react";
import { CheckCircle2, Plus } from "lucide-react";

export default function SumberData() {
  const connectedSources = [
    { id: 1, name: "PLN (Listrik)", status: "Terhubung" },
    { id: 2, name: "GoPay", status: "Terhubung" },
  ];

  const availableSources = [
    { id: 3, name: "Shopee", status: "Belum terhubung" },
    { id: 4, name: "Tokopedia", status: "Belum terhubung" },
    { id: 5, name: "Gojek", status: "Belum terhubung" },
  ];

  return (
    <div className="rounded-[16px] border border-gray-200 p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[20px] font-semibold text-black">
          Sumber Data Terhubung
        </h2>
        <p className="text-[14px] text-[#717182]">
          {connectedSources.length} dari{" "}
          {connectedSources.length + availableSources.length} sumber tersedia
        </p>
      </div>

      {/* Connected Sources */}
      <div className="space-y-3 mb-3">
        {connectedSources.map((source) => (
          <div
            key={source.id}
            className="bg-[#E8F5E9] rounded-[12px] p-4 flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-[#00A63E]" />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-semibold text-black">
                {source.name}
              </p>
              <p className="text-[14px] text-[#2E7D32]">{source.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Available Sources */}
      <div className="space-y-3 mb-4">
        {availableSources.map((source) => (
          <div
            key={source.id}
            className="bg-[#F9FAFB] rounded-[12px] p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <Plus className="w-6 h-6 text-[#9CA3AF]" />
            </div>
            <div className="flex-1">
              <p className="text-[16px] font-semibold text-black">
                {source.name}
              </p>
              <p className="text-[14px] text-[#717182]">{source.status}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Manage Button */}
      <button className="w-full py-3 rounded-[12px] border border-gray-200 bg-white text-[16px] font-semibold text-black hover:bg-gray-50 transition-colors">
        Kelola Koneksi
      </button>
    </div>
  );
}
