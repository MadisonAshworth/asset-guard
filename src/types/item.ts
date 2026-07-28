export interface Item {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: "note" | "task";
  completed: boolean;
  deleted: boolean;
  synced: boolean;
  updatedAt: number;
}
