import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerSCService {

  date_order_change = new EventEmitter<any>();
  alphabetical_order_change = new EventEmitter<any>();
  typeSelected_change = new EventEmitter<any>();
  content_vote_page_change = new EventEmitter<any>();

  date_order_change_accepted = new EventEmitter<any>();
  alphabetical_order_change_accepted = new EventEmitter<any>();
  typeSelected_change_accepted = new EventEmitter<any>();
  content_vote_page_change_accepted = new EventEmitter<any>();


  private alphabetical_order = new BehaviorSubject(false);
//  currentAlphabeticalOrder = this.alphabetical_order.asObservable();
  private date_order = new BehaviorSubject(false);
  // currentDateOrder = this.date_order.asObservable();
  private alphabetical_order_vote = new BehaviorSubject(false);
  private date_order_vote = new BehaviorSubject(false);
  private updateContent = new BehaviorSubject(null);

  constructor(private http: HttpClient) {
  }

  changeAlphabeticalOrder(alphabeticalOrder_status) {
    this.alphabetical_order.next(alphabeticalOrder_status);
  }

  changeDateOrder(dateOrder_status) {
    this.date_order.next(dateOrder_status);
  }

  onChangeAlphabeticalOrder(): Observable<any> {
    return this.alphabetical_order.asObservable();
  }

  onChangeDateOrder(): Observable<any> {
    return this.date_order.asObservable();
  }

  addLabels(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_labels/${event.labels_hash}/${event.labels}`, event);
  }

  addAdditives(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_additives/${event.additives_hash}/${event.additives}`, event);
  }

  addIngredients(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_ingredients/${event.ingredients_hash}/${event.ingredients}`, event);
  }

  addNutriments(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_nutriments/${event.nutriments_hash}/${event.nutriments}`, event);
  }

  addHashes(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_product_infos/${event.all_hash}/${event.addressProposer}/${event.voteDates[0]}/${event.voteDates[1]}/${event.status}`, event);
  }

  addVariousDatas(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_various_data/${event.variousData_hash}/${event.productCode}/${event.product_name}/${event.product_type}/${event.quantity}/${event.packaging}`, event);
  }

  addUser(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_user/${event.user_address}`, event);
  }

  addVote(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_vote/${event.all_hash}/${event.productCode}/${event.user_address}`, event);
  }

  addAlternative(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_alternative/${event.productCode}/${event.productCode_alternative}`, event);
  }

  getMyProposals(event) {
    return this.request('GET', `${environment.serverUrl_SC}/get_my_proposals/${event.user_address}`, event);
  }

  getAllVotingProducts() {
    return this.request('GET', `${environment.serverUrl_SC}/votable_products/`);
  }

  getAllAcceptedProducts() {
    return this.request('GET', `${environment.serverUrl_SC}/accepted_products/`);
  }

  getVotingProducts(event) {
    return this.request('GET', `${environment.serverUrl_SC}/votable_products/${event.typeSelected}/${event.inputSearch}/${event.alphabetOrder}/${event.dateOrder}}`, event);
  }

  getAcceptedProducts(event) {
    return this.request('GET', `${environment.serverUrl_SC}/accepted_products/${event.typeSelected}/${event.inputSearch}/${event.alphabetOrder}/${event.dateOrder}}`, event);
  }

  setVerification(event) {
    return this.request('PUT', `${environment.serverUrl_SC}/verification/${event.productCode}/${event.lastVerificationDate}`, event);
  }

  getProductAndOlderVersions(event) {
    return this.request('GET', `${environment.serverUrl_SC}/get_product_and_older_version/${event.productCode}}`, event);
  }

  getProduct(event) {
    return this.request('GET', `${environment.serverUrl_SC}/get_product/${event.productCode}`, event);
  }

  getAlternatives(event) {
    return this.request('GET', `${environment.serverUrl_SC}/get_alternatives/${event.productCode}`, event);
  }

  getUser(event) {
    return this.request('GET', `${environment.serverUrl_SC}/user/${event.user_address}`, event);
  }

  getAlternatives_voter_for_product(event) {
    return this.request('GET', `${environment.serverUrl_SC}/get_alternative_voter_for_product/${event.user_address}/${event.productCode}`, event);
  }

  addVoteAlternative(event) {
    return this.request('POST', `${environment.serverUrl_SC}/add_vote_alternative/${event.all_hash}/${event.productCode}/${event.productCode_alternative}/${event.user_address}/${event.opinion}`, event);
  }

  UpdateVote(event) {
    return this.request('PUT', `${environment.serverUrl_SC}/new_vote/${event.productCode}`, event);
  }

  UpdateVoteAlternative(event) {
    return this.request('PUT', `${environment.serverUrl_SC}/new_vote_alternative/${event.productCode}/${event.productCode_alternative}/${event.opinion}/${event.prev_opinion}`, event);
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
