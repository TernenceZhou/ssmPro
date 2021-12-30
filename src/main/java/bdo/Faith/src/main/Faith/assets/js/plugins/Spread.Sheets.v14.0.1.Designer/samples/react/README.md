# GC.Spread.Sheets.Designer Wrapper for React

### `npm install`
The dependencies required to install

### `npm run start`
The dependencies required to start sample

### SpreadJS Designer React Wrapper Component Markup
```js
<Designer></Designer>
```

**styleInfo prop** Pass styleInfo to the component props to customize the designer's style.
```js
<Designer styleInfo = {{"1500px", height: '90vh'}}></Designer>
```

**config prop** Pass in the custom **config** to customize the Designer.
```js
<Designer config = {customConfig()}></Designer>

function customConfig() {
    //config import from local
    config.ribbon[0].buttonGroups.unshift(
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
    config.commandMap = {
        Welcome: customCommand
    }
    return config;
}
```
**designerInitialized event** Fired after instantiation.
```js
<Designer designerInitialized = {designer => {getDesigner(designer)}}></Designer>

function getDesigner(designer) {
    //this is designer instance
    console.log(designer);
}
```