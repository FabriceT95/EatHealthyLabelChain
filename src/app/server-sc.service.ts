import {EventEmitter, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServerSCService {

  isChecked = false;
  port_SC: string = environment.port_SC;
  port: string = environment.port;
  serverUrl = environment.serverIP.valueOf() + ':' + this.port_SC;
  date_order_change = new EventEmitter<any>();
  alphabetical_order_change = new EventEmitter<any>();
  typeSelected_change = new EventEmitter<any>();
  content_vote_page_change = new EventEmitter<any>();

  date_order_change_accepted = new EventEmitter<any>();
  alphabetical_order_change_accepted = new EventEmitter<any>();
  typeSelected_change_accepted = new EventEmitter<any>();
  content_vote_page_change_accepted = new EventEmitter<any>();

  changeDataSource = new EventEmitter();

  constructor(private http: HttpClient) {
  }

  addFile(event) {
    return this.request('POST', `${this.serverUrl}/addfile/${event.file}/`, event);
  }
  getFile(event) {
    return this.request('GET', `${this.serverUrl}/getfile/${event.hash_code}/`, event);
  }

  addLabels(event) {
    return this.request('POST', `${this.serverUrl}/add_labels/${event.labels_hash}/${event.labels}`, event);
  }

  addAdditives(event) {
    return this.request('POST', `${this.serverUrl}/add_additives/${event.additives_hash}/${event.additives}`, event);
  }

  addIngredients(event) {
    return this.request('POST', `${this.serverUrl}/add_ingredients/${event.ingredients_hash}/${event.ingredients}`, event);
  }

  addNutriments(event) {
    return this.request('POST', `${this.serverUrl}/add_nutriments/${event.nutriments_hash}/${event.nutriments}`, event);
  }

  addHashes(event) {
    return this.request('POST', `${this.serverUrl}/add_product_infos/${event.all_hash}/${event.addressProposer}/${event.voteDates[0]}/${event.voteDates[1]}/${event.status}`, event);
  }

  addVariousDatas(event) {
    return this.request('POST', `${this.serverUrl}/add_various_data/${event.variousData_hash}/${event.productCode}/${event.product_name}/${event.product_type}/${event.quantity}/${event.packaging}`, event);
  }

  addUser(event) {
    return this.request('POST', `${this.serverUrl}/add_user/${event.user_address}`, event);
  }

  addVote(event) {
    return this.request('POST', `${this.serverUrl}/add_vote/${event.all_hash}/${event.productCode}/${event.user_address}`, event);
  }

  addAlternative(event) {
    return this.request('POST', `${this.serverUrl}/add_alternative/${event.productCode}/${event.productCode_alternative}`, event);
  }

  getMyProposals(event) {
    return this.request('GET', `${this.serverUrl}/get_my_proposals/${event.user_address}`, event);
  }

  getAllVotingProducts() {
    return this.request('GET', `${this.serverUrl}/votable_products/`);
  }

  getAllAcceptedProducts() {
    return this.request('GET', `${this.serverUrl}/accepted_products/`);
  }

  getVotingProducts(event) {
    return this.request('GET', `${this.serverUrl}/votable_products/${event.typeSelected}/${event.inputSearch}/${event.alphabetOrder}/${event.dateOrder}`, event);
  }

  getAcceptedProducts(event) {
    return this.request('GET', `${this.serverUrl}/accepted_products/${event.typeSelected}/${event.inputSearch}/${event.alphabetOrder}/${event.dateOrder}`, event);
  }

  setVerification(event) {
    return this.request('PUT', `${this.serverUrl}/verification/${event.productCode}/${event.lastVerificationDate}`, event);
  }

  getProductAndOlderVersions(event) {
    return this.request('GET', `${this.serverUrl}/get_product_and_older_version/${event.productCode}`, event);
  }

  getCheckModificationStatus(event) {
    return this.request('GET', `${this.serverUrl}/get_in_modification_status/${event.productCode}`, event);
  }

  getProduct(event) {
    return this.request('GET', `${this.serverUrl}/get_product_accepted/${event.productCode}`, event);
  }

  getAlternatives(event) {
    return this.request('GET', `${this.serverUrl}/get_alternatives/${event.productCode}`, event);
  }

  getUser(event) {
    return this.request('GET', `${this.serverUrl}/user/${event.user_address}`, event);
  }

  getAlternatives_voter_for_product(event) {
    return this.request('GET', `${this.serverUrl}/get_alternative_voter_for_product/${event.user_address}/${event.productCode}`, event);
  }

  get_voter_for_product(event) {
    return this.request('GET', `${this.serverUrl}/get_voter_for_product/${event.user_address}/${event.productCode}`, event);
  }

  get_product_proposer_new_modify(event) {
    return this.request('GET', `${this.serverUrl}/get_product_proposer_new_modify/${event.productCode}`, event);
  }

  get_dates_new_modify(event) {
    return this.request('GET', `${this.serverUrl}/get_dates/${event.productCode}`, event);
  }

  addVoteAlternative(event) {
    return this.request('POST', `${this.serverUrl}/add_vote_alternative/${event.all_hash}/${event.productCode}/${event.productCode_alternative}/${event.user_address}/${event.opinion}`, event);
  }

  UpdateVote(event) {
    return this.request('PUT', `${this.serverUrl}/new_vote/${event.productCode}`, event);
  }

  UpdateVoteAlternative(event) {
    return this.request('PUT', `${this.serverUrl}/new_vote_alternative/${event.productCode}/${event.productCode_alternative}/${event.opinion}/${event.prev_opinion}`, event);
  }

  setCorrupted(event) {
    return this.request('PUT', `${this.serverUrl}/corrupted/${event.productCode}`, event);
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
