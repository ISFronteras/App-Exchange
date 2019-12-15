import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {LeftMenuComponent} from './components/left-menu/left-menu.component';
import { TransferComponent } from './transfer/transfer.component';
import { WithdrawComponent } from './withdraw/withdraw.component';
import { UserComponent } from './user/user.component';
import { HistoricalComponent } from './historical/historical.component';
import { AdminComponent } from './admin/admin.component';

import { ConsoleRoutingModule } from './console-routing.module';
import { ConsoleComponent } from './console.component';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { SidenavService } from './services/sidenav.service'
import { SharedModule } from '../shared/shared.module';
import { MAT_DATE_LOCALE } from '@angular/material';
import { ModalComponent } from './modal/modal.component';
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [TransferComponent, WithdrawComponent, UserComponent, HistoricalComponent, ConsoleComponent, SidenavListComponent, AdminComponent, ModalComponent,HeaderComponent,LeftMenuComponent],
  imports: [
    CommonModule,
    ConsoleRoutingModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' },
    SidenavService
  ],
  entryComponents: [ModalComponent]
})
export class ConsoleModule { }
