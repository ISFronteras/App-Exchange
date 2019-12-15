import { Component, Input, OnInit, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../../services/user.service';

import { Account } from '../../interfaces/account';
import { Operation } from '../../interfaces/operation';
import { Plataform } from '../../interfaces/plataform';
import { User } from '../../interfaces/user';
import { Rate } from '../../interfaces/rate';
import { EmailService } from 'src/app/services/email.service';

// ES6 Modules or TypeScript
import swal from 'sweetalert2';

import { Subscription } from 'rxjs';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentUser: User;
  accountsSubscription: Subscription;
  @Output() view = new EventEmitter<String>();
  addAccount = false;
  accounts: Account[];
  exchangeRates: Rate[];
  exchangeRate: Rate;
  plataforms: Plataform[];
  currencies: string[] = [];
  registerAccountForm: FormGroup;
  withdrawForm: FormGroup;
  account: Account;
  toReceive = {
    amount: null,
    tax: null,
  }
  typeAccounts = {
    plataform: 'Monedero Electrónico',
    banking: 'Cuenta Bancaria'
  };
  accountTypes = [
    'Cuenta de Ahorro', 'Cuenta Corriente'
  ];

  messagesWithDraw = [
    'Retira dinero desde tu cuenta bancaria nacional a otra cuenta de otro país (moneda local a monera extranjera).',
    'Retira dinero desde un monedero electrónico a tu cuenta bancaria nacional (dólar a moneda local).',
    'Retira de tu monedero electrónico preferido hacia otros monederos u otras cuentas de amigos (dólar a otros medios).'
  ]

  messagesAddAccount = [
    'Debe registrar cuentas para poder realizar retiros',  
  ]

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private emailService:EmailService  
  ) { }

  ngOnInit() {
    this.buildWithdrawForm();
    this.getPlataforms();
    this.getExchangeRates();
  }

  ngOnChanges() {
    this.getAccounts();
  }

  buildWithdrawForm() {
    this.withdrawForm = this.formBuilder.group({
      originAccount: ['', Validators.required],
      amount: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,15})?$')
      ])],
      comment: ['', Validators.maxLength(200)],
      currency: ['', Validators.required]
    });
    this.onChanges();
  }

  get originAccount() {
    return this.withdrawForm.get('originAccount');
  }

  get amount() {
    return this.withdrawForm.get('amount');
  }

  get comment() {
    return this.withdrawForm.get('comment');
  }

  get currency() {
    return this.withdrawForm.get('currency');
  }

  getAccounts() {
    if (this.currentUser) {
      this.accountsSubscription = this.userService.getUserAccounts(this.currentUser.uid)
        .subscribe( (accounts: Account[]) => {
          this.accounts = accounts;
          if (!accounts.length) {
            swal.fire({
              type: 'warning',
              title: 'No tiene cuentas registradas',
              text: 'Para retirar primero debes agregar una cuenta'
            });
          }
        }, error => console.error(error) );
    }
  }

  getPlataforms() {
    this.userService.getPlataforms()
      .subscribe((plataforms: Plataform[]) => {
        this.plataforms = plataforms;
      }, error => console.error(error));
  }

  getCurrencies() {
    for (let rate of this.exchangeRates) {
      if (this.currencies.indexOf(rate.currencyTo) === -1) {
        this.currencies.push(rate.currencyTo);
      }
    }
  }

  getExchangeRates() {
    this.userService.getExchangeRates()
      .subscribe( (rates: Rate[]) => {
        this.exchangeRates = rates;
        this.getCurrencies();
      }, error => console.error(error));
  }

  onChanges(): void {
    this.originAccount.valueChanges
      .subscribe( () => {
        this.detailedOperation();
      });
    this.amount.valueChanges
      .subscribe( () => {
        this.detailedOperation();
      });
    this.currency.valueChanges
      .subscribe(() => {
        this.detailedOperation();
      });
  }

  detailedOperation() {
    if (!this.originAccount.value || !this.amount.value || !this.currency.value) {
      this.toReceive = {
        amount: null,
        tax: null,
      }
      return;
    }

    const currencyFrom = this.originAccount.value.currency;
    const currencyTo = this.currency.value;
    this.exchangeRate = this.exchangeRates.find( el => {
      return el.currencyFrom === currencyFrom && el.currencyTo === currencyTo;
    });

    const plataform = this.originAccount.value.plataform;
    const entity = this.originAccount.value.entity;
    this.toReceive.tax = this.plataforms.find(el => {
      if (plataform) {
        return el.id === plataform.id;
      }
      else if (entity) {
        return el.name === entity.name;

      }
    }).tax;
    if (this.exchangeRate) {
      this.toReceive.amount = (this.amount.value * this.exchangeRate.value * ((100 - this.toReceive.tax) / 100)).toFixed(2).toString();
    } else {
      this.toReceive.amount = null;
      this.toReceive.tax = null;
    }
  }
               
  onSubmit() {
    if (this.withdrawForm.invalid) {
      for (let i in this.withdrawForm.controls) {
        this.withdrawForm.controls[i].markAsTouched();
      }
      return;
    }
    const withdraw: Operation = {
      amount: this.amount.value,
      comment: this.comment.value,
      date: Date.now(),
      originAccount: this.originAccount.value,
      status: 'Solicitada',
      toReceive: this.toReceive.amount,
      type: 'Retiro',
      uid: this.currentUser.uid
    }
    this.userService.registerOperation(withdraw)
      .then(r => {
        const msj = `En minutos atenderemos su solicitud, puede hacer seguimiento y ver el estado de su operación en el <b>Historial</b> de operaciones`;
       
        const  dataCustomer = {
          toName : this.currentUser.displayName,
          toEmail:this.currentUser.email,
          toFrom:'intercambiossinfronteras@gmail.com',
          toSubject:'Notificacion solicitud',
          toBody:'Su retiro ha sido enviado y esta en estado solicitada, para ver mas detalles por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
          };
     
          const  dataAdmin = {
           toName : 'ISFRONTERAS',
           toEmail: 'intercambiossinfronteras@gmail.com',
           toFrom:'intercambiossinfronteras@gmail.com',
           toSubject:'Notificacion solicitud',
           toBody:'Un usuario a realizado una nueva solicitud de retiro para ver los detalles, por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
         };
     
             this.emailService.sendEmail(dataCustomer);
             this.emailService.sendEmail(dataAdmin);
       
        swal.fire({
          html: msj,
          type: 'success',
          title: 'Solicitud de retiro realizada',
        });
        this.changeView('historicalView');
      })
      .catch(error => {
        console.error(error)
        swal.fire({
          type: 'error',
          title: 'Ocurrió un error registrando su retiro'
        });
      });
  }

  showAddAccount() {
    this.addAccount = true;
    this.buildRegisterForm();
  }

  buildRegisterForm() {
    this.userService.getPlataforms()
      .subscribe( (plataforms: Plataform[]) => {
        this.plataforms = plataforms;
      }, error => console.error(error) );
    this.registerAccountForm = this.formBuilder.group({
      type: ['', Validators.required],
      plataform: ['', Validators.required],
      name: ['', Validators.required],
      entity: ['', Validators.required],
      eWallet: ['', Validators.required],
      numberAccount: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])],
      dIdentificacion: ['', Validators.compose([
        Validators.required,
        Validators.pattern('[0-9]+')
      ])],
      accountType: ['', Validators.required]
    });
  }

  //- Register form vars
get date() {
  return this.registerAccountForm.get('date');
}

get type() {
  return this.registerAccountForm.get('type');
}

get name() {
  return this.registerAccountForm.get('name');
}

get plataform() {
  return this.registerAccountForm.get('plataform');
}

get entity() {
  return this.registerAccountForm.get('entity');
}

get numberAccount() {
  return this.registerAccountForm.get('numberAccount');
}

get accountType() {
  return this.registerAccountForm.get('accountType');
}

get eWallet() {
  return this.registerAccountForm.get('eWallet');
}


get dIdentificacion() {
  return this.registerAccountForm.get('dIdentificacion');
}


  registerAccount() {
    const date = Date.now();
    if (this.type.value === this.typeAccounts.plataform) {
      this.account = {
        currency: this.plataform.value.currency,
        id: `${this.plataform.value.name}: ${this.eWallet.value}`,
        name: this.name.value,
        eWallet : this.eWallet.value,
        date: date,
        plataform: this.plataform.value,
        type: this.type.value
      }
      const controls = Object.values(this.account);
      for ( let i = 0; i < controls.length; i++) {
        if ( controls[i] === '') {
          swal.fire({
            type: 'warning',
            title: 'Complete los campos solicitados'
          });
          return
        }
      }
      if (this.eWallet.hasError('eWallet') ) {
        return
      }
    } else if (this.type.value === this.typeAccounts.banking) {
      this.account = {
        currency: this.entity.value.currency,
        name: this.name.value,
        accountType: this.accountType.value,
        entity: this.entity.value,
        date: date,
        id: `${this.entity.value.name}: ${this.numberAccount.value}`,
        numberAccount: this.numberAccount.value,
        documentNumber:this.dIdentificacion.value,
        type: this.type.value
      }
      const controls = Object.values(this.account);
      for ( let i = 0; i < controls.length; i++) {
        if ( controls[i] === '') {
          swal.fire({
            type: 'warning',
            title: 'Complete los campos solicitados'
          });
          return
        }
      }
    } else {
      swal.fire({
        type: 'warning',
        title: 'Seleccione un tipo de cuenta'
      });
      return;
    }
    this.userService.registerAccount(this.account, this.currentUser.uid)
      .then(r => {
        swal.fire({
          type: 'success',
          title: 'Registro de cuenta realizada',
          text: `Su cuenta  ${this.account.type} ha sido registrada exitosamente.`,
        });
        this.changeView('withdrawView');
      })
      .catch(error => {
        console.error(error)
        swal.fire({
          type: 'error',
          title: 'Ocurrió un error registrando su cuenta'
        });
      });
  }

  changeView(view: String) {
    this.addAccount=false;
    this.view.emit(view);
  }

  ngOnDestroy() {
    this.accountsSubscription.unsubscribe();
  }
}
