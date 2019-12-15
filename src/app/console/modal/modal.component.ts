import { Component,OnInit, Inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

import { UserService } from '../../services/user.service';
import { Account } from '../../interfaces/account';
import { User } from '../../interfaces/user';
import { Operation } from '../../interfaces/operation';
import { Plataform } from '../../interfaces/plataform';
import { Rate } from '../../interfaces/rate';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import { AngularFireStorage } from '@angular/fire/storage';
import { EmailService } from 'src/app/services/email.service';
import swal from 'sweetalert2';
import { PlataformBuySell } from 'src/app/interfaces/PlataformBuySell';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  currentUser: User;
  action: string;
  account: Account;
  operation: Operation;
  user: User;
  plataform: Plataform;
  typeAccounts = {
    plataform: 'Monedero Electrónico',
    banking: 'Cuenta Bancaria'
  };

  newBalance: number;

  plataformForm: FormGroup;

  voucherImage: any;
  voucherImageName: string;
  voucherAdminImage: any;
  voucherAdminImageName: string
  disabled = false;

  exchangeRate: Rate;
  exchangeRateForm: FormGroup;

  plataformBuySellForm: FormGroup;
  plataformBuySell:PlataformBuySell;
  
  constructor(
    private dialogRef: MatDialogRef<ModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private firebaseStorage: AngularFireStorage,
    private emailService:EmailService,
  ) { }

  ngOnInit() {
    this.action = this.data.action;
    this.user = this.data.user;
    this.operation = this.data.operation;
    this.plataform = this.data.plataform;
    this.plataformBuySell=this.data.plataformBuySell;
    this.exchangeRate = this.data.exchangeRate;
    this.account = this.data.account;
    this.currentUser = this.data.currentUser;
    if (this.action === 'addPlataform') {
      this.buildPlataformForm();
    }
    if (this.action === 'editPlataform') {
        this.buildEditPlataformForm();
    }
    if (this.action === 'addExchangeRate') {
      this.buildExchangeRateForm();
    }
    if (this.action === 'editExchangeRate') {
      this.buildEditExchangeRateForm();
    }
    if (this.action === 'addPlataformBuySell') {
      this.buildPlataformBuySellForm();
    }
    if (this.action === 'editPlataformBuySell') {
      this.buildEditPlataformBuySellForm();
    }
  }

  buildPlataformForm() {
    this.plataformForm = this.formBuilder.group({
      currency: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(3)
      ])],
      name: ['', Validators.required],
      tax: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$'),
        Validators.maxLength(3)
      ])],
      type: ['', Validators.required]
    });
  }

  buildEditPlataformForm() {
    this.plataformForm = this.formBuilder.group({
      currency: [this.plataform.currency, Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ])],
      name: [this.plataform.name, Validators.required],
      tax: [this.plataform.tax, Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$'),
      ])],
      type: [this.plataform.type, Validators.required]
    });
  }

  get currency() {
    return this.plataformForm.get('currency');
  }

  get name() {
    return this.plataformForm.get('name');
  }

  get tax() {
    return this.plataformForm.get('tax');
  }

  get type() {
    return this.plataformForm.get('type');
  }

  buildExchangeRateForm() {
    this.exchangeRateForm = this.formBuilder.group({
      currencyFrom: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ])],
      currencyTo: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ])],
      value: ['', Validators.compose([
        Validators.required,
      ])]
    });
  }

  buildEditPlataformBuySellForm() {
    this.plataformBuySellForm = this.formBuilder.group({
      namePBuySell: [this.plataformBuySell.namePBuySell, Validators.required],
      ventaBs: [this.plataformBuySell.ventaBs, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      ventaCop: [this.plataformBuySell.ventaCop, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      ventaSoles: [this.plataformBuySell.ventaSoles, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      compraBs: [this.plataformBuySell.compraBs, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      compraCop: [this.plataformBuySell.compraCop, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      compraSoles: [this.plataformBuySell.compraSoles, Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])]
    });
  }


  buildPlataformBuySellForm() {
    this.plataformBuySellForm = this.formBuilder.group({
      namePBuySell: ['', Validators.required],
      ventaBs: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      ventaCop: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      ventaSoles: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      compraBs: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      compraCop: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])],
      compraSoles: ['', Validators.compose([
        Validators.required,
        Validators.pattern('^[0-9]+(\.[0-9]{0,4})?$')
      ])]
    });
  }

get namePBuySell(){
  return this.plataformBuySellForm.get('namePBuySell');
}

get ventaBs(){
  return this.plataformBuySellForm.get('ventaBs');
}

get ventaCop(){
  return this.plataformBuySellForm.get('ventaCop');
}

get ventaSoles(){
  return this.plataformBuySellForm.get('ventaSoles');
}


get compraBs(){
  return this.plataformBuySellForm.get('compraBs');
}

get compraCop(){
  return this.plataformBuySellForm.get('compraCop');
}

get compraSoles(){
  return this.plataformBuySellForm.get('compraSoles');
}

  buildEditExchangeRateForm() {
    this.exchangeRateForm = this.formBuilder.group({
      currencyFrom: [this.exchangeRate.currencyFrom, Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ])],
      currencyTo: [this.exchangeRate.currencyTo, Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.minLength(3)
      ])],
      value: [this.exchangeRate.value, Validators.compose([
        Validators.required,
      ])]
    });
  }

  get currencyFrom() {
    return this.exchangeRateForm.get('currencyFrom');
  }

  get currencyTo() {
    return this.exchangeRateForm.get('currencyTo');
  }

  get value() {
    return this.exchangeRateForm.get('value');
  }

  verifyUser() {
    const verifiedUser: User = {
      ...this.user,
      isVerified: true
    }
    this.userService.editUser(verifiedUser)
      .then( data => {
        const message = `El usuario se ha verificado exitosamente`;
        this.close(data, message);
      })
      .catch( data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  assignBalanceUser() {
    const assignUser: User = {
      ...this.user,
      balance: this.newBalance
    }
    this.userService.editUser(assignUser)
      .then( data => {
        const message = `Se ha asignado ${this.newBalance} USD como saldo al usuario ${this.user.displayName} exitosamente`;
        this.close(data, message, 10000, 'x');
      })
      .catch( data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  cancelOperation() {
    const canceledOperation: Operation = {
      ...this.operation,
      status: 'Cancelada'
    }
    this.userService.editOperation(canceledOperation)
      .then( data => {
        const message = `La operación se canceló exitosamente`;
        this.close(data, message);
      })
      .catch( data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  addPlataform() {
    if (this.plataformForm.invalid) {
      this.markFormGroupTouched(this.plataformForm);
      return;
    }
    const plataform: Plataform = {
      ...this.plataformForm.value,
      id: Date.now(),
    };
    this.userService.registerPlataform(plataform)
      .then(data => {
        const message = `La plataforma se agregó exitosamente`;
        this.close(data, message);
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  editPlataform() {
    if (this.plataformForm.invalid) {
      this.markFormGroupTouched(this.plataformForm);
      return;
    }
    const plataform: Plataform = {
      ...this.plataformForm.value,
      id: this.plataform.id
    };
    this.userService.editPlataform(plataform)
      .then(data => {
        const message = `La plataforma se editó exitosamente`;
        this.close(data, message);
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  deletePlataform() {
    this.userService.deletePlataform(this.plataform.id)
      .then(data => {
        const message = `La plataforma se eliminó exitosamente`;
        this.close(data, message);
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  addPlataformBuySell() {
    if (this.plataformBuySellForm.invalid) {
      this.markFormGroupTouched(this.plataformBuySellForm);
      return;
    }
    const plataformBuySell: PlataformBuySell = {
      ...this.plataformBuySellForm.value,
      id: Date.now()
    };
    this.userService.registerPlataformBuySell(plataformBuySell)
      .then(data => {
        const message = `La plataforma compra/venta se agregó exitosamente`;
        this.close(data, message);
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  editPlataformBuySell() {
    if (this.plataformBuySellForm.invalid) {
      this.markFormGroupTouched(this.plataformBuySellForm);
      return;
    }
    const plataformBuySell: PlataformBuySell = {
      ...this.plataformBuySellForm.value,
      id: this.plataformBuySell.id
    };
    this.userService.editPlataformBuySell(plataformBuySell)
      .then(data => {
        const message = `La plataforma se editó exitosamente`;
        this.close(data, message);
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  deletePlataformBuySell() {
    this.userService.deletePlataformBuySell(this.plataformBuySell.id)
      .then(data => {
        const message = `La plataforma compra/venta se eliminó exitosamente`;
        this.close(data, message);
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }



  addExchangeRate() {
    if (this.exchangeRateForm.invalid) {
      this.markFormGroupTouched(this.exchangeRateForm);
      return;
    }
    const newExchangeRate = {
      ...this.exchangeRateForm.value,
      id: Date.now(),
    }
    this.userService.addExchangeRate(newExchangeRate)
      .then(data => {
        const message = `Se ha agregado ${newExchangeRate.currencyFrom} a ${newExchangeRate.currencyTo}: ${newExchangeRate.value} como nuevo tipo de cambio exitosamente`;
        this.close(data, message, 5000, 'x');
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  updateExchangeRate() {
    if (this.exchangeRateForm.invalid) {
      this.markFormGroupTouched(this.exchangeRateForm);
      return;
    }
    const newExchangeRate = {
      ...this.exchangeRate,
      ...this.exchangeRateForm.value,
    }
    this.userService.editExchangeRate(newExchangeRate)
      .then(data => {
        const message = `Se ha asignado ${newExchangeRate.currencyFrom} a ${newExchangeRate.currencyTo}: ${newExchangeRate.value} como nuevo tipo de cambio exitosamente`;
        this.close(data, message, 5000, 'x');
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  deleteExchangeRate() {
    this.userService.deleteExchangeRate(this.exchangeRate.id)
      .then(data => {
        const message = `Se ha eliminado ${this.exchangeRate.currencyFrom} a ${this.exchangeRate.currencyTo}: ${this.exchangeRate.value} exitosamente`;
        this.close(data, message, 5000, 'x');
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  saveVoucher() {
    this.disabled = true;
    const currentPictureId = Date.now();
    const pictures = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.voucherImage, 'data_url');
    pictures.then(() => {
      this.voucherImage = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL();
      this.voucherImage.subscribe((path: string) => {
        this.userService.saveVoucherOperation(path, this.operation.uid, this.operation.date)
          .then(() => {
            const operationWithVoucher: Operation = {
              ...this.operation,
              status: 'En revisión'
            }
            this.userService.editOperation(operationWithVoucher)
              .then( data => {

                const  dataCustomer = {
                  toName : this.currentUser.displayName,
                  toEmail:this.currentUser.email,
                  toFrom:'intercambiossinfronteras@gmail.com',
                  toSubject:'Notificacion solicitud',
                  toBody:'Su solicitud esta en estado revisión, para ver mas detalles por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
                  };
             
                  const  dataAdmin = {
                   toName : 'ISFRONTERAS',
                   toEmail: 'intercambiossinfronteras@gmail.com',
                   toFrom:'intercambiossinfronteras@gmail.com',
                   toSubject:'Notificacion solicitud',
                   toBody:'Un usuario a cambiado una de sus solicitudes a estado revisión, para ver los detalles, por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
                 };
             
                     this.emailService.sendEmail(dataCustomer);
                     this.emailService.sendEmail(dataAdmin);
        


                const message = `El comprobante de la operación se guardó exitosamente`;
                this.close(data, message);
              })
              .catch(error => {
                swal.fire({
                  type: 'error',
                  title: 'Ocurrió un error, intente de nuevo'
                });
                console.error(error)
              })
          }, error => console.error(error));
      });
    }, error => console.error(error));
  }

  saveVoucherAdmin() {
    this.disabled = true;
    const currentPictureId = Date.now();
    const pictures = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').putString(this.voucherAdminImage, 'data_url');
    pictures.then(() => {
      this.voucherAdminImage = this.firebaseStorage.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL();
      this.voucherAdminImage.subscribe((path: string) => {
        this.userService.saveVoucherAdminOperation(path, this.operation.uid, this.operation.date)
          .then(() => {
            const operationWithVoucher: Operation = {
              ...this.operation,
              status: 'Procesada'
            }
            this.userService.editOperation(operationWithVoucher)
              .then(data => {
                const message = `Operación completada exitosamente`;

                const  dataCustomer = {
                  toName : this.currentUser.displayName,
                  toEmail:this.currentUser.email,
                  toFrom:'intercambiossinfronteras@gmail.com',
                  toSubject:'Notificacion solicitud',
                  toBody:'Su solicitud esta en estado procesada, para ver mas detalles por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
                  };
               
                     this.emailService.sendEmail(dataCustomer);
                     

                this.close(data, message);
              })
              .catch(error => {
                swal.fire({
                  type: 'error',
                  title: 'Ocurrió un error, intente de nuevo'
                });
                console.error(error)
              })
          }, error => console.error(error));
      });
    }, error => console.error(error));
  }

  changeImage(event: any) {
    const file = event.target.files[0];
    if (this.operation.voucherImage) {
      this.voucherAdminImageName = file.name;
    } else {
      this.voucherImageName = file.name;
    }
    if (file) {
      if (file.size < 2096000) {
        const reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsBinaryString(file);
      } else {
        swal.fire({
          type: 'error',
          title: 'Hay un error con el archivo',
          text: 'El tamaño del archivo es muy grande, debe ser menor a 2MB.'
        });
      }
    }
  }

  handleReaderLoaded(readerEvt) {
    const binaryString = readerEvt.target.result;
    if (this.operation.voucherImage) {
      this.voucherAdminImage = 'data:image/png;base64,' + btoa(binaryString);
    } else {
      this.voucherImage = 'data:image/png;base64,' + btoa(binaryString);
    }
  }

  acceptOperation() {
    const acceptedOperation: Operation = {
      ...this.operation,
      status: 'En proceso'
    }
    this.userService.editOperation(acceptedOperation)
      .then( data => {
      
        const  dataCustomer = {
          toName : this.currentUser.displayName,
          toEmail:this.currentUser.email,
          toFrom:'intercambiossinfronteras@gmail.com',
          toSubject:'Notificacion solicitud',
          toBody:'Su solicitud ha cambiado ha estado en proceso, para ver mas detalles por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
          };
             this.emailService.sendEmail(dataCustomer);
        
        const message = `La operación se aprobó exitosamente`;
        this.close(data, message);
      })
      .catch( data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  rejectOperation() {
    const rejectedOperation: Operation = {
      ...this.operation,
      status: 'Rechazada'
    }
    this.userService.editOperation(rejectedOperation)
      .then( data => {
        const message = `La operación se rechazó exitosamente`;
        const  dataCustomer = {
          toName : this.currentUser.displayName,
          toEmail:this.currentUser.email,
          toFrom:'intercambiossinfronteras@gmail.com',
          toSubject:'Notificacion solicitud',
          toBody:'Su solicitud ha cambiado ha estado rechazada, para ver mas detalles por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
          };
    
             this.emailService.sendEmail(dataCustomer);
      

        this.close(data, message);
      })
      .catch( data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  closeOperation() {
    const closedOperation: Operation = {
      ...this.operation,
      status: 'Exitosa'
    }
    this.userService.editOperation(closedOperation)
      .then( data => {
        const message = `La operación se cerró exitosamente`;
        const  dataCustomer = {
          toName : this.currentUser.displayName,
          toEmail:this.currentUser.email,
          toFrom:'intercambiossinfronteras@gmail.com',
          toSubject:'Notificacion solicitud',
          toBody:'Su solicitud ha cambiado ha estado exitosa, para ver mas detalles por favor diríjase al historial del panel de administración de la plataforma ISFRONTERAS'
          };
    
             this.emailService.sendEmail(dataCustomer);
      

        this.close(data, message);
      })
      .catch( data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  deleteAccount() {
    this.userService.deleteAccount(this.account, this.user.uid)
      .then(data => {
        const message = `La cuenta se eliminó exitosamente`;
        this.close(data, message);
      })
      .catch(data => {
        const message = `Ocurrió un error, intente de nuevo`;
        this.close(data, message);
      });
  }

  close(data: any, message: string, time?: number, action?: string) {
    this.dialogRef.close({
      message: message,
      data: data,
      time: time,
      action: action
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
