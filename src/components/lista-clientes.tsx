
"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  where,
  onSnapshot, 
  query, 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface ListaClienteProps {
  onSelect?: (id: string) => void;
}

export function ListaCliente({ onSelect }: ListaClienteProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const idVendedorRaw = localStorage.getItem("idVendedor");
    const idVendedor = idVendedorRaw?.toString().replaceAll('"', '') ?? "";

    if (!idVendedor) return;
    
    const q = query(collection(db, "cliente"), where("idVendedor", "==", idVendedor));
    const unsubscribeClientes = onSnapshot(q, (snapshot) => {
      const clienteList: Cliente[] = [];
      clienteList.push({ id: "*", nome: "Todos", idVendedor: "*", atendido: false, ordem: 0 } as Cliente);
      snapshot.forEach((doc) => {
        clienteList.push({ id: doc.id, ...doc.data() } as Cliente);
      });
      
      setClientes(clienteList);
      setLoading(false);
    });

    return () => {
      unsubscribeClientes();
    };
  }, []);
  
  const selecionarCliente = (id: string) => {
    if (onSelect) {
      onSelect(id);
    }
  };
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
            <div className="divide-y divide-border">
              {clientes.map((cliente) => (
                <div 
                  key={cliente.id} 
                  className={cn(
                    "group flex items-center justify-between p-4 cursor-pointer transition-all hover:bg-accent/5 task-item-enter"
                  )}
                  onClick={() => selecionarCliente(cliente.id)}
                >
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-0">
                      <div className="basis-50 items-center">
                        <Checkbox checked={cliente.atendido} className="w-5 h-5 border-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-colors"/>
                      </div>
                      <div className="basis-50">  
                        <span className={cn("text-lg transition-all duration-300 font-body",
                          cliente.atendido ? "task-completed" : "text-foreground"
                          )}>
                          {cliente.nome}
                        </span>
                      </div>  
                  </div>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
