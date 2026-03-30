
"use client";

import { useRouter } from "next/navigation";
import { ListaCliente } from "@/components/lista-clientes";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProdutoPage() {
  const router = useRouter();

  const handleClienteSelecionado = (id: string) => {
    // Logic moved from component to page
    localStorage.removeItem("idProduto");
    localStorage.setItem("idCliente", id);
    router.push("/produto-cli");
  };

  return (
 <div className="min-h-screen bg-background py-12 px-4 md:px-0">
<div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
        </div>

        <ListaCliente onSelect={handleClienteSelecionado} />
</div>
</div>
  );
}
