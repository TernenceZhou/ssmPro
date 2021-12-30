import { Component, ViewEncapsulation } from '@angular/core';
import * as GC from '@grapecity/spread-sheets';
import '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-designer-resources-cn';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'cn';
  props = {
    styleInfo: "width: 100%; height: 98vh; margin-top: 10px",
    config: null
  };

  changeCulture(designer) {
    GC.Spread.Common.CultureManager.culture("zh-cn");
  }
}
