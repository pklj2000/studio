"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import DateScrollPicker from "@/components/ui/date-scroll-picker";
import { Button } from "@/components/ui/button";

export default function VendasDataPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleConfirm = () => {
    // Using 'vendasData' as key, and 'yyyy-MM-dd' as format.
    localStorage.setItem("vendasData", format(selectedDate, 'yyyy-MM-dd'));
    router.push("/vendas-cli");
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto space-y-8">
        <DateScrollPicker 
          initialDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />
        <Button 
          size="lg" 
          onClick={handleConfirm}
          className="w-full bg-primary hover:bg-primary/90 text-white h-14 shadow-lg transition-all active:scale-95 text-lg"
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
