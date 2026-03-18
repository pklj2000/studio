
import { ListaCliente } from "@/components/lista-clientes";

export default function VendasCliPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto">
        <ListaCliente />
      </div>
    </main>
  );
}
