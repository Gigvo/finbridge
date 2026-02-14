import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="flex flex-row justify-between items-center px-8 py-3.5">
      <div className="flex flex-row items-center gap-2.5">
        <Image src="/finbridge-logo.webp" alt="Logo" width={52} height={40} />
        <p className="font-bold">
          <span className="text-blue-500">Fin</span>Bridge
        </p>
      </div>
      <div className="flex flex-row gap-8 items-center">
        <Link href={"/"}>Fitur</Link>
        <Link href={"/fitur"}>Cara Kerja</Link>
        <Link href={"/cara-kerja"}>Testimoni</Link>
        <Link href={"/testimoni"}>
          <Button variant={"default"}>Daftar Sekarang</Button>
        </Link>
      </div>
    </div>
  );
}
