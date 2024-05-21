import { Component, OnInit } from '@angular/core';
import { Task } from './components/task/task.model';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from './components/task-dialog/task-dialog.component';
import { TaskDialogResult } from './components/task-dialog/task-dialog-data.model';
import { Firestore, deleteDoc, doc, getDocs, updateDoc } from '@angular/fire/firestore';
import { CollectionReference, addDoc, collection } from '@firebase/firestore';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  todo: Task[] = [];
  // todo$: Observable<Task[]>;
  inProgress: Task[] = [];
  done: Task[] = [];

  todoCollectionRef: CollectionReference;

  constructor(private dialog: MatDialog, private firestore: Firestore) {
    this.todoCollectionRef = collection(this.firestore, 'todo');
  }

  ngOnInit(): void {
    this.loadData();
  }

  private async loadData() {
    getDocs(this.todoCollectionRef).then(snapshot => {
      const data = snapshot.docs.map((doc) => {
        const value = doc.data();
        value['id'] = doc.id;
        return value;
      });
      this.todo = data as Task[];
    });
  }

  editTask(list: Task[], task: Task) {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: task,
        enableDelete: true
      }
    });
    dialogRef.afterClosed().subscribe((result: TaskDialogResult | null) => {
      if (!result) { return; }
      const dataList = list;
      const taskIndex = dataList.indexOf(task);
      if (result.delete) {
        //dataList.splice(taskIndex, 1);
        deleteDoc(doc(this.firestore, `todo/${task.id}`)).then(() => {
          this.loadData();
        });
      } else {
        // dataList[taskIndex] = task;
        updateDoc(doc(this.firestore, `todo/${task.id}`), {
          title: task.title,
          description: task.description
        }).then(() => {
          this.loadData();
        });
      }
    })
  }

  drop(event: CdkDragDrop<Task[], any, any>) {
    if (event.previousContainer === event.container) {
      return;
    }

    if (!event.container.data || !event.previousContainer.data) {
      return;
    }

    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex,
    )
  }

  newTask() {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '270px',
      data: {
        task: {}
      }
    });

    dialogRef.afterClosed().subscribe((result: TaskDialogResult | null) => {
      if (result?.task) {
        //this.todo.push(result.task);
        addDoc(this.todoCollectionRef, result.task).then(() => {
          this.loadData();
        });
      }
    });
  }

}
