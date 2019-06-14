import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable()
// This service allows us to fake a user login, inform other parts of the app about the login
export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;
    constructor(private router: Router) { }
    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            // fake random userId until the server is implemented
            userId: Math.round(Math.random() * 10000).toString()
        };
        this.isAuthSuccessfully();
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            // fake random userId until the server is implemented

            userId: Math.round(Math.random() * 10000).toString()
        };
        this.isAuthSuccessfully();

    }
    logout() {
        this.user = null;
        this.authChange.next(false);
        this.router.navigate(['/login'])

    }

    getUser() {
        // breaks the reference and returns a brand new user that has the same properties but it will be a different object

        return { ...this.user };
    }

    isAuth() {
        return this.user != null;
    }
    private isAuthSuccessfully() {
        this.authChange.next(true);
        this.router.navigate(['/training'])
    }
}
