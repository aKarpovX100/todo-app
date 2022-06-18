import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {

  form: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    description: new FormControl('', [Validators.maxLength(500)]),
    dueIn: new FormControl('', [Validators.required, Validators.min(0.001)]),
    isDone: new FormControl(false, [Validators.nullValidator])
  })

  loading = false;

  subs: Subscription[] = [];

  constructor(
    private api: ApiService,
  ) { }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.subs && this.subs.length > 0) {
      this.subs.forEach((sub: Subscription) => sub && sub.unsubscribe());
    }
  }

  public onSubmitForm() {
    this.loading = true;

    this.subs.push(
      this.api.createTodoItem({...this.form.value})
        .subscribe(() => {
          this.loading = false;
          this.form.reset();
        }, _ => {
          this.loading = false;
          alert('An error occured!');
        })
    )
  }

}
