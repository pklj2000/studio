"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  where,
  onSnapshot, 
  query, 
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { firebasehoje } from "@/lib/firebase-data";
import { ReactServerDOMTurbopackClient } from "next/dist/server/route-modules/app-page/vendored/ssr/entrypoints";

interface Cliente {
  id: string;
  nome: string;
  idVendedor: string;
  ordem: number;  
  atendido: boolean;
}

export function ListaCliente() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataRef, setDataRef] = useState("");
  const router = useRouter();
  

  useEffect(() => {

    var idVendedor = localStorage.getItem("idVendedor")?.toString().replaceAll('"','') ?? "";  
    var dataCorrente = localStorage.getItem("vendasData")?.toString().replaceAll('"','') ?? "";  

    setDataRef(dataCorrente);

    if(idVendedor == null) return;
    const q = query(collection(db, "cliente"), where("idVendedor", "==", idVendedor));
    const unsubscribeClientes = onSnapshot(q, (snapshot) => {
      const clienteList: Cliente[] = [];
      snapshot.forEach((doc) => {
        console.log("clienteList", doc.data() as Cliente);
        clienteList.push({ id: doc.id, ...doc.data() } as Cliente);
      });
      
      setClientes(clienteList);
      setLoading(false);
    });

    console.log("cli", idVendedor);
    console.log("cli", dataCorrente);

    const v = query(collection(db, "venda"),
    where("data", "==", dataCorrente), 
    //where("idVendedor", "==", idVendedor)
    );
    const unsubscribeVendas = onSnapshot(v, (snapshot) => {
      const vendaList: Venda[] = [];
      snapshot.forEach((doc) => {
        vendaList.push({ id: doc.id, ...doc.data() } as Venda);
      });
      console.log("vendaList", vendaList);
      setVendas(vendaList);
      setLoading(false);
    });

    return () => {
      unsubscribeClientes();
      unsubscribeVendas();
    };
  }, []);
  
  const selecionarCliente = (id: string) => {
    console.log("selecionarCliente", id);
    localStorage.removeItem("idProduto")
    localStorage.setItem("idCliente", id);
    router.push("/vendas-prod");
  }
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">Clientes</h1>
      </div>

      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
            <div className="divide-y divide-border">
              {clientes.map((cliente) => (
                <div 
                  key={cliente.id} 
                  className={cn(
                    "group flex items-center justify-between p-4 transition-all hover:bg-accent/5 task-item-enter"
                  )}
                >
                  <div 
                    onClick={() => selecionarCliente(cliente.id)}
                    className="flex flex-wrap items-center gap-x-4 gap-y-0">
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
                      <div className="basis-full">                    
                        {vendas.map((item, index) => (
                          <><span className="text-sm">{item.descProduto}</span><br/></>
                        ))}
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