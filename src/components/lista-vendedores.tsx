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
import { ListTodo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface Vendedor {
  id: string;
  nome: string;
  vendedor: string;
  ordem: number;  
  atendido: boolean;
}

export function ListaVendedores() {
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(db, "vendedor"), orderBy("nome", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const vendedoresList: Vendedor[] = [];
      snapshot.forEach((doc) => {
        vendedoresList.push({ id: doc.id, ...doc.data() } as Vendedor);
      });
      setVendedores(vendedoresList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  const selecionarVendedor = (id: string) => {
    try {
      localStorage.setItem("idVendedor", id);
      router.push("/menu");
    } catch (error) {
      console.error("Error", error);
    }
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">Vendedores</h1>
      </div>

      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary/40" />
              <p>Obtendo dados...</p>
            </div>
          ) : vendedores.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="p-4 bg-muted rounded-full mb-4">
                <ListTodo className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-lg font-medium">Nenhum vendedor encontrado</p>
              <p className="text-sm">Os dados aparecerão aqui quando cadastrados.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {vendedores.map((vendedor) => (
                <div 
                  key={vendedor.id} 
                  onClick={() => selecionarVendedor(vendedor.id)}
                  className={cn(
                    "group flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-accent/5 task-item-enter"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className={cn(
                      "text-lg transition-all duration-300 font-body",
                      "text-foreground"
                    )}>
                      {vendedor.nome}
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
