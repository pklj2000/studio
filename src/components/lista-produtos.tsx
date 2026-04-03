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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Categoria } from "@/model/categoria";

interface Produto {
  id: string;
  nome: string;
  preco_venda: number;
}

interface ListaProdutosProps {
  showAll?: boolean;
  showAdd?: boolean;
  onSelect?: (produto: Produto) => void;
}

export function ListaProdutos({ showAll = false, showAdd = false, onSelect }: ListaProdutosProps) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "produto"), orderBy("nome", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const produtoList: Produto[] = [];
      
      if (showAll) {
        produtoList.push({ id: "0", nome: "Sem compra", preco_venda: 0 } as Produto);
      }

      snapshot.forEach((doc) => {
        const data = doc.data();
        produtoList.push({ 
          id: doc.id, 
          nome: data.nome || "Sem nome",
          preco_venda: data.preco_venda || 0
        } as Produto);
      });

      if (showAll) {
        produtoList.push({ id: "1", nome: "Outro produto", preco_venda: 0 } as Produto);
      }

      setProdutos(produtoList);
      setLoading(false);
    });

    const cat = query(collection(db, "categoria"), orderBy("ordem", "asc"));
    const unsubscribeCat = onSnapshot(cat, (snapshot) => {
      const categoriaList: Categoria[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        categoriaList.push({ 
          descricao: data.descricao
        } as Categoria);
      });

      setCategorias(categoriaList);
    });

    return () => {
      unsubscribe();
      unsubscribeCat();
    };
  }, [showAll]);
  
  const selecionarProduto = (item: Produto) => {
    if (onSelect) {
      onSelect(item);
    } else {
      localStorage.setItem("idProduto", item.id);
      router.push("/vendas-qtd");
    }
  }

  const selecionarCategoria = (descricao: string) => {
    setCategoriaSelecionada(prev => prev === descricao ? null : descricao);
  };

  return (
    <div className="relative space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="flex flex-wrap gap-2 w-full">
        {categorias.map((cat) => (
          <Badge 
            key={cat.descricao}
            variant={categoriaSelecionada === cat.descricao ? "default" : "outline"}
            className="cursor-pointer px-4 py-2 text-sm transition-all hover:bg-primary/10"
            onClick={() => selecionarCategoria(cat.descricao)}
          >
            {cat.descricao}
          </Badge>
        ))}
      </div>

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
                    "group flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-accent/5"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-lg font-body text-foreground">
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

      {showAdd && (
        <div className="fixed bottom-8 right-8 md:right-[calc(50%-13rem)] z-50">
          <Button 
            onClick={() => router.push("/produto-cad")}
            size="icon" 
            className="h-16 w-16 rounded-full shadow-2xl bg-primary hover:bg-primary/90 transition-transform active:scale-95"
          >
            <Plus className="h-8 w-8 text-white" />
          </Button>
        </div>
      )}
    </div>
  );
}
