```
ionic start mypilot1 tabs --type=angular --capacitor
cd ./mypilot1
ionic capacitor add android
npm install @capawesome/capacitor-file-picker
ionic build
npx cap sync

npm install @capacitor/filesystem
npx cap sync
```

#### running google chrome without CORS
google-chrome --user-data-dir=/tmp --disable-web-security

#### build error
não executar: `ionic capacitor build android`  
ao invés, é necessário executar: `ionic build`, depois `npx cap sync`, executar o android-studio e abrir a pasta android


#### In App Browser
```
npm install cordova-plugin-inappbrowser
npm install @awesome-cordova-plugins/in-app-browser
npm i '@awesome-cordova-plugins/core'
```

importar InAppBrowser de @awesome-cordova-plugins/in-app-browser/ngx  

#### Debug Device
abrir o navegador no pc:  
chrome://inspect/#devices


#### parear via wifi e abrir diretamente no celular
Abrir "Config" -> "Opções de desenvolvedor" -> "Depuração por Wi-Fi" no android  
parear usando codigo  
solicitar pareamento com codigo  
`cd $ANDROID_SDK/platform-tools/`  
`adb pair 198.168.1.187:42809`  
`adb connect 192.168.1.187:39049`  
`ionic capacitor run android --livereload --external`  