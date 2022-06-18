export interface Todo {
  id: number,
  name: string,
  description: string,
  dueDate: string,
  isDone: boolean;

  isExpired?: boolean;
  willExpireHours?: number;
}
