---
title: Create a Machine Learning App with mljs and redwoodjs
date: "2020-08-12T10:10:10.000Z"
description: Create a simple application that uses machine learning library mljs on redwoodjs framework. We deploy the final application to Netlify.
---

Data science applications are complex. They need to work across multiple software stacks. Popular libraries existed only in data-driven languages like Python and R. Node.js stack has evolved quickly in the last few years. There are new data processing libraries available in JavaScript. In this tutorial, we will create a redwoodjs application. We use mljs, a JavaScript-based machine learning library, for linear regression. We'll visualize the final result with vidajs. Finally, we'll deploy the application to Netlify.

The source code for this tutorial is available on GitHub: https://github.com/vidalab/redwoodjs-mljs. The app displays COVID-19 daily increase in the US and its linear regression.

![COVID-19 daily increase in the US and its linear regression](/mljs-viz.png)

### Create a redwoodjs application

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

### Load data from the COVID Tracking Project

We have the 2 components of the app UI. We need data for analysis and visualization. We'll use the COVID-19 daily cases from the COVID Tracking Project. In COVIDRegression.js, add the following code.

```javascript
class COVIDRegression extends React.Component {
  // initialize state in constructor
  // we'll update this state when we finish loading data
  constructor(props) {
    super(props)
    this.state = {
      covidData: null
    }
  }

  componentDidMount() {
    // fetch data from the COVID Tracking Project
    fetch('https://covidtracking.com/api/v1/us/daily.json')
      .then(async (response) => {
        let json = await response.json()
        json = json.reverse()
        // filter out data prior to March 01, 2020
        // COVID testing did not start before,
        // so the numbers are very low
        json = json.filter(d => d.date > 20200301)
        // this function is described in the next section
        this.calculateRegression(json)
        this.setState({
          covidData: json
        })
      })
  }

  render() {
    // we just dump the data on the screen for now
    // we'll display the data in a visualization later
    return (
      <>
        <div style={{width: "100%", height: "500px"}}>
          {this.state.covidData ? JSON.stringify(this.state.covidData) : 'Loading...'}
        </div>
      </>
    )
  }
}
```

### Load mljs and perform linear regression

We're ready for data analysis. Open index.html file and include ml.js script.

```html
<script src="https://www.lactame.com/lib/ml/4.0.0/ml.min.js"></script>
```

Add a function to calculate linear regression for the data.

```javascript
class COVIDRegression extends React.Component {
  // ...
  calculateRegression(json) {
    // we'll format time into UNIX timestamp
    let tf = timeFormat("%s")
    // this is the input time format
    let tp = timeParse("%Y%m%d")
    let x = json.map(d => +tf(tp(d.date)))
    let y = json.map(d => d.positiveIncrease)

    let regression = new ML.SimpleLinearRegression(x, y)
    let predictY = json.map(d => regression.predict(+tf(tp(d.date))))
    json.map((d, i) => {
      d.predictPositiveIncrease = predictY[i]
    })
  }
  // ...
}
```

### Add vidajs and visualize the result

We have the positiveIncrease and the predictPositiveIncrease data. We want to visualize them. We'd use vidajs (obviously :)).

We add vidajs to the web workspace

```bash
yarn workspace web add vidajs
```

We update our render function to display the visualization.

```javascript
class COVIDRegression extends React.Component {
  render() {
    let vizJson = {
      "name": "US COVID-19 Positive Increase with ml.js Linear Regression",
      "description": "Data from @COVIDTracking Project",
      "columns": 2,
      "rows": 1,
      "data": [
        {
          "name": "covid-data",
          "values": this.state.covidData
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
          {this.state.covidData ? <Vida vizData={vizJson} /> : 'Loading...'}
        </div>
      </>
    )
  }
}
```

Our app is complete.

### Deploy the application to Netlify

redwoodjs applications can be quickly deployed to Netlify. You can host it for free or at very low cost. There is no server to maintain. redwoodjs team put together a good tutorial for this: https://redwoodjs.com/tutorial/deployment.