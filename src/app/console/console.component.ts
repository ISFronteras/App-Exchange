import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { User } from '../interfaces/user';
import { onMainContentChange } from './animations/animations';
import { Subscription } from 'rxjs';
import { SidenavService } from './services/sidenav.service';
@Component({
  selector: 'app-console',
  templateUrl: './console.component.html',
  styleUrls: ['./console.component.scss'],
  animations: [ onMainContentChange ]
})
export class ConsoleComponent implements OnInit, OnDestroy {

  public currentUser: User;
  public userSubscription: Subscription;
  public authSubscription: Subscription;
  public onSideNavChange: boolean;
  view = 'userView';

  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router,
    private ngZone: NgZone,
    private _sidenavService: SidenavService
  ) { 

    this._sidenavService.sideNavState$.subscribe( res => {
      console.log(res)
      this.onSideNavChange = res;
    })
  }

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
    this.userSubscription.unsubscribe();
    if (e) {
      this.ngZone.run(() => {
        this.router.navigate(['/landing/login']);
      });
      this.authenticationService.logOut();
      console.log('Sesión cerrada.');
    }
  }

  ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }

}
