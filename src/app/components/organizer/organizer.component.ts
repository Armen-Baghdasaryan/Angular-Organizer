import { Component, OnInit } from '@angular/core';
import { DateService } from 'src/app/shared/date.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Task, TasksService } from 'src/app/shared/tasks.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.scss'],
})
export class OrganizerComponent implements OnInit {
  form: FormGroup;
  tasks: Task[] = [];

  constructor(
    public dateSercive: DateService,
    public taskService: TasksService
  ) {
    this.form = new FormGroup({});
  }

  ngOnInit(): void {
    this.dateSercive.date
      .pipe(switchMap((value) => this.taskService.load(value)))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });

    this.form = new FormGroup({
      title: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }

  submit() {
    const { title } = this.form.value;
    const task: Task = {
      title,
      completed: false,
      date: this.dateSercive.date.value.format('DD-MM-YYYY'),
    };

    this.taskService.create(task).subscribe(
      (task) => {
        this.tasks.push(task);
        this.form.reset();
        this.taskService.tasks.push(task);

        console.log(this.taskService.tasks);
      },
      (err) => console.error(err)
    );
  }

  handleToggle(task: Task) {
    this.tasks.map((item): any => {
      if (item.id === task.id) {
        this.taskService
          .ubdate({ ...item, completed: !item.completed })
          .subscribe(
            () => {
              item.completed = !item.completed;
            },
            (err) => console.error(err)
          );
      }
    });
  }

  remove(task: Task) {
    this.taskService.remove(task).subscribe(
      () => {
        this.tasks = this.tasks.filter((task) => task.id !== task.id);
        // this.taskService.tasks.filter((task) => task.id !== task.id);
        console.log(this.taskService.tasks);
      },
      (err) => console.error(err)
    );
  }
}
