import { Account } from './account';

export interface User {
  isAdmin?: boolean;
  uid: string;
  displayName: string;
  country?: any;
  birthdate?: any;
  email: string;
  emailVerified: boolean;
  phoneNumber?: any | null;
  idDocument?: any | null;
  idDocumentImage?: string | null;
}

export interface NewUser {
  uid: string;
  displayName: string;
  email: string;
}
