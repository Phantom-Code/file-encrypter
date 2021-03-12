import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { Buffer } from 'buffer';
import * as cryptoJs from 'crypto-js';
@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css'],
})
export class FilePickerComponent implements OnInit {
  file: any;
  downloadJsonHref: any;
  filename: any;
  password:any;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-dark');
    } else {
      this.setTheme('theme-light');
    }
  }
  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsText(file);
    });
  }
  readJsonAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        let data: any = reader.result;
        resolve(JSON.parse(data));
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
  readBlobAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }

  generateDownloadJsonUri(file) {
    var theJSON = JSON.stringify(file);

    var uri = this.sanitizer.bypassSecurityTrustUrl(
      'data:application/octet-stream,' + file
    );
    this.downloadJsonHref = uri;
  }
  async fileUploadHandler(files) {
    let temp: any = await this.readFileAsync(files[0]);
    console.log(temp, 'temp');

    let name = files[0].name;
    let ciphertext = cryptoJs.AES.encrypt(temp, this.password).toString();
    let blob = new Blob([ciphertext], { type: 'application/json' });
    saveAs(blob, name + '.json');
  }
  async fileUploadHandlerDe(files) {
    let temp: any = await this.readFileAsync(files[0]);
    let name = files[0].name;
    name = name.replace('.json', '');
    let bytes = cryptoJs.AES.decrypt(temp, this.password).toString(
      cryptoJs.enc.Latin1
    );
    console.log(bytes);
    let blob = new Blob([bytes]);
    saveAs(blob, name);
  }
  setTheme(themeName) {
    localStorage.setItem('theme', themeName);
    document.documentElement.className = themeName;
  }
  toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-light');
    } else {
      this.setTheme('theme-dark');
    }
  }
}
