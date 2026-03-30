"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Menu {
  texto: string;
  acao: string;
}

export function ListaMenu() {
  const router = useRouter();

  const menusList: Menu[] = [
    { texto: "Vendas", acao: "/vendas-data" },
    { texto: "Consulta Preço", acao: "/produto" },
    { texto: "Histórico Vendas", acao: "/vendas-hist" },
    { texto: "Fechamento", acao: "/fechamento" }
  ];
  
  const selecionarMenu = (acao: string) => {
    console.log(acao);
    router.push(acao);
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">Menu de Opções</h1>
      </div>

      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
            <div className="divide-y divide-border">
              {menusList.map((menu) => (
                <div 
                  key={menu.texto} 
                  onClick={() => selecionarMenu(menu.acao)}
                  className={cn(
                    "group flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-accent/5 task-item-enter"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className={cn(
                      "text-lg transition-all duration-300 font-body",
                      "text-foreground"
                    )}>
                      {menu.texto}
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
