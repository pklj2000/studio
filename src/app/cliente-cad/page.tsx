"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { 
  collection, 
  addDoc,
  onSnapshot, 
  query, 
} from "firebase/firestore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Vendedor {
  id: string;
  nome: string;
}

export default function ClienteCadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingVendedores, setFetchingVendedores] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    idVendedor: "",
    diasPagto: "0",
    ordem: "0"
  });

  useEffect(() => {
    const q = query(collection(db, "vendedor"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vendedorList: Vendedor[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        vendedorList.push({ 
          id: doc.id, 
          nome: data.nome || "Sem nome" 
        } as Vendedor);
      });
      
      setVendedores(vendedorList);
      setFetchingVendedores(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.idVendedor) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "cliente"), {
        nome: formData.nome,
        idVendedor: formData.idVendedor,
        dias_pagto: formData.diasPagto,
        ordem: formData.ordem
      });

      toast({
        title: "Sucesso",
        description: "Cliente cadastrado com sucesso!",
      });
      router.back();
    } catch (error) {
      console.error("Erro ao cadastrar o cliente:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o cliente.",
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
          <h1 className="text-3xl font-bold tracking-tight">Novo Cliente</h1>
        </div>

        <Card className="border-none shadow-xl bg-card">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-lg text-primary">Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
                <Input 
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Rei do Frango"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendedor">Vendedor</Label>
                <Select 
                  value={formData.idVendedor} 
                  onValueChange={(value) => setFormData({...formData, idVendedor: value})}
                  disabled={fetchingVendedores}
                >
                  <SelectTrigger id="vendedor" className="h-12">
                    <SelectValue placeholder={fetchingVendedores ? "Carregando..." : "Selecione um vendedor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {vendedores.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ordem">Ordem</Label>
                  <Input 
                    id="ordem"
                    type="text"
                    inputMode="numeric"
                    value={formData.ordem}
                    onChange={(e) => setFormData({...formData, ordem: e.target.value})}
                    placeholder="0"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="diasPagto">Dias Pagamento</Label>
                  <Input 
                    id="diasPagto"
                    value={formData.diasPagto}
                    onChange={(e) => setFormData({...formData, diasPagto: e.target.value})}
                    placeholder="7, 14, 21..."
                    className="h-12"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 text-lg shadow-lg"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Salvar Cliente
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}