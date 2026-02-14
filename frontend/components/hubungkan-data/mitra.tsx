"use client";

import React, { useState, useRef } from "react";
import {
  Plus,
  Zap,
  Droplet,
  ShoppingCart,
  Smartphone,
  Store,
  Car,
  Shield,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Partner {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: React.ReactNode;
  connected: boolean;
  category: string;
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partnerName: string;
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

function UploadDialog({
  open,
  onOpenChange,
  partnerName,
  onUpload,
  isUploading,
}: UploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      setError("Format file harus PDF, JPG, atau PNG");
      return false;
    }

    if (file.size > maxSize) {
      setError("Ukuran file maksimal 5MB");
      return false;
    }

    setError("");
    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onUpload(selectedFile);
    }
  };

  const resetDialog = () => {
    setSelectedFile(null);
    setError("");
    setDragActive(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  React.useEffect(() => {
    if (!open) {
      resetDialog();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Hubungkan {partnerName}
          </DialogTitle>
          <DialogDescription>
            Upload bukti pembayaran atau dokumen terkait
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-sm font-medium text-gray-700">
            Upload Bukti Pembayaran (PDF, JPG, PNG)
          </div>

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
              dragActive
                ? "border-blue-500 bg-blue-50"
                : selectedFile
                  ? "border-green-500 bg-green-50"
                  : error
                    ? "border-red-500 bg-red-50"
                    : "border-gray-300 bg-gray-50"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />

            <div className="flex flex-col items-center justify-center text-center">
              {selectedFile ? (
                <>
                  <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                  <div className="text-sm font-medium text-green-700">
                    {selectedFile.name}
                  </div>
                  <div className="text-xs text-green-600">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <div className="text-sm font-medium text-gray-700">
                    Klik untuk upload atau drag & drop
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Upload tagihan atau bukti pembayaran 3 bulan terakhir
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-2 rounded-md">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className="flex-1 bg-gray-900 hover:bg-gray-800"
            >
              {isUploading ? "Mengupload..." : "Upload & Hubungkan"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Mitra() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [uploadDialog, setUploadDialog] = useState<{
    open: boolean;
    partnerId: string;
    partnerName: string;
  }>({
    open: false,
    partnerId: "",
    partnerName: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [connectedPartners, setConnectedPartners] = useState<Set<string>>(
    new Set(),
  );

  const partners: Partner[] = [
    {
      id: "pln",
      name: "PLN (Listrik)",
      description: "Riwayat pembayaran listrik 6 bulan terakhir",
      points: 15,
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      connected: connectedPartners.has("pln"),
      category: "Utilities",
    },
    {
      id: "gopay",
      name: "GoPay",
      description: "Transaksi e-wallet dan riwayat top-up",
      points: 20,
      icon: <Smartphone className="w-6 h-6 text-blue-600" />,
      connected: connectedPartners.has("gopay"),
      category: "E-Wallet",
    },
    {
      id: "pdam",
      name: "PDAM (Air)",
      description: "Riwayat pembayaran air 6 bulan terakhir",
      points: 12,
      icon: <Droplet className="w-6 h-6 text-blue-400" />,
      connected: connectedPartners.has("pdam"),
      category: "Utilities",
    },
    {
      id: "shopee",
      name: "Shopee",
      description: "Transaksi pembelian dan penjualan",
      points: 18,
      icon: <ShoppingCart className="w-6 h-6 text-orange-500" />,
      connected: connectedPartners.has("shopee"),
      category: "E-Commerce",
    },
    {
      id: "tokopedia",
      name: "Tokopedia",
      description: "Transaksi pembelian dan penjualan",
      points: 18,
      icon: <Store className="w-6 h-6 text-green-600" />,
      connected: connectedPartners.has("tokopedia"),
      category: "E-Commerce",
    },
    {
      id: "ovo",
      name: "OVO",
      description: "Transaksi e-wallet dan riwayat pembayaran",
      points: 20,
      icon: <Shield className="w-6 h-6 text-purple-600" />,
      connected: connectedPartners.has("ovo"),
      category: "E-Wallet",
    },
    {
      id: "gojek",
      name: "Gojek",
      description: "Aktivitas sebagai driver atau pelanggan",
      points: 15,
      icon: <Car className="w-6 h-6 text-green-500" />,
      connected: connectedPartners.has("gojek"),
      category: "Lainnya",
    },
    {
      id: "grab",
      name: "Grab",
      description: "Aktivitas sebagai driver atau pelanggan",
      points: 15,
      icon: <Car className="w-6 h-6 text-green-600" />,
      connected: connectedPartners.has("grab"),
      category: "Lainnya",
    },
  ];

  const tabs = ["Semua", "Utilities", "E-Wallet", "E-Commerce", "Lainnya"];

  const filteredPartners =
    activeTab === "Semua"
      ? partners
      : partners.filter((p) => p.category === activeTab);

  const handleConnect = (partnerId: string, partnerName: string) => {
    setUploadDialog({
      open: true,
      partnerId,
      partnerName,
    });
  };

  const handleDisconnect = (partnerId: string) => {
    setConnectedPartners((prev) => {
      const newSet = new Set(prev);
      newSet.delete(partnerId);
      return newSet;
    });
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64Data = base64.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const imageBase64 = await convertToBase64(file);
      const mimeType = file.type;

      const response = await fetch(
        "http://localhost:4000/api/ai/receipt-amount",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mimeType,
            imageBase64,
            currency: "IDR",
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      // Mark partner as connected
      setConnectedPartners((prev) => new Set(prev).add(uploadDialog.partnerId));

      // Close dialog
      setUploadDialog((prev) => ({ ...prev, open: false }));

      // You can add success toast here
      console.log("Upload successful");
    } catch (error) {
      console.error("Upload error:", error);
      // You can add error toast here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-[12px] p-4 mb-6 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-[14px] font-semibold text-blue-900 mb-1">
            Data Anda Aman
          </p>
          <p className="text-[13px] text-blue-700">
            Semua data dienkripsi end-to-end dan hanya digunakan untuk
            penghitungan skor kredit. Anda dapat mencabut akses kapan saja.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-[8px] text-[14px] font-medium whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className={`rounded-[12px] border p-4 ${
              partner.connected
                ? "bg-green-50 border-green-200"
                : "bg-white border-gray-200"
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-[8px] bg-white flex items-center justify-center flex-shrink-0 border border-gray-200">
                {partner.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-semibold text-black">
                  {partner.name}
                </h3>
                <p className="text-[13px] text-[#717182] mt-0.5">
                  {partner.description}
                </p>
              </div>
              {partner.connected && (
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-yellow-600">
                <Zap className="w-4 h-4 fill-yellow-600" />
                <span className="text-[14px] font-medium">
                  +{partner.points} poin
                </span>
              </div>

              {partner.connected ? (
                <button
                  onClick={() => handleDisconnect(partner.id)}
                  className="px-4 py-2 rounded-[8px] bg-white border border-gray-300 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Putus
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(partner.id, partner.name)}
                  className="px-4 py-2 rounded-[8px] bg-black text-white text-[14px] font-medium flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Hubungkan
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Upload Dialog */}
      <UploadDialog
        open={uploadDialog.open}
        onOpenChange={(open) => setUploadDialog((prev) => ({ ...prev, open }))}
        partnerName={uploadDialog.partnerName}
        onUpload={handleUpload}
        isUploading={isUploading}
      />
    </div>
  );
}
