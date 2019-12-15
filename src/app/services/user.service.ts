import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/database';

import { User } from '../interfaces/user';
import { Account  } from '../interfaces/account';
import { Operation } from '../interfaces/operation';
import { Plataform } from '../interfaces/plataform';
import { Rate } from '../interfaces/rate';
import { PlataformBuySell } from '../interfaces/PlataformBuySell';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(private angularFireDatabase: AngularFireDatabase) {	}

  getUserById(uid: string) {
    return this.angularFireDatabase.object('/users/' + uid).valueChanges();
  }

  getUsers() {
    return this.angularFireDatabase.list('/users/').valueChanges();
  }

  createUser(user: User) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }

  editUser(user: User) {
    return this.angularFireDatabase.object('/users/' + user.uid).update(user);
  }

  setIdImage(path: string, uid: string) {
    return this.angularFireDatabase.object('/users/' + uid + '/idDocumentImage').set(path);
  }

  saveVoucherOperation(path: string, uid: string, date: number) {
    return this.angularFireDatabase.object('/operations/' + uid + '/' + date + '/voucherImage').set(path);
  }

  saveVoucherAdminOperation(path: string, uid: string, date: number) {
    return this.angularFireDatabase.object('/operations/' + uid + '/' + date + '/voucherAdminImage').set(path);
  }

  registerAccount(newAccount: Account, uid: string) {
   
    return this.angularFireDatabase.object('/accounts/' + uid + '/' + newAccount.date ).set(newAccount);
  }

  editAccount(account: Account, uid: string) {
   
    return this.angularFireDatabase.object('/accounts/' +uid + '/' + account.date ).update(account);
  }

  deleteAccount(account: Account, uid: string) {
    return this.angularFireDatabase.object('/accounts/' + uid + '/' + account.date).remove();
  }

  getUserAccounts(uid: string) {
    return this.angularFireDatabase.list('/accounts/' + uid).valueChanges();
  }

  registerOperation(op: Operation) {
    return this.angularFireDatabase.object('/operations/' + op.uid + '/' + op.date).set(op);
  }

  editOperation(op: Operation) {
    return this.angularFireDatabase.object('/operations/' + op.uid + '/' + op.date).update(op);
  }

  getUserOperations(uid: string) {
    return this.angularFireDatabase.list('/operations/' + uid).valueChanges();
  }

  getOperations() {
    return this.angularFireDatabase.list('/operations/').valueChanges();
  }

  getOperation(uid: string, date: number) {
    return this.angularFireDatabase.object('/operations/' + uid + '/' + date).valueChanges();
  }

  getPlataforms() {
    return this.angularFireDatabase.list('/plataforms/').valueChanges();
  }

  getPlataform(id: number) {
    return this.angularFireDatabase.object('/plataforms/' + id).valueChanges();
  }

  registerPlataform(plataform: Plataform) {
    return this.angularFireDatabase.object('/plataforms/' + plataform.id).set(plataform);
  }

  registerPlataformBuySell(plataformBuySell: PlataformBuySell) {
    return this.angularFireDatabase.object('/plataformsBuySell/' + plataformBuySell.id).set(plataformBuySell);
  }

  editPlataform(plataform: Plataform) {
    return this.angularFireDatabase.object('/plataforms/' + plataform.id).update(plataform);
  }

  editPlataformBuySell(PlataformBuySell: PlataformBuySell) {
    return this.angularFireDatabase.object('/plataformsBuySell/' + PlataformBuySell.id).update(PlataformBuySell);
  }

  deletePlataform(id: number) {
    return this.angularFireDatabase.object('/plataforms/' + id).remove();
  }

  deletePlataformBuySell(id: number) {
    return this.angularFireDatabase.object('/plataformsBuySell/' + id).remove();
  }

  getExchangeRates() {
    return this.angularFireDatabase.list('/exchangeRates/').valueChanges();
  }

  getPlataformsBuySell(){
    return this.angularFireDatabase.list('/plataformsBuySell/').valueChanges();
  }

  addExchangeRate(newRate: Rate) {
    return this.angularFireDatabase.object('/exchangeRates/' + newRate.id).set(newRate);
  }

  editExchangeRate(rate: Rate) {
    return this.angularFireDatabase.object('/exchangeRates/' + rate.id).update(rate);
  }

  deleteExchangeRate(id: string) {
    return this.angularFireDatabase.object('/exchangeRates/' + id).remove();
  }
  
}
