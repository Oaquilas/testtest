import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CheckLoadingService {
previousId: number = 0;

  constructor() { }
}
