"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function ProdutoCadPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    preco_venda: "",
    un: "UN"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nome || !formData.preco_venda) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
      });
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "produto"), {
        nome: formData.nome,
        preco_venda: Number(formData.preco_venda.replace(",", ".")),
        un: formData.un,
        createdAt: new Date()
      });

      toast({
        title: "Sucesso",
        description: "Produto cadastrado com sucesso!",
      });
      router.back();
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o produto.",
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
          <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
        </div>

        <Card className="border-none shadow-xl bg-card">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-lg text-primary">Informações do Produto</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Produto</Label>
                <Input 
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  placeholder="Ex: Arroz Tio João 5kg"
                  className="h-12"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preco">Preço de Venda (R$)</Label>
                  <Input 
                    id="preco"
                    type="text"
                    inputMode="decimal"
                    value={formData.preco_venda}
                    onChange={(e) => setFormData({...formData, preco_venda: e.target.value})}
                    placeholder="0,00"
                    className="h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="un">Unidade</Label>
                  <Input 
                    id="un"
                    value={formData.un}
                    onChange={(e) => setFormData({...formData, un: e.target.value})}
                    placeholder="UN, KG, CX..."
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
                    Salvar Produto
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
