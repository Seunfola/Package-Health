import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private _progress = new BehaviorSubject<number>(0);
  progress$ = this._progress.asObservable();

  setProgress(value: number) {
    if (isNaN(value) || !isFinite(value)) {
      console.warn('Invalid progress value:', value);
      return;
    }
    const clampedValue = Math.max(0, Math.min(100, value));
    this._progress.next(clampedValue);
  }
  reset() {
    this._progress.next(0);
  }
}
