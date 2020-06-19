import {TestBed, inject} from '@angular/core/testing';
const Web3 = require('web3');

import {WEB3} from './web3.service';

import metacoin_artifacts from '../../../build/contracts/MetaCoin.json';

declare let window: any;

describe('Web3Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WEB3]
    });
  });

  it('should be created', inject([WEB3], (service: any) => {
    expect(service).toBeTruthy();
  }));

  it('should inject a default web3 on a contract', inject([WEB3], (service: any) => {
    window.ethereum = undefined;
    service.bootstrapWeb3();

    return service.artifactsToContract(metacoin_artifacts).then((abstraction) => {
      expect(abstraction.currentProvider.host).toBe('http://localhost:8545');
    });
  }));

  it('should inject a the window web3 on a contract', inject([WEB3], (service: any) => {
    window.ethereum = new Web3.providers.HttpProvider('http://localhost:1337');
    window.ethereum.enable = async () => true;

    service.bootstrapWeb3();

    return service.artifactsToContract(metacoin_artifacts).then((abstraction) => {
      expect(abstraction.currentProvider.host).toBe('http://localhost:1337');
    });
  }));
});
