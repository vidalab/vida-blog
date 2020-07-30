---
title: Use Monaco Editor in Redwoodjs
date: "2020-05-18T10:10:10.000Z"
description: How we integrate Monaco Editor to Vida application with webpack plugins.
---

*Vida Team Mission: Make data science accessible across the web*

We're getting to the next phase of Vida development. We want to replace the default browser textarea editor by something more eye catchy. We decided to go with [monaco-editor](https://github.com/microsoft/monaco-editor). In this article, we show the steps to integrate monaco-editor component to redwoodjs. It makes use of redwoodjs's webpack plugins.

### Create a redwoodjs application

If you need redwoodjs CLI, go to [this tutorial](https://redwoodjs.com/tutorial/prerequisites) to install.

We create the redwood-monaco application:

```bash
yarn create redwood-app ./redwood-monaco
cd redwood-monaco
yarn redwood dev
```

The final command will open the application in ```http://localhost:8910/```.

We generate the homepage for this application. We'll add monaco-editor to this page:

```bash
yarn redwood generate page home /
```

### Add monaco-editor packages

We are ready to integrate Monaco Editor. We'll add two packages to redwoodjs web workspace.

- ```react-monaco-editor```: This is a React wrapper around monaco-editor package.
- ```monaco-editor-webpack-plugin```: This webpack plugin package allows us to load languages that we want to use. In this example, we'll load the json language.

```bash
yarn workspace web add react-monaco-editor monaco-editor-webpack-plugin
```

Restart your redwood dev server to load the new packages.

### Render Monaco Editor

Let's open the Homepage file and add monaco editor, ```web/src/pages/HomePage/Homepage.js```.

We need to import react-monaco-editor package:

```typescript
import MonacoEditor from 'react-monaco-editor'
```

Then, replace the below text:

```html
<p>Find me in ./web/src/pages/HomePage/HomePage.js</p>
```

With:

```html
<MonacoEditor
  width="800px"
  height="600px"
  language="json"
  theme="vs-dark"
  value={JSON.stringify({a: 1, b: 2}, null, '  ')}
  options={{}}
/>
```

After this, we should see a Monaco Editor rendered on homepage.

### Configure webpack language plugin

We want the editor to perform syntax highlight. To achieve this, we need Monaco language webpack plugin. Redwoodjs allows extension to its webpack config by adding the file ```webpack.config.js``` to the ```web/config/``` directory.

We add the file with the below content to load the json language package.

```javascript
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = (config) => {
  config.plugins.push(
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['json']
    })
  )

  return config
}
```

After restarting Redwoodjs dev server, we should see json language syntax highlight.

Here's the code repository for this example: https://github.com/vidalab/redwood-monaco

Happy Coding!