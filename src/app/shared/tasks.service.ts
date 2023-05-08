import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface Task {
  id?: string;
  title: string;
  date?: string;
  key?: any;
  completed?: boolean;
}

interface CreateResponse {
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  static url =
    'https://angular-calendar-7792b-default-rtdb.europe-west1.firebasedatabase.app/tasks';

  tasks: Task[] = [];

  constructor(private http: HttpClient) {}

  load(date: moment.Moment): Observable<Task[]> {
    return this.http
      .get<Task[]>(`${TasksService.url}/${date.format('DD-MM-YYYY')}.json`)
      .pipe(
        map((tasks: any) => {
          if (!tasks) {
            return [];
          }
          return Object.keys(tasks).map((key) => ({ ...tasks[key], id: key }));
        })
      );
  }

  loadAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${TasksService.url}.json`).pipe(
      map((tasks: any) => {
        if (!tasks) {
          return [];
        }
        return this.tasks = Object.keys(tasks).map((key) => ({ ...tasks[key], id: key }));
      })
    );
  }

  create(task: Task): Observable<Task> {
    return this.http
      .post<CreateResponse>(`${TasksService.url}/${task.date}.json`, task)
      .pipe(
        map((res) => {
          return {
            ...task,
            id: res.name,
          };
        })
      );
  }

  ubdate(task: Task): Observable<void> {
    return this.http.put<void>(
      `${TasksService.url}/${task.date}/${task.id}.json`,
      task
    );
  }

  remove(task: Task): Observable<void> {
    return this.http.delete<void>(
      `${TasksService.url}/${task.date}/${task.id}.json`
    );
  }
}
