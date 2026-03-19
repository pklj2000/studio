"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

export default function VendasQtdPage() {
  const [quantidade, setQuantidade] = useState("1");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState<{
    vendedorId: string;
    clienteId: string;
    produtoId: string;
  } | null>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Accessing localStorage only on the client side
    const vId = localStorage.getItem("idVendedor");
    const cId = localStorage.getItem("idCliente");
    const pId = localStorage.getItem("idProduto");

    if (vId && cId && pId) {
      setContext({
        vendedorId: JSON.parse(vId),
        clienteId: JSON.parse(cId),
        produtoId: JSON.parse(pId),
      });
    }
  }, []);

  const incluirProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantidade || isNaN(Number(quantidade)) || Number(quantidade) <= 0) {
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
      await addDoc(collection(db, "venda"), {
        vendedorId: context.vendedorId,
        clienteId: context.clienteId,
        produtoId: context.produtoId,
        quantidade: Number(quantidade),
        data: serverTimestamp(),
      });

      // Clear selection and go back to menu or customer list
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
          <h1 className="text-3xl font-bold tracking-tight">Informar Quantidade</h1>
        </div>

        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Finalizar Item
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={incluirProduto} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Quantidade do Produto
                </label>
                <Input
                  type="number"
                  inputMode="numeric"
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="0"
                  className="bg-background h-14 text-2xl font-bold text-center focus-visible:ring-primary"
                  autoFocus
                />
              </div>
              
              <Button 
                type="submit" 
                size="lg" 
                disabled={loading}
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
