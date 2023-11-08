export type Frame = {
  id: string;
  name: string;
  date: string;
  data: Record<string, Virtue>;
};

export type Virtue = {
  tagLine: string;
  log: number[];
};

// TODO: Put this all in one api.ts file.
