import { Injectable, InjectionToken, Inject } from '@angular/core';
import { providers } from 'ethers';
import IpfsHttpClient from 'ipfs-http-client';

export const ipfsToken = new InjectionToken('The IPFS Token', {
  providedIn: 'root',
  factory: () => {
    try {
      return new IpfsHttpClient('https://ipfs.infura.io', '5001', {
        protocol: 'https',
        'Access-Control-Allow-Origin': '*',
      });
    } catch (err) {
      console.log('Error', err);
      throw new Error('Unable to access IPFS node daemon on Infura network');
    }
  }
});






/*

import { InjectionToken } from '@angular/core';
import ipfs from 'ipfs';

export const IPFS = new InjectionToken(
  'The IPFS instance',
  {
    providedIn: 'root',
    factory: async () => new ipfs()
  },
);
*/
/**
 * Wait for the IPFS node to be initialized when the app is launched
 * @param node The Instance of the ipfs constructor
 *//*
export function initIPFS(node) {
  return function () {
    return new Promise((resolve, reject) => {
      node.on('error', () => reject());
      node.on('ready', () => resolve());
    });
  };
}*/
