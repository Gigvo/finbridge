"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Star, Filter, Search } from "lucide-react";

interface FinancingProduct {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewCount: number;
  maxAmount: string;
  interestRate: string;
  tenor: string;
  description: string;
  features: string[];
  verified: boolean;
  tag?: string;
}

const financingProducts: FinancingProduct[] = [
  {
    id: "1",
    name: "Asuransi Mikro Bersama",
    category: "Asuransi",
    rating: 4.5,
    reviewCount: 234,
    maxAmount: "Rp 5 juta",
    interestRate: "2.5% per bulan",
    tenor: "12 bulan",
    description: "Asuransi mikro untuk perlindungan usaha kecil menengah",
    features: ["Proses cepat", "Tanpa agunan", "Bunga kompetitif"],
    verified: true,
  },
  {
    id: "2",
    name: "Modal UKM",
    category: "Pinjaman",
    rating: 4.8,
    reviewCount: 156,
    maxAmount: "Rp 50 juta",
    interestRate: "1.8% per bulan",
    tenor: "24 bulan",
    description: "Pinjaman modal usaha untuk pengembangan UKM",
    features: ["Pencairan cepat", "Syarat mudah", "Tenor fleksibel"],
    verified: true,
  },
  {
    id: "3",
    name: "Dana Usaha Program CSR",
    category: "Hibah",
    rating: 4.2,
    reviewCount: 89,
    maxAmount: "Rp 10 juta",
    interestRate: "0% (Hibah)",
    tenor: "Non-tenor",
    description: "Program bantuan dana usaha dari CSR perusahaan",
    features: ["Tanpa bunga", "Bantuan pelatihan", "Pendampingan usaha"],
    verified: true,
    tag: "Fazilatiunnisaa",
  },
  {
    id: "4",
    name: "Birama Produktif",
    category: "Pinjaman",
    rating: 4.6,
    reviewCount: 178,
    maxAmount: "Rp 25 juta",
    interestRate: "2.2% per bulan",
    tenor: "18 bulan",
    description: "Pinjaman produktif untuk pengembangan usaha mikro",
    features: ["Proses online", "Bunga tetap", "Tanpa penalty"],
    verified: true,
  },
  {
    id: "5",
    name: "Kapital Sejahtera",
    category: "Investasi",
    rating: 4.4,
    reviewCount: 267,
    maxAmount: "Rp 100 juta",
    interestRate: "Variable",
    tenor: "36 bulan",
    description: "Program investasi untuk pengembangan bisnis berkelanjutan",
    features: ["ROI tinggi", "Risiko terkelola", "Diversifikasi portofolio"],
    verified: true,
  },
  {
    id: "6",
    name: "Akademi",
    category: "Pelatihan",
    rating: 4.7,
    reviewCount: 145,
    maxAmount: "Gratis",
    interestRate: "0%",
    tenor: "3 bulan",
    description: "Program pelatihan dan pengembangan keterampilan bisnis",
    features: ["Sertifikat resmi", "Mentor berpengalaman", "Networking"],
    verified: true,
  },
];

export default function Pembiayaan() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("popular");

  const filteredProducts = financingProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      product.category.toLowerCase() === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Marketplace Pembiayaan</h1>
                  <p className="text-blue-100">
                    Temukan pembiayaan yang tepat sesuai kebutuhan bisnis Anda
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 text-sm">
                <div>
                  <div className="text-2xl font-bold">650</div>
                  <div className="text-blue-200">Total Penyedia</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">15+</div>
                  <div className="text-blue-200">Jenis Produk</div>
                </div>
              </div>
            </div>

            {/* Quick Info Card */}
            <div className="bg-white text-gray-900 p-6 rounded-lg shadow-lg max-w-sm">
              <h3 className="font-semibold mb-4">Filter Produk</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Jenis Pembiayaan</span>
                  <span className="font-medium">Semua</span>
                </div>
                <div className="flex justify-between">
                  <span>Maksimal Bunga</span>
                  <span className="font-medium">3% per bulan</span>
                </div>
                <div className="flex justify-between">
                  <span>Tenor Maksimal</span>
                  <span className="font-medium">36 bulan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari produk pembiayaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="pinjaman">Pinjaman</SelectItem>
              <SelectItem value="asuransi">Asuransi</SelectItem>
              <SelectItem value="investasi">Investasi</SelectItem>
              <SelectItem value="hibah">Hibah</SelectItem>
              <SelectItem value="pelatihan">Pelatihan</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Terpopuler</SelectItem>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
              <SelectItem value="amount">Nominal Terbesar</SelectItem>
              <SelectItem value="interest">Bunga Terendah</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Info Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-green-800 mb-2">
            Tips Memilih Pembiayaan
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <p className="mb-1">
                • Sesuaikan dengan kebutuhan dan kemampuan bayar
              </p>
              <p className="mb-1">
                • Perhatikan tingkat bunga dan biaya administrasi
              </p>
            </div>
            <div>
              <p className="mb-1">• Baca syarat dan ketentuan dengan teliti</p>
              <p className="mb-1">
                • Pilih penyedia yang terverifikasi dan terpercaya
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-lg">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {product.category}
                        </Badge>
                        {product.verified && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {product.tag && (
                          <Badge className="bg-green-500 text-white text-xs">
                            {product.tag}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.reviewCount} ulasan
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-gray-600 mb-4 text-sm">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500">Maksimal Plafon</div>
                    <div className="font-semibold text-blue-600">
                      {product.maxAmount}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Bunga</div>
                    <div className="font-semibold text-orange-600">
                      {product.interestRate}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Tenor</div>
                    <div className="font-semibold">{product.tenor}</div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-2">Keunggulan:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                  Ajukan Sekarang
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="bg-blue-50 rounded-lg p-8">
            <h3 className="text-xl font-semibold mb-2">Butuh Bantuan?</h3>
            <p className="text-gray-600 mb-4">
              Tim ahli kami siap membantu Anda menemukan pembiayaan yang tepat
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline">Konsultasi Gratis</Button>
              <Button>Hubungi Tim Ahli</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
