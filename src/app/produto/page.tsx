
"use client";

import { useRouter } from "next/navigation";
import { ListaCliente } from "@/components/lista-clientes";

export default function VendasCliPage() {
  const router = useRouter();

  const handleClienteSelecionado = (id: string) => {
    // Logic moved from component to page
    localStorage.removeItem("idProduto");
    localStorage.setItem("idCliente", id);
    router.push("/produto-cli");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto">
        <ListaCliente onSelect={handleClienteSelecionado} />
      </div>
    </div>
  );
}
