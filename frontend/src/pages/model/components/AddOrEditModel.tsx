import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  automaticRoutingModes,
  modelTypes,
  strategyRoutingModes,
} from "@/lib/constants";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { Check, Copy, Eye, EyeOff, Loader2 } from "lucide-react";
import type { Model } from "@/types/model";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface AddOrEditProps {
  modelInfo?: Model;
  setEditingModelId?: (value: React.SetStateAction<number | null>) => void;
}

const modelSchema = z
  .object({
    alias: z.string().min(1, "Alias is required"),
    model: z.enum(["Voyage Large 3", "Voyage", "Llama 4 Scout"]),
    routing: z.enum(["Cheapest", "Premium"]).optional(),
    strategy: z.enum(["auto", "custom"], {
      required_error: "You must choose a strategy",
    }),
    endpoint: z
      .string()
      .url("Must be a valid URL")
      .optional()
      .or(z.literal("")), // allow empty string
    apiKey: z.string().optional().or(z.literal("")), // allow empty string
  })
  .superRefine((val, ctx) => {
    const hasRouting = !!val.routing;
    const hasCustomFields = !!val.endpoint || !!val.apiKey;

    // Case 1: Auto strategy but missing routing
    if (val.strategy === "auto" && !hasRouting) {
      ctx.addIssue({
        path: ["routing"],
        code: z.ZodIssueCode.custom,
        message: "Routing is required when using automatic strategy",
      });
    }

    // Case 2: Auto strategy but endpoint/apiKey present
    if (val.strategy === "auto" && hasCustomFields) {
      ctx.addIssue({
        path: ["endpoint"],
        code: z.ZodIssueCode.custom,
        message:
          "Endpoint and API Key must be empty when using automatic strategy",
      });
    }

    // Case 3: Custom strategy but missing endpoint/apiKey
    if (val.strategy === "custom" && (!val.endpoint || !val.apiKey)) {
      ctx.addIssue({
        path: ["endpoint"],
        code: z.ZodIssueCode.custom,
        message:
          "Both Endpoint and API Key are required when using custom strategy",
      });
    }

    // Case 4: Custom strategy but routing provided
    if (val.strategy === "custom" && hasRouting) {
      ctx.addIssue({
        path: ["routing"],
        code: z.ZodIssueCode.custom,
        message: "Routing must be empty when using custom strategy",
      });
    }
  });

const AddOrEditModel = ({ modelInfo, setEditingModelId }: AddOrEditProps) => {
  const isAdding = !modelInfo;
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const [form, fields] = useForm({
    id: "model-form",
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: modelSchema });
    },
    defaultValue: {
      alias: modelInfo?.alias,
      model: modelInfo?.model,
      routing: modelInfo?.routing,
      endpoint: modelInfo?.endpoint,
      apiKey: modelInfo?.apiKey,
      strategy: modelInfo?.strategy,
    },
  });

  const [loading, setLoading] = useState(false);
  const [loadingRemove, setLoadingRemove] = useState(false);
  const [strategy, setStrategy] = useState(modelInfo?.strategy);
  const [apiKey, setApiKey] = useState<string | undefined>(
    modelInfo?.apiKey ?? undefined
  );
  const [endpoint, setEndpoint] = useState<string | undefined>(
    modelInfo?.endpoint ?? undefined
  );
  const [routing, setRouting] = useState<string | undefined>(
    modelInfo?.routing ?? undefined
  );
  const [copy, setCopy] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(apiKey ?? "");
      setCopy(true);
    } catch (e) {
      console.error("Cannot copy text", e);
      setCopy(false);
    }
  };

  const [viewApi, setViewApi] = useState(false);
  const handleViewApi = () => {
    setViewApi((prev) => !prev);
  };

  useEffect(() => {
    if (strategy === "auto") {
      setApiKey(undefined);
      setEndpoint(undefined);
    } else if (strategy === "custom") {
      setRouting(undefined);
    }
  }, [strategy]);

  const handleCancel = () => {
    setEditingModelId?.(null);
  };

  const handleDelete = async () => {
    if (isAdding || !modelInfo) return;
    setLoadingRemove(true);

    const res = await fetch(`${baseUrl}/api/models`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: modelInfo.id }),
    });
    if (!res.ok) {
      toast.error("An Error occurred", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Contact Help",
          onClick: () => console.log("Help"),
        },
      });
      return;
    }

    setTimeout(() => {
      toast.success("Model deleted successfully", {
        description: "Sunday, December 03, 2023 at 9:00 AM",
      });
      setLoadingRemove(false);
    }, 2000);

    setTimeout(() => {
      window.location.reload();
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formEl = e.currentTarget;
    const formData = new FormData(formEl);

    formData.set("strategy", strategy || "");
    formData.set("routing", routing || "");
    formData.set("endpoint", endpoint || "");
    formData.set("apiKey", apiKey || "");

    // run zod validation
    const result = parseWithZod(formData, { schema: modelSchema });

    if (result.status !== "success") {
      const errors = [
        result.error?.alias,
        result.error?.model,
        result.error?.routing,
        result.error?.strategy,
        result.error?.endpoint,
        result.error?.apiKey,
      ];
      toast.error("Form validation failed", {
        description: errors.join("\n"),
      });

      return;
    }
    const entries = Object.fromEntries(formData.entries());

    const payload = {
      id: modelInfo?.id,
      alias: entries.alias as string,
      model: entries.model as string,
      strategy: entries.strategy as string,
      routing: entries.routing || undefined,
      endpoint: entries.endpoint || undefined,
      apiKey: entries.apiKey || undefined,
    };

    setLoading(true);

    try {
      const method = isAdding ? "POST" : "PUT";
      const res = await fetch(`${baseUrl}/api/models`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Request failed");
      }

      toast.success(`Model ${isAdding ? "added" : "updated"} successfully`, {
        description: "Sunday, December 03, 2023 at 9:00 AM",
      });
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    } catch (err) {
      console.error(err);
      toast.error(`An error occured. Please contact us for assistance.`, {
        description: "Sunday, December 03, 2023 at 9:00 AM",
        action: {
          label: "Contact Help",
          onClick: () => console.log("Help"),
        },
      });
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <CardContent className="space-y-4 font-medium animate-in transition-all duration-1000 translate-y-3 ease-in border-t py-10 border-gray-100">
      <form id={form.id} onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-2">
          <div className="flex flex-col gap-1">
            <Label
              htmlFor={fields.alias.id}
              className="font-medium text-gray-700"
            >
              Alias
            </Label>
            <Input
              id={fields.alias.id}
              name={fields.alias.name}
              defaultValue={fields.alias.initialValue}
              aria-invalid={fields.alias.errors ? true : undefined}
              aria-describedby={
                fields.alias.errors ? `${fields.alias.id}-error` : undefined
              }
            />
            {fields.alias.errors && (
              <p
                id={`${fields.alias.id}-error`}
                className="text-xs text-red-600"
              >
                {fields.alias.errors[0]}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label
              htmlFor={fields.model.id}
              className="text-gray-700 font-medium"
            >
              Type
            </Label>
            <Select
              name={fields.model.name}
              defaultValue={fields.model.initialValue}
              aria-invalid={fields.model.errors ? true : undefined}
              aria-describedby={
                fields.model.errors ? `${fields.model.id}-error` : undefined
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a model" />
              </SelectTrigger>
              <SelectContent>
                {modelTypes.map((model) => (
                  <SelectItem key={model.value} value={model.value}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {fields.model.errors && (
              <p
                id={`${fields.model.id}-error`}
                className="text-xs text-red-600"
              >
                {fields.model.errors[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between w-full pl-1.5">
          <RadioGroup
            name={fields.strategy.name}
            className="flex flex-col w-1/3 gap-6"
            value={strategy}
            onValueChange={(value) => setStrategy(value)}
          >
            {strategyRoutingModes.map((str, idx) => (
              <div className="flex items-center space-x-2" key={idx}>
                <RadioGroupItem value={str.value} id={str.value} />
                <Label htmlFor={str.value}>{str.name}</Label>
              </div>
            ))}
          </RadioGroup>

          <div className="flex flex-col gap-3 w-2/3">
            <Select
              name={fields.routing?.name}
              disabled={strategy == "custom"}
              value={routing}
              onValueChange={(value) => setRouting(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose routing" />
              </SelectTrigger>
              <SelectContent>
                {automaticRoutingModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              id={fields.endpoint?.id}
              name={fields.endpoint?.name}
              placeholder="https://"
              disabled={strategy == "auto"}
              value={endpoint ?? ""}
              onChange={(e) => setEndpoint(e.target.value)}
            />
            {fields.endpoint?.errors && (
              <p
                id={`${fields.endpoint.id}-error`}
                className="text-xs text-red-600"
              >
                {fields.endpoint.errors[0]}
              </p>
            )}
            <div className="flex items-center">
              <Input
                id={fields.apiKey?.id}
                name={fields.apiKey?.name}
                placeholder="API Key"
                disabled={strategy == "auto"}
                value={apiKey ?? ""}
                onChange={(e) => setApiKey(e.target.value)}
                type={viewApi ? "text" : "password"}
              />
              <button
                type="button"
                onClick={handleViewApi}
                className={`text-gray-500 hover:text-gray-700 ${
                  apiKey ? "ml-2" : "ml-0"
                } transition-all ease-in-out duration-300`}
                aria-label="Copy path"
                title="Copy"
              >
                {apiKey && (viewApi ? <Eye size={16} /> : <EyeOff size={16} />)}
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className={`text-gray-500 hover:text-gray-700 ${
                  apiKey ? "ml-2" : "ml-0"
                } transition-all ease-in-out duration-300`}
                aria-label="Copy path"
                title="Copy"
              >
                {apiKey && (copy ? <Check size={16} /> : <Copy size={16} />)}
              </button>
            </div>
            {fields.apiKey?.errors && (
              <p
                id={`${fields.apiKey.id}-error`}
                className="text-xs text-red-600"
              >
                {fields.apiKey.errors[0]}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Button
            type="button"
            className="text-red-600"
            variant="outline"
            size="sm"
            onClick={handleDelete}
          >
            Remove
            {loadingRemove && (
              <Loader2
                strokeWidth={3.5}
                className="mr-1 h-4 w-4 animate-spin"
              />
            )}
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save
              {loading && (
                <Loader2
                  strokeWidth={3.5}
                  className="mr-1 h-4 w-4 animate-spin"
                />
              )}
            </Button>
          </div>
        </div>
      </form>
    </CardContent>
  );
};

export default AddOrEditModel;
