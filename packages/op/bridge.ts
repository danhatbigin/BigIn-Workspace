import type { Entry, Snapshot, Task } from '../domain/time';
export type User = { id: number; name: string };
export type WriteOutcome = { clientId: string; date: string; status: 'saved' | 'failed' | 'uncertain'; message: string; entry?: Entry };
export type BatchSaveResult = { outcomes: WriteOutcome[] };
export type LiveData = { snapshot: Snapshot; partial: boolean; warning: string; from: string; to: string };
export type ApiResult<T> = { ok:true; value:T } | { ok:false; error:string; kind:string };
export type DesktopApi = {
  status(): Promise<ApiResult<{ connected:boolean; user?:User; server:string }>>;
  connect(token:string): Promise<ApiResult<User>>;
  disconnect(): Promise<ApiResult<null>>;
  load(from:string,to:string): Promise<ApiResult<LiveData>>;
  search(query:string,projectId?:number): Promise<ApiResult<Task[]>>;
  write(entries:Entry[]): Promise<ApiResult<BatchSaveResult>>;
  resolve(clientIds:string[]): Promise<ApiResult<{ resolved:number }>>;
};
export type LiveSession = {
  data:LiveData; user:User; busy:boolean; warning:string;
  load(from:string,to:string):void; refresh():void; disconnect():void;
  search(query:string,projectId?:number):Promise<Task[]>;
  write(entries:Entry[]):Promise<BatchSaveResult>;
  resolve(clientIds:string[]):Promise<number>;
};
