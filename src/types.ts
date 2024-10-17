export interface TodoItem {
    id: number;
    tenantId: string;
    name: string;
    memo?: string;
    imageUrl?: string;
    isCompleted: boolean;
  }
