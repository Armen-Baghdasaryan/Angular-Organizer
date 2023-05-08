import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { DateService } from 'src/app/shared/date.service';
import { Task, TasksService } from 'src/app/shared/tasks.service';

interface Day {
  value: moment.Moment;
  active: boolean;
  disabled: boolean;
  selected: boolean;
}

interface Week {
  days: Day[];
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  calendar: Week[] = [];
  tasks: Task[] = [];

  constructor(
    private dateService: DateService,
    public tasksService: TasksService
  ) {}

  ngOnInit(): void {
    this.dateService.date.subscribe(this.generate.bind(this));
    this.tasksService.loadAllTasks().subscribe(
      () => {
        this.tasks = this.tasksService.tasks;
      },
      (err) => console.error(err)
    );
  }

  hasTask(date: moment.Moment): boolean {
    return this.tasks.some(
      (task: Task) => task.id === date.format('DD-MM-YYYY')
    );
  }

  generate(now: moment.Moment) {
    const startDay = now.clone().startOf('month').startOf('week');
    const endDay = now.clone().endOf('month').endOf('week');
    const date = startDay.clone().subtract(1, 'day');
    const calendar = [];

    while (date.isBefore(endDay, 'day')) {
      calendar.push({
        days: Array(7)
          .fill(0)
          .map(() => {
            const value = date.add(1, 'day').clone();
            const active = moment().isSame(value, 'date');
            const disabled = !now.isSame(value, 'month');
            const selected = now.isSame(value, 'date');

            return {
              value,
              active,
              disabled,
              selected,
            };
          }),
      });
    }

    this.calendar = calendar;
  }

  select(day: moment.Moment) {
    this.dateService.changeDate(day);
  }
}
