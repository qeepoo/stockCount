import { Component } from '@angular/core';
import Quagga from 'quagga';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  scannedCodes: string[] = [];
  isScanning = false;

  startScan() {
    this.isScanning = true;
    Quagga.init({
      inputStream: {
        name: "Live",
        type: "LiveStream",
        target: document.querySelector('#scanner')!
      },
      decoder: {
        readers: ["code_128_reader"]
      }
    }, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
    });

    Quagga.onDetected((result) => {
      const code = result.codeResult.code;
      if (!this.scannedCodes.includes(code)) {
        this.scannedCodes.push(code);
      }
    });
  }

  stopScan() {
    this.isScanning = false;
    Quagga.stop();
  }

  saveFile() {
    const fileName = prompt('Enter file name');
    if (fileName) {
      const blob = new Blob([this.scannedCodes.join('\n')], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${fileName}.txt`;
      link.click();
    }
  }
}
