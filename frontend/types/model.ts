export interface Model {
  id: number;
  alias: string;
  model: string;
  strategy?: string;
  apiKey?: string;
  endpoint?: string;
  routing?: string;
  createdAt: Date;
}
