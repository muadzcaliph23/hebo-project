import { ExternalLink } from "lucide-react";
import { Card, CardHeader } from "@/components/ui/card";
import ModelDetails from "./components/ModelDetails";
import { useEffect, useState } from "react";
import AddOrEditModel from "./components/AddOrEditModel";
import { Skeleton } from "@/components/ui/skeleton";
import AddingDialog from "./components/AddingDialog";

const ModelPage = () => {
  const [editingModelId, setEditingModelId] = useState<number | null>(null);
  const handleEdit = (modelId: number) => {
    setEditingModelId((prev) => (prev === modelId ? null : modelId));
  };
  const [models, setModels] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/models`);
        if (!res.ok) throw new Error(`Failed: ${res.status}`);
        const data = await res.json();
        if (active) setModels(data);
      } catch (e: any) {
        if (active) setError(e?.message ?? "Failed to load models");
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <header className="mb-4">
        <h1 className="text-xl font-semibold text-gray-900">
          Model Configuration
        </h1>
        <p className="text-gray-600 mt-2">
          Configure access for agents to different models and their routing
          behaviour (incl. to your existing inference endpoints). Learn more
          about
          <a
            href="#"
            className="inline-flex items-center text-amber-700 hover:underline ml-1"
            title="Model Configuration docs"
          >
            Model Configuration
            <ExternalLink size={16} className="ml-1" />
          </a>
        </p>
      </header>

      <section className="space-y-4">
        {models.length > 0 && (
          <Card className="overflow-hidden">
            {loading && (
              <CardHeader className="flex flex-col justify-between py-2.5 space-y-7">
                {Array.from({ length: 2 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-6 w-full" />
                ))}
              </CardHeader>
            )}
            {error && <div className="p-4 text-sm text-red-600">{error}</div>}
            {models.map((m, idx) => (
              <div key={idx} className="w-full">
                <ModelDetails
                  editingModelId={editingModelId}
                  handleEdit={() => handleEdit(m.id)}
                  modelInfo={m}
                />
                <div
                  aria-expanded={editingModelId === m.id}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    editingModelId === m.id
                      ? "max-h-[2000px] opacity-100 translate-y-0"
                      : "max-h-0 opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <AddOrEditModel
                    modelInfo={m}
                    setEditingModelId={setEditingModelId}
                  />
                </div>
              </div>
            ))}
          </Card>
        )}
        <AddingDialog />
      </section>
    </div>
  );
};

export default ModelPage;
