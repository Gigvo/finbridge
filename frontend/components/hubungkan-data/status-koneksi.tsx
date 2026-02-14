"use client";

import React, { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function StatusKoneksi() {
  const [isCalculating, setIsCalculating] = useState(false);
  const connectedCount = 2;
  const minRequired = 2;
  const recommended = "4+";
  const totalImpact = 35;
  const isReady = connectedCount >= minRequired;

  const calculateCreditScore = async () => {
    setIsCalculating(true);

    try {
      const requestData = {
        umkm: {
          name: "Warung Maju Jaya",
          sector: "retail",
          city: "Bandung",
        },
        signals: {
          bills: {
            onTimePaymentRate: 0.92,
            latePaymentCount90d: 1,
            avgMonthlyAmount: 3500000,
          },
          ewallet: {
            monthlyTxCount: 420,
            monthlyGmv: 18000000,
            refundRate: 0.01,
            chargebackRate: 0.003,
          },
          stability: {
            revenueVolatility: 0.18,
            activeDaysPerMonth: 26,
          },
        },
        currency: "IDR",
      };

      const response = await fetch("http://localhost:4000/api/ai/umkm-kpi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to calculate score");
      }

      console.log("Credit score calculation result:", data);

      // You can add navigation to results page or show success message here
      // For example: router.push('/dashboard') or show a success toast
    } catch (error) {
      console.error("Error calculating credit score:", error);
      // You can add error toast here
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="rounded-[16px] border border-gray-200 p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-[20px] font-semibold text-black">Status Koneksi</h2>
        <p className="text-[14px] text-[#717182]">Progres penghubungan data</p>
      </div>

      {/* Circle Progress */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-4">
          <span className="text-[56px] font-bold text-blue-600">
            {connectedCount}
          </span>
        </div>
        <p className="text-[16px] font-medium text-gray-700">
          Sumber data terhubung
        </p>
      </div>

      {/* Stats */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#717182]">
            Minimal (untuk skor)
          </span>
          <span className="text-[16px] font-semibold text-black">
            {minRequired}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#717182]">Direkomendasikan</span>
          <span className="text-[16px] font-semibold text-black">
            {recommended}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[14px] text-[#717182]">Total dampak skor</span>
          <span className="text-[16px] font-semibold text-blue-600">
            +{totalImpact} poin
          </span>
        </div>
      </div>

      {/* Ready Message */}
      {isReady && (
        <div className="bg-green-50 border border-green-200 rounded-[12px] p-4 flex items-center gap-3 mb-4">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-[14px] font-medium text-green-800">
            Siap mendapatkan skor kredit!
          </p>
        </div>
      )}

      {/* Calculate Button */}
      <button
        onClick={calculateCreditScore}
        disabled={!isReady || isCalculating}
        className="w-full py-3 rounded-[12px] bg-black text-white text-[16px] font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isCalculating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Menghitung...
          </>
        ) : (
          "Hitung Skor Kredit"
        )}
      </button>
    </div>
  );
}
