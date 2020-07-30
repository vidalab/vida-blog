---
title: Create a Dashboard App with vidajs and blitzjs
date: "2020-07-29T10:10:10.000Z"
description: This tutorial shows how to create a dashboard app with vidajs running on blitzjs.
---

Blitzjs is a fullstack React framework for creating web applications. It integrates the front-end and back-end components. Developers don't have to go through the heavy lifting to put together their node.js applications. Our site, vida.io, is built on top of redwoodjs. But the main component, vidajs, is portable. vidajs allows developers to quickly create dashboard applications using JSON files. The component is usable in React applications. In this tutorial, we explore how to use vidajs in blitzjs.

For more information about blitzjs, see https://blitzjs.com/.

For more information about vidajs, see https://vida.io/.

### Create a blitzjs application

```bash
# Install blitzjs CLI
npm install -g blitz
# Create a new blitzjs app
blitz new VidaBlitz
cd VidaBlitz
blitz start
```

The start command starts the web server, you can view the application in browser, ```http://localhost:3000```.

### Install vidajs

```bash
# Stop the current blitzjs server with Ctrl+C
# In VidaBlitz directory
npm install vidajs
# Start the blitzjs server
blitz start
```

vidajs renders dashboard using a JSON file. In this tutorial, we'd use an example file with 3 charts. You can download the file in the example repository here:

https://github.com/vidalab/VidaBlitz/blob/master/app/pages/viz.json

Download viz.json file and move it into VidaBlitz/app/pages folder.

### Create a dashboard

We're ready to create a dashboard. We'll replace the content of the homepage.

1. Open pages/index.tsx.
2. vidajs uses tailwindcss. Add tailwindcss reference to the Head section.

```html
<link href="https://unpkg.com/tailwindcss@^1.0/dist/tailwind.min.css" rel="stylesheet" />
```

3. Remove the page content in the main section.
4. Add the following component inside the main section.

```html
<main>
  <div style={{ width: "100%", height: "500px" }}>
    <Vida vizData={vizJson} />
  </div>
</main>
```

Refresh your browser, you should see a dashboard rendered by vidajs.

![Example Viz](/example-viz.png)

For more vidajs examples, see https://vida.io.

The source code for this tutorial is available on github, https://github.com/vidalab/VidaBlitz.