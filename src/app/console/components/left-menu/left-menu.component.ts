import { Component, OnInit,EventEmitter, Input, Output } from '@angular/core';
import { onSideNavChange, animateText } from '../../animations/animations';
import { SidenavService } from '../../services/sidenav.service'
import { MatSidenav } from '@angular/material';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-left-menu',
  templateUrl: './left-menu.component.html',
  styleUrls: ['./left-menu.component.css'],
  animations: [onSideNavChange, animateText]
})
export class LeftMenuComponent implements OnInit {

  @Input('sidenav') sidenav: MatSidenav;
 @Input('currentUser') currentUser: User;

  @Output() view = new EventEmitter<String>();
  @Output() logout = new EventEmitter<boolean>();


  public sideNavState: boolean = true;
  public linkText: boolean = true;


  constructor(private _sidenavService: SidenavService) { 
 

  }

  ngOnInit() {
   


  }

  changeView(view: String) {
    this.view.emit(view);
  }

  emitLogout(e: boolean) {
    this.logout.emit(e);
  }

  onSinenavToggle() {
    this.sideNavState = !this.sideNavState
    
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200)
    this._sidenavService.sideNavState$.next(this.sideNavState)
  }

}