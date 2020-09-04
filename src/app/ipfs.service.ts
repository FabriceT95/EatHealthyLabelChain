import { Injectable, Inject } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, from, empty } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { ipfsToken } from './ipfs';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  constructor(@Inject(ipfsToken) private ipfs,
              private httpClient: HttpClient) {}

  public addFile(file: File): Observable<string> {
    const data = {
      path: file.name,
      content: file
    };
    console.log(data.content);

    const options = {
      progress: (prog) => console.log(`progress report: ${prog}`),
    };

    return from(this.ipfs.add(data, options)).pipe(
      tap((res: any) =>
        console.log(`IPFS node response json: ${JSON.stringify(res)}`)
      ),
      map((res: any) => res[res.length - 1].hash)
    );
  }

  public getFile = (hash: string): Observable<Blob> =>
    from(this.ipfs.cat(hash)).pipe(
      switchMap((buffer: Buffer) => {

          const byteString = buffer.toString('base64');
          const url = `data:application/octet-stream;base64,${byteString}`;

          return this.httpClient.get(url, {
            responseType: 'blob'
          });
        }
      ))
}


/*import { Injectable, EventEmitter, Inject, InjectionToken, OnInit } from '@angular/core';
import { IPFS } from './ipfs';
import {Buffer} from 'buffer';

@Injectable({
  providedIn: 'root'
})
export class IPFSService {

  public hash: string;

  constructor(@Inject(IPFS) public ipfs) {
    console.log(ipfs);
  }

  public async set(path: string, value: string) {
    const content = Buffer.from(value);
    const filesAdded = await this.ipfs.files.add({path, content});
    this.hash = filesAdded[0].hash;
  }

  public async get(hash: string) {
    const fileBuffer = await this.ipfs.files.cat(hash);
    console.log(fileBuffer.toString());
  }
}*/
