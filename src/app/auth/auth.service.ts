import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs/Subject';

// This service allows us to fake a user login, inform other parts of the app about the login
export class AuthService {
    authChange = new Subject<boolean>();
    private user: User;
    registerUser(authData: AuthData) {
        this.user = {
            email: authData.email,
            // fake random userId until the server is implemented
            userId: Math.round(Math.random() * 10000).toString()
        };
        this.authChange.next(true);
    }

    login(authData: AuthData) {
        this.user = {
            email: authData.email,
            // fake random userId until the server is implemented

            userId: Math.round(Math.random() * 10000).toString()
        };
        this.authChange.next(true);
    }
    logout() {
        this.user = null;
        this.authChange.next(false);
    }

    getUser() {
        // breaks the reference and returns a brand new user that has the same properties but it will be a different object

        return { ...this.user };
    }

    isAuth() {
        return this.user != null;
    }

}
