import { ListaMenu } from "@/components/lista-menu";

export default function MenuPage() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto">
        <ListaMenu />
      </div>
    </main>
  );
}
