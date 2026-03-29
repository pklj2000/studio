
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  collection, 
  addDoc,
  where, 
  onSnapshot, 
  query, 
  doc,
  getDoc
} from "firebase/firestore";

export default function VendasQtdPage() {
  const [quantidade, setQuantidade] = useState("1");
  const [loading, setLoading] = useState(false);
  const [valor, setValor] = useState(0);
  const [descProduto, setDescProduto] = useState("");
  const [context, setContext] = useState<{
    idVendedor: string;
    idCliente: string;
    idProduto: string;
  } | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const idVendedor = localStorage.getItem("idVendedor");
    const idCliente = localStorage.getItem("idCliente");
    const idProduto = localStorage.getItem("idProduto");

    if (idVendedor && idCliente && idProduto) {
      setContext({
        idVendedor,
        idCliente,
        idProduto,
      });

      // 1. Fetch specific price for this customer/product combination
      const qPrice = query(
        collection(db, "cliente-produto"),
        where("idCliente", "==", idCliente),
        where("idProduto", "==", idProduto)
      );
      
      const unsubscribePrice = onSnapshot(qPrice, (snapshot) => {
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.valor) setValor(data.valor);
        });
      });

      // 2. SEARCH BY KEY: Fetch product data using the document ID (key)
      const productRef = doc(db, "produto", idProduto.trim());
      const unsubscribeProduct = onSnapshot(productRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setDescProduto(data.nome || "Produto sem nome");
          // Fallback to general price if specific price hasn't been found/set
          setValor(prevValor => prevValor === 0 ? (data.preco_venda || 0) : prevValor);
        } else {
          setDescProduto("Produto não encontrado");
        }
      });

      return () => {
        unsubscribePrice();
        unsubscribeProduct();
      };
    }
  }, []);

  const incluirProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantidade || isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Informe uma quantidade válida.",
      });
      return;
    }

    if (!context) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Dados da venda incompletos. Reinicie o processo.",
      });
      return;
    }

    setLoading(true);
    try {
      const hoje = new Date();
      const dataFormatada = hoje.getFullYear() + "-" +
        String(hoje.getMonth() + 1).padStart(2, "0") + "-" +
        String(hoje.getDate()).padStart(2, "0");

      await addDoc(collection(db, "venda"), {
        data: dataFormatada,
        idVendedor: context.idVendedor,
        idCliente: context.idCliente,
        idProduto: context.idProduto,
        qtd: Number(quantidade),
        valor: valor,
        descProduto: descProduto,
        createdAt: new Date()
      });

      localStorage.removeItem("idProduto");
      router.push("/vendas-cli");
    } catch (error) {
      console.error("Error adding sale: ", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível registrar a venda.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Venda</h1>
        </div>

        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-lg text-primary truncate">
              {descProduto || "Carregando produto..."}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={incluirProduto} className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm font-medium text-muted-foreground">Preço Unitário</span>
                  <span className="text-lg font-bold text-primary">
                    {valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground ml-1">
                    Quantidade
                  </label>
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={quantidade}
                    onChange={(e) => setQuantidade(e.target.value)}
                    placeholder="0"
                    className="bg-background h-16 text-3xl font-bold text-center focus-visible:ring-primary border-2"
                    autoFocus
                  />
                </div>

                <div className="flex justify-between items-center px-2 pt-2 border-t">
                  <span className="text-sm font-medium text-muted-foreground">Total</span>
                  <span className="text-xl font-black text-foreground">
                    {(Number(quantidade) * valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading || !descProduto}
                className="w-full bg-primary hover:bg-primary/90 text-white h-14 shadow-lg transition-all active:scale-95 text-lg"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-2" />
                    Confirmar Venda
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {!context && (
          <div className="p-4 bg-destructive/10 text-destructive rounded-lg text-sm flex items-center gap-2">
            Aviso: Alguns dados da venda não foram encontrados no cache local.
          </div>
        )}
      </div>
    </main>
  );
}
