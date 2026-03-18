"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CheckCircle2, ListTodo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Cliente {
  id: string;
  nome: string;
  vendedor: string;
  ordem: number;  
  atendido: boolean;
}

export function ListaCliente() {
  const [tasks, setTasks] = useState<Cliente[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "cliente"), orderBy("nome", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList: Cliente[] = [];
      snapshot.forEach((doc) => {
        taskList.push({ id: doc.id, ...doc.data() } as Cliente);
      });
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-headline font-bold tracking-tight text-foreground">Clientes</h1>
      </div>

      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary/40" />
              <p>Syncing your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <div className="p-4 bg-muted rounded-full mb-4">
                <ListTodo className="w-10 h-10 opacity-20" />
              </div>
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm">Start by adding a new task above.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {tasks.map((task) => (
                <div 
                  key={task.id} 
                  className={cn(
                    "group flex items-center justify-between p-4 transition-all hover:bg-accent/5 task-item-enter"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Checkbox
                      checked={task.atendido}                      
                      className="w-5 h-5 border-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-colors"
                    />
                    <span className={cn(
                      "text-lg transition-all duration-300 font-body",
                      task.atendido ? "task-completed" : "text-foreground"
                    )}>
                      {task.nome}
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