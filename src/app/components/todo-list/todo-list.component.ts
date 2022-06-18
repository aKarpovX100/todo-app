import { Component, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Todo } from 'src/app/interfaces/todo';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.scss']
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]> = this.api.todoList;
  loading = false;
  todosCompletion: {id: boolean} | {} = {};

  subs: Subscription[] = [];

  constructor(
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this._getAllTodos();
  }

  ngOnDestroy(): void {
    if (this.subs && this.subs.length > 0) {
      this.subs.forEach((sub: Subscription) => sub && sub.unsubscribe());
    }
  }

  private _doListenerWork(obs$: any) {
    this.loading = true;

    this.subs.push(
      obs$.subscribe(_ => this.loading = false, _ => this.loading = false)
    )
  }

  private _getAllTodos(): void {
    this._doListenerWork(
      this.api.getTodosList()
    );
  }

  public onToggleIsDoneStatus(todo: Todo) {
    const updatedTodo = {
      ...todo,
      isDone: !todo?.isDone
    }

    this._doListenerWork(
      this.api.updateTodoItem(updatedTodo)
    );
  }

  public onDeleteTodo(id: number) {
    this._doListenerWork(
      this.api.deleteTodoItem(id
      ))
  }

}
