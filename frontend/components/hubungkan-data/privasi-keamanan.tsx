import React from "react";
import { CheckCircle2 } from "lucide-react";

export default function PrivasiCard() {
  const securityFeatures = [
    {
      id: 1,
      text: "Enkripsi end-to-end untuk semua data",
    },
    {
      id: 2,
      text: "Tidak menyimpan password atau kredensial",
    },
    {
      id: 3,
      text: "Anda bisa mencabut akses kapan saja",
    },
    {
      id: 4,
      text: "Sesuai dengan UU Perlindungan Data Pribadi",
    },
  ];

  return (
    <div className="rounded-[16px] border border-gray-200 p-6 bg-white">
      {/* Header */}
      <h3 className="text-[18px] font-semibold text-black mb-4">
        Privasi & Keamanan
      </h3>

      {/* Security Features List */}
      <div className="space-y-3">
        {securityFeatures.map((feature) => (
          <div key={feature.id} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-[14px] text-[#717182] leading-relaxed">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
