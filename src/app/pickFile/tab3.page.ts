import { Component } from '@angular/core';
import { FilePicker, PickFilesResult } from '@capawesome/capacitor-file-picker';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  constructor() {}

  file:string = '';

  async choose() {
    let rfiles:PickFilesResult = await FilePicker.pickFiles({ types:['application/json'], multiple:false, readData: true });
    this.file = atob(rfiles.files[0].data??'');
  }
  

}
