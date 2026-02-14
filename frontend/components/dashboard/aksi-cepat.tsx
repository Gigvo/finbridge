import React from "react";
import { Plus, CreditCard, Calendar } from "lucide-react";

export default function AksiCepat() {
  return (
    <div className="border-1 border-gray-200 rounded-[14px] p-6 ">
      <p>Aksi Cepat</p>
      <div className="flex flex-col gap-1 pt-8">
        <div className="flex flex-row gap-2 p-2 rounded-[8px] border-1 border-gray-200">
          <Plus />
          <p>Hubungkan Data Baru</p>
        </div>
        <div className="bg-black text-white flex flex-row gap-2 p-2 rounded-[8px] border-1 border-gray-200">
          <CreditCard />
          <p>Lihat Pembiayaan</p>
        </div>
        <div className="flex flex-row gap-2 p-2 rounded-[8px] border-1 border-gray-200">
          <Calendar />
          <p>Jadwal Pembayaran</p>
        </div>
      </div>
    </div>
  );
}
