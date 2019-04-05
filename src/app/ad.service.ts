import { Injectable } from '@angular/core';
import { Ad } from './ad';

@Injectable({
  providedIn: 'root'
})
export class AdService {

  constructor() { }
  
  getAds(): Ad[] {
    return [{ id: 11, name: 'Mr. Nice' }];
  }
}
