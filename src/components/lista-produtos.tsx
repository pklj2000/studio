"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CheckCircle2, ListTodo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ListaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "produto"), orderBy("nome", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtoList: Produto[] = [];
      snapshot.forEach((doc) => {
        produtoList.push({ id: doc.id, ...doc.data() } as Produto);
      });
      setProdutos(produtoList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const selecionarProduto = (item: Produto) => {
    localStorage.setItem("idProduto", JSON.stringify(item.id));
    router.push("/vendas-qtd");
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">Produtos</h1>
      </div>

      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
            <div className="divide-y divide-border">
              {produtos.map((produto) => (
                <div 
                  key={produto.id} 
                  onClick={() => selecionarProduto(produto)}
                  className={cn(
                    "group flex items-center justify-between p-4 transition-all hover:bg-accent/5 task-item-enter"
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
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
     
    </div>
  );
}