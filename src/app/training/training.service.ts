import { Subject } from 'rxjs/Subject';
import { Exercise } from './exercise.model';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class TrainingService {
    // new Subject which will eventually hold a payload of type 'Exercise'.
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private exercises: Exercise[] = [];

    constructor(private db: AngularFirestore) { }

    // Changed to private method 'private availableExercises'. added a helper method below to access it
    fetchAvailableExercises() {
        this.db
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
            // received exercises from Firestore
            .subscribe((exercises: Exercise[]) => {
                this.availableExercises = exercises;
                // emit next - emitting an array with all the available exercises. New array with a spread operator to create a copy so we dont pass the original array for mutability reasons
                this.exercisesChanged.next([...this.availableExercises])
            });
    };

    startExercise(selectedId: string) {
        const selectedExercise = this.availableExercises.find(
            exercise => exercise.id === selectedId
        );
        this.runningExercise = selectedExercise;

        this.exerciseChanged.next({ ...this.runningExercise })
    };

    completeExercise() {
        this.exercises.push({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null)
    }

    cancelExercise(progress: number) {
        this.exercises.push({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null)
    }

    getRunningExercise() {
        return { ...this.runningExercise }
    }
    getCompletedOrCancelledExercises() {
        return this.exercises.slice()
    }
}