import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-picker',
  templateUrl: './file-picker.component.html',
  styleUrls: ['./file-picker.component.css'],
})
export class FilePickerComponent implements OnInit {
  file: any;
  constructor() {}

  ngOnInit(): void {}
  readFileAsync(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = reject;

      reader.readAsArrayBuffer(file);
    });
  }

  async keyGenerator(password, salt) {
    let enc = new TextEncoder();
    let keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      { name: 'PBKDF2' },
      false,
      ['deriveBits', 'deriveKey']
    );
    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 1000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }
  async readAndEncryptOneFile(file, pass) {
    let salt = window.crypto.getRandomValues(new Uint8Array(16));
    let iv = window.crypto.getRandomValues(new Uint8Array(12));
    let key = await this.keyGenerator(pass, salt);
    //
    //
    let data: any = await this.readFileAsync(file);

    let cipheredData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      key,
      data
    );
    console.log(cipheredData);

    return { cipher: cipheredData, salt: salt, iv: iv };
  }
  async readAndDecryptOneFile(file, pass) {
    let data: any = await this.readFileAsync(file);
    // console.log(data);
    let decodedString = await String.fromCharCode.apply(
      null,
      new ArrayBuffer(data)
    );
    let cipher = await JSON.parse(decodedString);
    console.log(cipher.cipher);
    let key = await this.keyGenerator(pass, new ArrayBuffer(cipher.salt));

    return {
      data: await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new ArrayBuffer(cipher.iv),
        },
        key,
        new ArrayBuffer(cipher.cipher)
      ),
    };
  }
  async fileUploadHandler(files) {
    console.log(files);
    let x = await this.readAndEncryptOneFile(files[0], 'pssss');
    console.log(x);
  }
}
