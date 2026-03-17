import { SyncTaskApp } from "@/components/sync-task-app";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 md:px-0">
      <div className="max-w-2xl mx-auto">
        <SyncTaskApp />
      </div>
    </main>
  );
}