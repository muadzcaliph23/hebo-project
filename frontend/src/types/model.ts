export interface Model {
  id: number;
  alias: string;
  model: string;
  apiKey?: string;
  endpoint?: string;
  routing?: string;
  strategy?: string;
  createdAt: string | Date;
}
