import { Component, Inject } from '@angular/core';
import { Task } from '../task/task.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskDialogData } from './task-dialog-data.model';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.css'
})
export class TaskDialogComponent {
  private taskBkp: Partial<Task> = { ...this.data.task };
  
  constructor(
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TaskDialogData
  ) {
  }

  cancel() {
    this.data.task.title = this.taskBkp.title;
    this.data.task.description = this.taskBkp.description;
    this.dialogRef.close(this.data.task);
  }

}
