# GC.Spread.Sheets.Designer Wrapper for VUE

### `npm install`
The dependencies required to install

### `npm run start`
The dependencies required to start sample

### SpreadJS Designer Vue Wrapper Component Markup
```js
<gc-spread-sheets-designer>
</gc-spread-sheets-designer>
```

**styleInfo prop** Pass styleInfo to the component props to customize the designer's style.
```js
<gc-spread-sheets-designer :styleInfo='styleInfo'>
</gc-spread-sheets-designer>
  export default {
    data: function () {
      return {
        styleInfo: { height: '800px', width: '1200px', border: 'solid red 1px' }
      };
    }
  }
```

**config prop** Pass in the custom **config** to customize the Designer.
```js
<gc-spread-sheets-designer :config='customConfig'>
</gc-spread-sheets-designer>
  export default {
    data: function () {
      return {
        config: config //default config json import from local
      };
    },
    computed: {
        customConfig: function () {
            this.config.ribbon[0].buttonGroups.unshift(
                {
                    "label":"NewDesigner",
                    "thumbnailClass":"welcome",
                    "commandGroup":{
                        "children":[
                            {
                                "direction":"vertical",
                                "commands":[
                                    "Welcome"
                                ]
                            }
                        ]
                    }
                }
            );
            let customCommand = {
                title: "Welcome",
                text: "Welcome",
                iconClass: "ribbon-button-welcome",
                bigButton: "true",
                commandName: "Welcome",
                execute: async (context, propertyName) => {
                    alert('Welcome to new designer.');
                }
            }
            this.config.commandMap = {
                Welcome: customCommand
            }
            return this.config;
        }
    }
  }
```
**designerInitialized event** Fired after instantiation.
```js
<gc-spread-sheets-designer @designerInitialized='designerInitialized'>
</gc-spread-sheets-designer>

export default {
    methods: {
      designerInitialized(designer) {
        //this is designer instance
        console.log(designer);
      }
    }
  }
```