import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalysisService {
  private data: any = null;

  setAnalysis(data: any) {
    this.data = data;
  }
  getAnalysis() {
    return this.data;
  }
  clear() {
    this.data = null;
  }
}
