export interface GetHandoverMemosRequest {
  date: string;
}

export interface HandoverMemoCreatedBy {
  userId: number;
  name: string;
}

export interface HandoverMemo {
  memoId: number;
  content: string;
  createdBy: HandoverMemoCreatedBy;
  createdAt: string;
  expiresAt?: string;
}

export interface GetHandoverMemosResponse {
  date: string;
  memoCount: number;
  memos: HandoverMemo[];
}

export interface CreateHandoverMemoRequest {
  content: string;
}

export interface CreateHandoverMemoResponse {
  memoId: number;
  content: string;
  createdBy: HandoverMemoCreatedBy;
  createdAt: string;
  expiresAt: string;
}

export interface DeleteHandoverMemoRequest {
  memoId: number;
}

export type DeleteHandoverMemoResponse = null;
