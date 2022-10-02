import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore, AngularFirestoreCollection} from '@angular/fire/compat/firestore';
import {Observable, of} from 'rxjs';
import IUser from '../models/user.model';
import {delay, map, filter, switchMap} from 'rxjs/operators'
import {ActivatedRoute, Router, NavigationEnd} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public isAuthenticated$: Observable<boolean>;
  public isAuthenticatedWithDelay$: Observable<boolean>;
  private usersCollection: AngularFirestoreCollection<IUser>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users')
    this.isAuthenticated$ = auth.user.pipe(
      map(user => !!user)
    );
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    );
    // to get the router's data outside the <router-outlet> component/module
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => this.route.firstChild),
      switchMap(route => route?.data ?? of({}))
    ).subscribe(data => {
      this.redirect = data['authOnly'] ?? false;
    });
  }

  public async createUser(userData: IUser) {
    if (!userData.password) {
      throw new Error("Password not provided!")
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      userData.email, userData.password
    )

    if (!userCred.user) {
      throw new Error("User can't be found")
    }

    await this.usersCollection.doc(userCred.user.uid).set({
      name: userData.name,
      email: userData.email,
      age: userData.age,
      phoneNumber: userData.phoneNumber
    })

    await userCred.user.updateProfile({
      displayName: userData.name
    })
  }

  public async logout($event?: Event) {
    if ($event) $event.preventDefault();
    await this.auth.signOut();
    if (this.redirect) {
      // navigateByUrl return a Promise thus used await to resolve the value from it
      await this.router.navigateByUrl("/");
    }
  }

}
