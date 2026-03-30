
"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ListaProdutosProps {
  showAll?: boolean;
}

export function ListaProdutos({ showAll = false }: ListaProdutosProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "produto"), orderBy("nome", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtoList: Produto[] = [];
      
      // Determine if we should show extra helper items
      const idCliente = typeof window !== "undefined" ? localStorage.getItem("idCliente") : null;
      const shouldShowExtras = showAll;

      if (shouldShowExtras) {
        produtoList.push({ id: "0", nome: "Sem compra" } as Produto);
      }

      snapshot.forEach((doc) => {
        produtoList.push({ id: doc.id, ...doc.data() } as Produto);
      });

      if (shouldShowExtras) {
        produtoList.push({ id: "1", nome: "Outro produto" } as Produto);
      }

      setProdutos(produtoList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [showAll]);
  
  const selecionarProduto = (item: Produto) => {
    localStorage.setItem("idProduto", item.id);
    router.push("/vendas-qtd");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando produtos...</div>
          ) : (
            <div className="divide-y divide-border">
              {produtos.map((produto) => (
                <div 
                  key={produto.id} 
                  onClick={() => selecionarProduto(produto)}
                  className={cn(
                    "group flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-accent/5 task-item-enter"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className={cn(
                      "text-lg transition-all duration-300 font-body",
                      "text-foreground"
                    )}>
                      {produto.nome}
                    </span>
                  </div>

                  <div className="flex justify-between items-center px-2">
                  <span className="text-lg font-bold text-primary">
                    {produto.preco_venda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>


                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
