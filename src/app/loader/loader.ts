import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _progress = new BehaviorSubject<number>(0);
  progress$ = this._progress.asObservable();

  setProgress(value: number) {
    this._progress.next(value);
  }

  reset() {
    this._progress.next(0);
  }
}
