import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
    
  private endpoint:string = 'https://us-central1-intercambios-sin-fronteras.cloudfunctions.net/httpEmail';

  constructor(private http: HttpClient) { }

  sendEmail(data){
    this.http.post(this.endpoint, data).subscribe();
    console.log("enviado");
  }
  
}
