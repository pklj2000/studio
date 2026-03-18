
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function FechamentoPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/menu")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Fechamento</h1>
        </div>
        
        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Resumo de Vendas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-10 text-center">
            <div className="p-4 bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">Em desenvolvimento</p>
            <p className="text-sm text-muted-foreground">O resumo do dia aparecerá aqui em breve.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
