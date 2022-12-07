import { Component, OnInit } from '@angular/core';
import { Howl, Howler } from 'howler';
import * as jsZip from 'jszip';
import * as localforage from 'localforage';
import { authorize, getToken } from './authorization';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Browser } from '@capacitor/browser';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  content:string='';
  content2:string='';

  constructor(private route: ActivatedRoute, private http: HttpClient, private iab: InAppBrowser) {
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe(params => {
        console.log(params['code']);
        let code = params['code'];
        if (code)
          getToken(code, this.http);
      }
    );
  }

  async play() {
    let ar:ArrayBuffer = await localforage.getItem('1-1000/thesaurus/1-1000-thesaurus-tough.mp3');
    let blob = new Blob( [ ar ], { type: 'music/mp3' } );
    let howlSource = URL.createObjectURL(blob)
    const sound = new Howl({
      src: [howlSource],
      preload: true,
      format: ['ogg'],
      onloaderror: (id, msg) => console.error(id, msg),
      onplayerror: (id, msg) => console.error(id, msg),
      onend: () => { console.log('played'); }
    });
    sound.play();
  }

  async downloader(data){
    jsZip.loadAsync(data).then((zip) => {
      const numberOfCallbacks = Object.keys(zip.files).length - 1;
      let counter = 0;
      let lstFiles = [];
      zip.forEach(function (relativePath, zipEntry) {
        zip.files[zipEntry.name].async('arraybuffer').then((data)=>{
          localforage.setItem(zipEntry.name,data);
          lstFiles.push(zipEntry.name);
          counter++;
          if (counter === numberOfCallbacks) {
            localforage.setItem("/1-1000.zip",lstFiles.filter(f => f.indexOf('.mp3')>0).join(','));
          }
        });
      });
    });
  }
  
  async download() {
    localforage.getItem('token').then(t => console.log(t));
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "https://graph.microsoft.com/v1.0/me/drives/8d708a9b80ebb4b7/root/children/1-1000.zip/content", true);
    let token = await localforage.getItem('token');
    oReq.setRequestHeader('Authorization',`Bearer ${token}`);
    oReq.responseType = "arraybuffer";
    let self = this
    oReq.onload = function(oEvent) {
      var arrayBuffer = oReq.response;
      var blob = new Blob([arrayBuffer], {type: "application/zip"});
      self.downloader(blob);
    };
    oReq.send();
  }

  authorize() {
    authorize(this.http,this.iab);
  }

}
