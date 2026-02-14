import React from "react";
import Mitra from "@/components/hubungkan-data/mitra";
import StatusKoneksi from "@/components/hubungkan-data/status-koneksi";
import PrivasiCard from "@/components/hubungkan-data/privasi-keamanan";

export default function HubungkanData() {
  return (
    <div className="p-6">
      <p className="text-[30px] font-bold">Hubungkan Data Alternatif</p>
      <p>
        Hubungkan sumber data untuk mendapatkan skor kredit yang akurat dan
        meningkatkan peluang pembiayaan
      </p>
      <div className="flex flex-row gap-8">
        <div className="flex-1">
          <Mitra />
        </div>
        <div className="flex flex-col gap-8">
          <StatusKoneksi />
          <PrivasiCard />
        </div>
      </div>
    </div>
  );
}
