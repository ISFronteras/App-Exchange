import { Component, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Plataform } from '../../interfaces/plataform';
import { Rate } from '../../interfaces/rate';
import { PlataformBuySell } from 'src/app/interfaces/PlataformBuySell';


@Component({
  selector: 'app-plataform',
  templateUrl: './plataform.component.html',
  styleUrls: ['./plataform.component.scss']
})
export class PlataformComponent implements OnInit, AfterViewInit {


  exchangeRates: Rate[];
  plataforms: Plataform[];
  plataformsBuySell:PlataformBuySell[];


  constructor(private cdr: ChangeDetectorRef, private userService: UserService) { }

  ngOnInit() {
   this.getPlataforms();
   this.getChargeRates();
   this.getPlataformsBuySell();
  }


getChargeRates(){ this.userService.getExchangeRates()
  .subscribe((rates: Rate[]) => {
    this.exchangeRates = rates;
  }, error => console.error(error));}

getPlataforms(){
  this.userService.getPlataforms()
  .subscribe((plataforms: Plataform[]) => {
    this.plataforms = plataforms;  
  },error => console.error(error));

}

getPlataformsBuySell(){
  this.userService.getPlataformsBuySell()
  .subscribe((plataformsBuySell: PlataformBuySell[]) => {
    this.plataformsBuySell = plataformsBuySell;  
  },error => console.error(error));

}


  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }



}
