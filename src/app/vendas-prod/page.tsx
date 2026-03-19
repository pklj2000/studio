
import { ListaProdutos } from "@/components/lista-produtos";

export default function VendasCliPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto">
        <ListaProdutos />
      </div>
    </div>
  );
}
