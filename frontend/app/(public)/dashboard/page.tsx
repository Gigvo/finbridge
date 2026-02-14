import React from "react";
import SkorKredit from "@/components/dashboard/skor-kredit";
import RekomendasiCard from "@/components/dashboard/rekomendasi-peningkatan-skor";
import FaktorSkor from "@/components/dashboard/faktor-skor";
import PerkembanganSkor from "@/components/dashboard/perkembangan-skor";
import AksiCepat from "@/components/dashboard/aksi-cepat";
import SumberData from "@/components/dashboard/sumber-data";
import StatusAplikasi from "@/components/dashboard/status-aplikasi";

export default function Dashboard() {
  return (
    <div className="p-8">
      <p className="font-bold text-[30px] ">Dashboard</p>
      <p className="text-[16px]">
        Selamat datang kembali! Berikut adalah ringkasan profil kredit Anda.
      </p>
      <div className="flex flex-row gap-8 pt-8">
        <div className="flex-1 flex flex-col gap-8">
          <SkorKredit />
          <FaktorSkor />
          <PerkembanganSkor />
          <RekomendasiCard />
        </div>
        <div className="flex flex-col gap-8">
          <AksiCepat />
          <SumberData />
          <StatusAplikasi />
        </div>
      </div>
    </div>
  );
}
