import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Todo } from '../interfaces/todo';
import { dataIsInPast } from '../utils/date-is-in-past';
import { getTimeRemaining } from '../utils/get-time-remaining';

type ApiResponse<T> = {
  data: any[T],
  jsonapi: any
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private url = 'https://auto.loanvantage360.com/fps/api'

  public todoList: BehaviorSubject<Todo[] | []> = new BehaviorSubject(null)

  constructor(
    private http: HttpClient
  ) {}

  public getTodosList(): Observable<Todo[]> {
    return this.todoList.getValue()
      ? this.todoList.asObservable()
      : this._getTodosListFromApi()
  }

  private _getTodosListFromApi(): Observable<Todo[]> {
    return this.http.get<ApiResponse<Todo>>(`${this.url}/todo`)
      .pipe(
        map(({ data }) => {
          return data.map((item: Todo) => {
            const timeRemaining = getTimeRemaining(item.dueDate);

            return {
              ...item,
              isExpired: dataIsInPast(new Date(item.dueDate)),
              willExpireHours: timeRemaining.hours + (timeRemaining.days * 24)
            }
          })
          .sort((a,b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime())
        }),
        tap((todos: Todo[]) => this.todoList.next(todos)),
        take(1)
      )
  }

  private _doRefetchTodosLogic(obs$: Observable<any>) {
    return obs$.pipe(
      take(1),
      switchMap(() => this._getTodosListFromApi())
    )
  }

  public createTodoItem(data): Observable<Todo[]> {
    return this._doRefetchTodosLogic(
      this.http.post<ApiResponse<number>>(`${this.url}/todo`, data)
    )
  }

  public updateTodoItem(data): Observable<Todo[]> {
    return this._doRefetchTodosLogic(
      this.http.put<ApiResponse<number>>(`${this.url}/todo`, data)
    )
  }

  public deleteTodoItem(id): Observable<Todo[]> {
    return this._doRefetchTodosLogic(
      this.http.delete<ApiResponse<number>>(`${this.url}/todo/${id}`)
    )
  }
}
