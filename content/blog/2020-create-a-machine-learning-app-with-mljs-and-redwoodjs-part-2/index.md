---
title: Create a Machine Learning App with mljs and redwoodjs (Part 2)
date: "2020-08-17T10:10:10.000Z"
description:  The previous tutorial processes data on the client-side. In this follow-up tutorial, we create a similar machine learning application. It processes data on the server-side.
---

In the previous tutorial, we created a machine learning application with mljs and redwoodjs. The tutorial loads mljs library and processes COVID data on the client-side. In this tutorial, we create a similar application. We use server-side processing. Server-side processing allows us to create more complex data applications. We can store training models and data on the server. We only send prediction data to the client-side.

The source code for this tutorial is available on GitHub: https://github.com/vidalab/redwoodjs-mljs-2. The app displays COVID-19 daily increase in the US and its linear regression.

![COVID-19 daily increase in the US and its linear regression](/mljs-viz.png)

### Create a redwoodjs application

(This part is the same as the first tutorial)

We start by creating a new redwoodjs application. For more information, see [redwoodjs](https://redwoodjs.com/) website.

```bash
yarn create redwood-app ./redwoodjs-mljs
cd redwoodjs-mljs
yarn redwood dev
```

Upon completion, your default browser should open the template redwoodjs application. We now need to create a homepage for display.

```bash
yarn redwood generate page home /
```

We make sure the default root page now points to HomePage in Routes.js.

```javascript
// web/src/Routes.js
<Route path="/" page={HomePage} name="home" />
```

In the HomePage folder, create a new React component COVIDRegression.js. We start with an empty component. We'll add more content in later steps.

```javascript
// web/src/HomePage/COVIDRegression.js
import React from 'react'

class COVIDRegression extends React.Component {
  render() {
    return (
      <></>
    )
  }
}
```

We load the COVIDRegression component into HomePage.

```javascript
// web/src/HomePage/HomePage.js
import COVIDRegression from './COVIDRegression'

const HomePage = () => {
  return (
    <>
      <COVIDRegression/>
    </>
  )
}

export default HomePage
```

### Send data from server-side

redwoodjs uses GraphQL for communication between client-side and server-side components. We want to add the node.js packages that we'll use on the server-side.

```bash
yarn workspace api add ml-regression-simple-linear d3-time-format node-fetch
```

We now define the data layer. Create an SDL schema file.

```javascript
// api/src/graphql/covid.sdl.js

export const schema = gql`
  type CovidData {
    usDaily: String!
  }

  type Query {
    getCovidData(name: String!): CovidData!
  }
`
```

Next, we define a function to process this query. In this function, we pull data from the COVID Tracking Project and perform a linear regression analysis using mljs library.

```javascript
// api/src/services/covid.js

import fetch from 'node-fetch'
import SimpleLinearRegression from 'ml-regression-simple-linear'
import { timeFormat, timeParse } from 'd3-time-format'

const calculateRegression = (json) => {
  // we'll format time into UNIX timestamp
  let tf = timeFormat("%s")
  // this is the input time format
  let tp = timeParse("%Y%m%d")
  let x = json.map(d => +tf(tp(d.date)))
  let y = json.map(d => d.positiveIncrease)

  let regression = new SimpleLinearRegression(x, y)
  let predictY = json.map(d => regression.predict(+tf(tp(d.date))))
  json.map((d, i) => {
    d.predictPositiveIncrease = predictY[i]
  })
}

export const getCovidData = async ( { name } ) => {
  const response = await fetch('https://covidtracking.com/api/v1/us/daily.json')
  let json = await response.json()
  json = json.reverse()
  // filter out data prior to March 01, 2020
  // COVID testing did not start before,
  // so the numbers are very low
  json = json.filter(d => d.date > 20200301)
  calculateRegression(json)

  return {
    usDaily: JSON.stringify(json)
  }
}
```

The calculateRegression function in this case is almost identical to the function in the first tutorial. This is an advantage of using JavaScript. We can reuse source code on the server-side.

### Load COVID data on the client-side

We use the Cell feature of redwoodjs to load the data. In this Cell, we define a query that mirrors the query definition previously defined on the server-side.

```javascript
// web/src/components/COVIDDataCell.js

import React from 'react'

export const QUERY = gql`
  query($name: String!) {
    covidData: getCovidData(name: $name) {
      usDaily
    }
  }
`

export const Loading = () => <div>Loading...</div>

export const Empty = () => <div>Empty</div>

export const Failure = ({ error }) => <div>Error: {error.message}</div>

export const Success = ({ covidData }) => {
  return JSON.stringify(covidData)
}
```

### Add vidajs and visualize the result

We add vidajs package into the web workspace.

```bash
yarn workspace web add vidajs
```

```javascript
// web/src/components/COVIDDataCell.js

import Vida from 'vidajs'

// ...

// render US daily increase data
export const Success = ({ covidData }) => {
  let vizJson = {
    "name": "US COVID-19 Positive Increase with ml.js Linear Regression",
    "description": "Data from @COVIDTracking Project",
    "columns": 2,
    "rows": 1,
    "data": [
      {
        "name": "covid-data",
        "values": JSON.parse(covidData.usDaily)
      }
    ],
    "charts": [
      {
        "type": "line", "data": "covid-data",
        "title": "US COVID-19 Positive Increase with ml.js Linear Regression",
        "position": {
          "columns": 2,
          "rows": 1,
          "x": 0,
          "y": 0
        },
        "axes": {
          "x": {
            "label": "date",
            "dataColumn": "date",
            "dataType": "time",
            "dataFormat": "%Y%m%d",
            "displayFormat": "%b %d",
            "timePrecision": "day"
          },
          "y": {
            "label": "count",
            "dataColumns": [
              {"name": "positiveIncrease", "color": "#8884d8"},
              {"name": "predictPositiveIncrease", "color": "#bb84d8"}
            ]
          }
        }
      }
    ]
  }
  return (
    <>
      <div style={{width: "100%", height: "500px"}}>
        <Vida vizData={vizJson} />
      </div>
    </>
  )
}
```

Our app is complete.

### Deploy the application to Netlify

Like the previous application, this application is based on redwoodjs. We can deploy it on Netlify. For more information, see redwoodjs deployment guide: https://redwoodjs.com/tutorial/deployment.