import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AngularFireAuth } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';

@Injectable()
// This service allows us to fake a user login, inform other parts of the app about the login
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;
    private user: User;

    constructor(
        private router: Router,
        private afauth: AngularFireAuth,
        private trainingService: TrainingService,
        snackbar: MatSnackBar
    ) { }

    registerUser(authData: AuthData) {
        this.afauth.auth
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
        this.isAuthSuccessfully();
    }

    login(authData: AuthData) {
        this.afauth.auth
            .signInWithEmailAndPassword(
                authData.email,
                authData.password
            ).then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log(error)
            })
        this.isAuthSuccessfully();
        // this.user = {
        //     email: authData.email,
        //     // fake random userId until the server is implemented
        //     userId: Math.round(Math.random() * 10000).toString()
        // };
    }
    logout() {
        this.trainingService.cancelSubscriptions()
        this.afauth.auth.signOut()
        this.authChange.next(false);
        this.router.navigate(['/login'])
        this.isAuthenticated = false
    }

    isAuth() {
        return this.isAuthenticated
    }

    private isAuthSuccessfully() {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }
}
