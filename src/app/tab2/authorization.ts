import pkceChallenge from 'pkce-challenge'
import * as localforage from 'localforage';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Browser } from '@capacitor/browser';
import { HttpClient } from '@angular/common/http';

const openCapacitorSite = async () => {
  
};
async function authorize(http:HttpClient, iab:InAppBrowser) {
  let challenge = pkceChallenge();
  localforage.setItem('codeVerifier',challenge.code_verifier);
  localforage.setItem('codeChallenge',challenge.code_challenge);
  //axios.post('http://localhost:8100/code', {codeVerifier:challenge.code_verifier});
  let opt = {
    client_id: '5ca13223-4cf7-4bf3-9ba9-a8b7fe9ccdd6',
    response_type: 'code',
    code_challenge: challenge.code_challenge,
    code_challenge_method: 'S256',
    scope: 'Files.Read Files.ReadWrite Files.ReadWrite.All Files.ReadWrite.AppFolder',
    redirect_uri: 'http://localhost:8100/tabs/tab2',
    state: '123'
  }
  let query = new URLSearchParams(opt);

  let url = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?${query}`;
  //window.location.href = url;
  navigate(url,iab,http)
}

async function navigate(url:string,iab:InAppBrowser,http:HttpClient){
  var browser = iab.create(url, '_blank', 'location=yes,clearcache=yes,clearsessioncache=yes,hidenavigationbuttons=true,hideurlbar=true,fullscreen=true');
  browser.on('loadstart').subscribe(event => {
     if (event.url.includes('?code')) {
       browser.close();
     const domain = event.url.split('?')[0];
     console.log('domain',domain)
     const params = event.url.split('?')[1];
     console.log('params',params)
     const code = params.split('&')[0].replace('code=','');
     console.log('code',code)
     const url = event.url.replace(domain, 'capacitor://localhost/tabs/tab2?code='+code);
     window.location.href = url;
     getToken(code, http);
    }
  });
}

async function getToken(code, http) {
  let codeVerifier:string = await localforage.getItem('codeVerifier');

  var formData: any = new FormData();
  formData.append('grant_type', 'authorization_code');
  formData.append('code', code);
  formData.append('client_id', '5ca13223-4cf7-4bf3-9ba9-a8b7fe9ccdd6');
  formData.append('scope', 'Files.Read Files.ReadWrite Files.ReadWrite.All Files.ReadWrite.AppFolder');
  formData.append('redirect_uri', 'http://localhost:8100/tabs/tab2');
  formData.append('code_verifier', codeVerifier);
  formData.append('client_assertion_type', 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer');

  http.post("https://login.microsoftonline.com/consumers/oauth2/v2.0/token", formData )
    .subscribe(r => {
      console.log(r)
      localforage.setItem('token',r.access_token)
    });

}

export {authorize, getToken}