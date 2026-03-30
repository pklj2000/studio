
"use client";
import { useRouter } from "next/navigation";
import { ListaProdutos } from "@/components/lista-produtos";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ProdutoCliPage() {
  const router = useRouter();
  return (
<div className="min-h-screen bg-background py-12 px-4 md:px-0">
<div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/produto")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
        </div>

        <ListaProdutos showAll={false} />
</div>
</div>
  );
}
