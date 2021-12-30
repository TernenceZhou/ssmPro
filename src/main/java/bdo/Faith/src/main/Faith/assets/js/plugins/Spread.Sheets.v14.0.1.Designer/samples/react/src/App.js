import React from 'react';
import '@grapecity/spread-sheets-resources-zh';
import '@grapecity/spread-sheets-designer-resources-cn';
import * as GC from '@grapecity/spread-sheets';
import {Designer} from '@grapecity/spread-sheets-designer-react';
import "@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css"
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css"

GC.Spread.Common.CultureManager.culture('zh-cn');

function App() {
  return (
    <Designer styleInfo = {{"100%", height: '98vh'}}></Designer>
  )
}

export default App;
