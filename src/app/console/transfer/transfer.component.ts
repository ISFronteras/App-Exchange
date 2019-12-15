import { Component, Input, OnInit, OnChanges, EventEmitter, Output, OnDestroy } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { UserService } from '../../services/user.service';

import { Account } from '../../interfaces/account';
import { Operation } from '../../interfaces/operation';
import { Plataform } from '../../interfaces/plataform';
import { User } from '../../interfaces/user';
import { Rate } from '../../interfaces/rate';

// ES6 Modules or TypeScript
import swal from 'sweetalert2';

import { Subscription } from 'rxjs';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.scss']
})
export class TransferComponent implements OnInit, OnChanges, OnDestroy {

  @Input() public currentUser: User;
  accountsSubscription: Subscription;
  @Output() view = new EventEmitter<String>();
  addAccount = false;
  accounts: Account[];
  exchangeRates: Rate[];
  exchangeRate: Rate;
  operation: string;
  plataforms: Plataform[];
  registerAccountForm: FormGroup;
  account: Account;
  transferForm: FormGroup;

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
  
  messagesTransfer = [
    'Transfiere dinero desde tu cuenta bancaria nacional a un monedero electrónico (moneda local a dólar).',
    'Transfiere dinero desde un monedero electrónico a otro (dólar a dólar).',
    'Transfiere dinero desde un monedero electrónico a tu cuenta bancaria nacional (dólar a moneda local).',
  ]
  messagesAddAccount = [
    'Debe registrar cuentas para poder realizar transferencias',  
  ]

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private emailService:EmailService 
  ) { }

  ngOnInit() {
    this.buildTransferForm();
    this.getPlataforms();
    this.getExchangeRates();
  }

  ngOnChanges() {
    this.getAccounts();
  }

  buildTransferForm() {
    this.transferForm = this.formBuilder.group({
      originAccount: ['', Validators.required],
      destinationAccount: ['', Validators.required],
      amount: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{1,15})?$'),
      ])],
      comment: ['', Validators.maxLength(200)]
    });
    this.onChanges();
  }

  get originAccount() {
    return this.transferForm.get('originAccount');
  }

  get destinationAccount() {
    return this.transferForm.get('destinationAccount');
  }

  get amount() {
    return this.transferForm.get('amount');
  }

  get comment() {
    return this.transferForm.get('comment');
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
              text: 'Para transferir primero debes agregar una cuenta.'
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

  getExchangeRates() {
    this.userService.getExchangeRates()
      .subscribe( (rates: Rate[]) => {
        this.exchangeRates = rates;
      }, error => console.error(error));
  }

  onChanges(): void {
    this.originAccount.valueChanges
      .subscribe( () => {
        this.detailedOperation();
      });
    this.destinationAccount.valueChanges
      .subscribe( () => {
        this.detailedOperation();
      });
    this.amount.valueChanges
      .subscribe( () => {
        this.detailedOperation();
      });
  }

  detailedOperation() {
    if (!this.originAccount.value || !this.amount.value || !this.destinationAccount.value) {
      this.toReceive = {
        amount: null,
        tax: null,
      }
      return;
    }

    const currencyFrom = this.originAccount.value.currency;
    const currencyTo = this.destinationAccount.value.currency;
    this.exchangeRate = this.exchangeRates.find(el => {
      return el.currencyFrom === currencyFrom && el.currencyTo === currencyTo;
    });

    const plataform = this.originAccount.value.plataform;
    const entity = this.originAccount.value.entity;
    this.toReceive.tax = this.plataforms.find(el => {
      if (plataform) {
        return el.id === plataform.id;
      }
      if (entity) {
        return el.name === entity.name;

      }
    }).tax;
    if (this.exchangeRate) {
      this.toReceive.amount = (this.amount.value * this.exchangeRate.value * ((100 - this.toReceive.tax) / 100)).toFixed(2).toString();
    } else {
      this.toReceive.amount = (this.amount.value * ((100 - this.toReceive.tax) / 100)).toFixed(2).toString();
    }
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
        this.changeView('transferView');
      })
      .catch(error => {
        console.error(error)
        swal.fire({
          type: 'error',
          title: 'Ocurrió un error registrando su cuenta'
        });
      });
  }

  onSubmit() {
    if (this.transferForm.invalid) {
      for (let i in this.transferForm.controls) {
        this.transferForm.controls[i].markAsTouched();
      }
      return;
    }
    const transference: Operation = {
      amount: this.amount.value,
      comment: this.comment.value,
      date: Date.now(),
      destinationAccount: this.destinationAccount.value,
      originAccount: this.originAccount.value,
      status: 'Solicitada',
      toReceive: this.toReceive.amount,
      type: 'Transferencia',
      uid: this.currentUser.uid
    }
    this.userService.registerOperation(transference)
      .then( r => {  
     const msj = `En minutos atenderemos su solicitud, puede hacer seguimiento y ver el estado de su operación en el <b>Historial</b> de operaciones`;
     const  dataCustomer = {
     toName : this.currentUser.displayName,
     toEmail:this.currentUser.email,
     toFrom:'intercambiossinfronteras@gmail.com',
     toSubject:'Notificacion solicitud',
     toBody:'Su transferencia ha sido enviada y esta en estado solicitada, para ver mas detalles por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
     };

     const  dataAdmin = {
      toName : 'ISFRONTERAS',
      toEmail: 'intercambiossinfronteras@gmail.com',
      toFrom:'intercambiossinfronteras@gmail.com',
      toSubject:'Notificacion solicitud',
      toBody:'Un usuario a realizado una nueva solicitud de transferencia para ver los detalles, por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
    };

        this.emailService.sendEmail(dataCustomer);
        this.emailService.sendEmail(dataAdmin);
        swal.fire({
          html: msj,
          type: 'success',
          title: 'Solicitud de transferencia realizada',
        });
        this.changeView('historicalView');
      })
      .catch( error => {
        console.error(error)
        swal.fire({
          type: 'error',
          title: 'Ocurrió un error registrando su transferencia'
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
