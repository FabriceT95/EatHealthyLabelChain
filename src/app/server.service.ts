import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  constructor(private http: HttpClient) {
  }

  getUser(event) {
    return this.request('GET', `${environment.serverUrl}/user/${event.username}/`, event);
  }

  getProduct(event) {
    return this.request('GET', `${environment.serverUrl}/product/${event.code}/`, event);
  }

  createUser(event) {
    return this.request('POST', `${environment.serverUrl}/add_new_user/${event.username}/${event.wallet}/`, event);
  }

  createProduct(event) {
    return this.request('POST', `${environment.serverUrl}/add_new_product/${event.user_id}/${event.code}/${event.product_name}/${event.nutriments}/${event.ingredients}/${event.quantity}/${event.generic_name}/${event.packaging}/${event.labels}`, event);
  }

  updateUser(event) {
    return this.request('PUT', `${environment.serverUrl}/user_wallet/${event.new_username}/${event.wallet}/${event.new_wallet}/`, event);
  }

  updateProduct(event) {
    return this.request('PUT', `${environment.serverUrl}/product_code/${event.code}/${event.name}/`, event);
  }

  deleteProduct(event) {
    return this.request('DELETE', `${environment.serverUrl}/delete_product/${event.code}`, event);
  }

  deleteUser(event) {
    return this.request('DELETE', `${environment.serverUrl}/delete_user/${event.wallet}`, event);
  }

  private async request(method: string, url: string, data?: any) {
    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body',
    });
    return new Promise((resolve, reject) => {
      result.subscribe(resolve, reject);
    });
  }
}
