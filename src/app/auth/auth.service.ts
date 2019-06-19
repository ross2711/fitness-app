import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';

@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService
    ) { }

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                // if we are swithcing to authenticated...
                // set authenticated = true
                this.isAuthenticated = true;
                // we will emit an event
                this.authChange.next(true);
                // we will redirect to training
                this.router.navigate(['/training']);
            } else {
                // else we will cancel subscriptions
                this.trainingService.cancelSubscriptions();
                // we will emit an event
                this.authChange.next(false);
                // we will redirect to the login screen
                this.router.navigate(['/login']);
                // set authenticated = false
                this.isAuthenticated = false;
            }
        })
    }

    registerUser(authData: AuthData) {
        this.afAuth.auth
            .createUserWithEmailAndPassword(
                authData.email,
                authData.password
            )
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log(error)
            })
    }

    login(authData: AuthData) {
        this.afAuth.auth
            .signInWithEmailAndPassword(
                authData.email,
                authData.password
            ).then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log(error)
            })
        // this.user = {
        //     email: authData.email,
        //     // fake random userId until the server is implemented
        //     userId: Math.round(Math.random() * 10000).toString()
        // };
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated
    }


}
