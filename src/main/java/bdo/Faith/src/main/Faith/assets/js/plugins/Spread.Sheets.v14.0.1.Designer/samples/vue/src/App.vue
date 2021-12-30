<template>
  <div id="app">
    <gc-spread-sheets-designer :styleInfo='styleInfo' :config='config' @designerInitialized='designerInitialized'>
    </gc-spread-sheets-designer>
  </div>
</template>

<script>

  import '@grapecity/spread-sheets/styles/gc.spread.sheets.excel2013white.css'
  import '@grapecity/spread-sheets-designer/styles/gc.spread.sheets.designer.min.css'
  import '@grapecity/spread-sheets-designer-resources-cn';
  import GC from '@grapecity/spread-sheets';
  GC.Spread.Common.CultureManager.culture("zh-cn");
  import '@grapecity/spread-sheets-resources-zh';
 
  import { Designer } from '@grapecity/spread-sheets-designer-vue'

  export default {
    name: 'App',
    data: function () {
      return {
        styleInfo: { height: "98vh", width: '100%' },
        config: null,
        designer: null
      };
    },
    methods: {
      designerInitialized(value) {
        this.designer = value;

      }
    }
  }
</script>
<style>
</style>