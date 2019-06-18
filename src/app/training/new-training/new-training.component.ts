
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})

export class NewTrainingComponent implements OnInit {
  exercises: Observable<Exercise[]>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises()
    // method above removed, angular fire implemented
    this.exercises = this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data()['name'],
            duration: doc.payload.doc.data()['duration'],
            calories: doc.payload.doc.data()['calories']
          }
        })
      })
    // .subscribe(result => {
    //   console.log(result);
    // });
  }
  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
