"use client";

import React, { useState, useEffect } from "react";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, CheckCircle2, ListTodo, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  nome: string;
  completed: boolean;
  createdAt: any;
}

export function SyncTaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "cliente"), orderBy("nome", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList: Task[] = [];
      snapshot.forEach((doc) => {
        taskList.push({ id: doc.id, ...doc.data() } as Task);
      });
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    try {
      await addDoc(collection(db, "cliente"), {
        text: newTaskText.trim(),
        completed: false,
        createdAt: serverTimestamp(),
      });
      setNewTaskText("");
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const toggleTask = async (id: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, "cliente", id), {
        completed: !completed,
      });
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cliente", id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-headline font-bold tracking-tight text-foreground">SyncTask Pro</h1>
        <p className="text-muted-foreground font-body">Manage your day with real-time precision</p>
      </div>

      <Card className="border-none shadow-xl bg-card overflow-hidden">
        <CardHeader className="bg-primary/5 border-b border-primary/10">
          <form onSubmit={addTask} className="flex gap-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="What needs to be done?"
              className="bg-background border-none shadow-sm h-12 text-lg focus-visible:ring-primary"
            />
            <Button type="submit" size="lg" className="bg-primary hover:bg-primary/90 text-white px-6 h-12 shadow-lg transition-all active:scale-95">
              <Plus className="w-5 h-5 mr-1" />
              Add
            </Button>
          </form>
        </CardHeader>
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
                    "group flex items-center justify-between p-4 transition-all hover:bg-accent/5 task-item-enter",
                    task.completed && "bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id, task.completed)}
                      className="w-5 h-5 border-2 data-[state=checked]:bg-accent data-[state=checked]:border-accent transition-colors"
                    />
                    <span className={cn(
                      "text-lg transition-all duration-300 font-body",
                      task.completed ? "task-completed" : "text-foreground"
                    )}>
                      {task.nome}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        {tasks.length > 0 && (
          <div className="bg-muted/20 px-6 py-4 border-t flex justify-between items-center text-sm text-muted-foreground font-medium">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              Real-time sync active
            </div>
            <div>
              {completedCount} of {tasks.length} tasks completed
            </div>
          </div>
        )}
      </Card>
      
      <footer className="text-center text-sm text-muted-foreground font-body">
        <p>&copy; {new Date().getFullYear()} SyncTask Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}