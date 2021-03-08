import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FileSaveService {
  constructor() {}
  saveFile(blob) {
    saveAs(blob, 'test.json');
  }
}
