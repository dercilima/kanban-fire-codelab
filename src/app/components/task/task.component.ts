import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from './task.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {

  @Input()
  task?: Task;

  @Output()
  edit = new EventEmitter<Task>();

  editTask(task: Task) {
    this.edit.emit(task);
  }
}
