import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss']
})
export class ConsoleComponent implements OnInit {

  public currentUser: User;
  public userSubscription: Subscription;
  public authSubscription: Subscription;

  view = 'userView';

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.authSubscription = this.authenticationService.getStatus()
      .subscribe( user => {
        if (user.uid) {
          this.userSubscription = this.userService.getUserById(user.uid)
            .subscribe( (currentUser: User) => {
              this.currentUser = currentUser;
            }, error => console.error(error) )
        }
      }, error => console.error(error) );
  }

  changeView(view: string) {
    this.view = view;
  }

  emitLogout(e) {
    this.authSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
    this.authenticationService.logOut();
    if (e) {
      this.ngZone.run(() => {
        this.router.navigate(['/landing/login']);
      });
      console.log('Sesión cerrada.');
    }
  }
}
