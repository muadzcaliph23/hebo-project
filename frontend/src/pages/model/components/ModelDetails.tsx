"use client";
import { Check, Copy, SlidersHorizontal } from "lucide-react";
import { CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Model } from "@/types/model";
import { useState } from "react";

interface ModelDetailsProps {
  editingModelId?: number | null;
  handleEdit: () => void;
  modelInfo: Model;
}

const ModelDetails = ({
  editingModelId,
  handleEdit,
  modelInfo,
}: ModelDetailsProps) => {
  const modelPath = `gato/main/${modelInfo.alias}`;
  const [copy, setCopy] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(modelPath);
      setCopy(true);
    } catch (e) {
      console.error("Cannot copy text", e);
      setCopy(false);
    }
  };

  return (
    <CardHeader className="grid grid-cols-[1fr_1fr_auto] items-center">
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-900">{modelPath}</div>
        <button
          type="button"
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700"
          aria-label="Copy path"
          title="Copy"
        >
          {copy ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="text-sm text-gray-700 flex items-center">
        {modelInfo.model}
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-gray-600 w-[140px]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={14} />
          {modelInfo.strategy === "custom" ? "Custom" : modelInfo.routing}
        </div>
        <div className="gap-1 ml-2 w-[50px]">
          {editingModelId !== modelInfo.id && (
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </CardHeader>
  );
};

export default ModelDetails;
