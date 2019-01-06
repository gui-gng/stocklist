import React, { Component } from "react";
import axios from "axios";
import { SSL_OP_TLS_ROLLBACK_BUG } from "constants";
var Chart = require("chart.js");


class App extends Component {
  // initialize our state 
  state = {
    data: [],
    stocks:[],
    stock:{},
    id: 0,
    message: null,
    base: null,
    date: null,
    rates: [],
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
    symbol: ""
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {

    var labels = ['2018-12-10','2018-12-11'];
    var data = [[0.2,0.25],[0.2,0.25],[0.2,0.25],[0.2,0.25]];
    this.updateChart(labels, data);
    
  };

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  };

  updateChart = (labels, data) => {
    const node = this.node;
    var myChart = new Chart(node, {
      type: "line",
      options:{
        tooltips: {
          // Disable the on-canvas tooltip
          enabled: false,

          custom: function(tooltipModel) {
              // Tooltip Element
              var tooltipEl = document.getElementById('chartjs-tooltip');

              // Create element on first render
              if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = "<table></table>";
                  document.body.appendChild(tooltipEl);
              }

              // Hide if no tooltip
              if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
              }

              // Set caret Position
              tooltipEl.classList.remove('above', 'below', 'no-transform');
              if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
              } else {
                  tooltipEl.classList.add('no-transform');
              }

              function getBody(bodyItem) {
                  return bodyItem.lines;
              }

              // Set Text
              if (tooltipModel.body) {
                  var titleLines = tooltipModel.title || [];
                  var bodyLines = tooltipModel.body.map(getBody);

                  var innerHtml = '<thead>';

                  titleLines.forEach(function(title) {
                      innerHtml += '<tr><th>' + title + '</th></tr>';
                  });
                  innerHtml += '</thead><tbody>';

                  bodyLines.forEach(function(body, i) {
                      var colors = tooltipModel.labelColors[i];
                      var style = 'background:' + colors.backgroundColor;
                      style += '; border-color:' + colors.borderColor;
                      style += '; border-width: 2px';
                      var span = '<span style="' + style + '"></span>';
                      innerHtml += '<tr><td>' + span + body + '</td></tr>';
                  });
                  innerHtml += '</tbody>';

                  var tableRoot = tooltipEl.querySelector('table');
                  tableRoot.innerHTML = innerHtml;
              }

              // `this` will be the overall tooltip
              var position = this._chart.canvas.getBoundingClientRect();

              // Display, position, and set styles for font
              tooltipEl.style.opacity = 1;
              tooltipEl.style.position = 'absolute';
              tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 'px';
              tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';
              tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily;
              tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px';
              tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle;
              tooltipEl.style.padding = tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px';
              tooltipEl.style.pointerEvents = 'none';
          }
      }
      },
      data: {
        labels: labels,
        pointRadius:0,
        datasets: [
          {
            pointRadius:0,
            label: "Open",
            fill:false,
            borderColor: 'rgba(50,180,50,1)',
            data: data[0]
            
          },
          {
            pointRadius:0,
            label: "High",
            fill:false,
            borderColor: 'rgba(50,180,50,1)',
            data: data[1]
          },
          {
            pointRadius:0,
            label: "Low",
            fill:false,
            borderColor: 'rgba(180,50,50,1)',
            data: data[2]
          },
          {
            pointRadius:0,
            label: "Close",
            fill:false,
            borderColor: 'rgba(50,50,50,1)',
            data: data[3]
          }
        ]
      }
    });
    
  };

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };


  getStockFromDb = () => {
    fetch("/api/getStocks")
      .then(data => data.json())
      .then(res => this.setState({ stocks: res.data }));
  };


  getStockFromDb = symbol => {
    const self = this;
    var stockParam = {symbol: symbol};
    fetch('/api/getStocks',{
      method: "POST",
      body: JSON.stringify(stockParam),
      headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
      },
    })
    .then(data => data.json())
    .then(response => {
      this.setState({ stocks: response.data });
    });

    /*
    axios.post("/api/getStocks", {
      symbol: symbol
    }).then(response => {
      console.log("Response: ----" );
      this.setState({ stocks: response.data });
    });
    */


  };




  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };


  updateStock = (symbolToUpdate) => {
    axios.post("/api/updateStock", {
      symbol: symbolToUpdate,
    });
  };


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {

    const  { stocks } = this.state;
    let rows = [];
    if(this.state.stocks.length > 0){

      var labels = [];
      
      var dataOpen = [];
      var dataHigh = [];
      var dataLow = [];
      var dataClose = [];
      var data = [dataOpen,dataHigh, dataLow, dataClose];
      const  stockData  = stocks[0].data;
      //stockData.length
      for (var i = 0; i < stockData.length ; i++){
        let cell = [];
        let date = stockData[i].Date;
        labels.push(date);
        dataOpen.push(stockData[i].open["$numberDecimal"]);
        dataHigh.push(stockData[i].high["$numberDecimal"]);
        dataLow.push(stockData[i].low["$numberDecimal"]);
        dataClose.push(stockData[i].close["$numberDecimal"]);

        rows.push(
        <tr key={i} id={date}>
          <td>{date}</td>
          <td>{stockData[i].open["$numberDecimal"]}</td>
          <td>{stockData[i].high["$numberDecimal"]}</td>
          <td>{stockData[i].low["$numberDecimal"]}</td>
          <td>{stockData[i].close["$numberDecimal"]}</td>
          <td>{stockData[i].volume}</td>
        </tr>
        );


      }


      this.updateChart(labels, data);
    }
    return (
      
      <div>
        <div style={{ padding: "10px" }}>
          <input
            type="text"
            style={{ width: "200px" }}
            onChange={e => this.setState({ symbol: e.target.value })}
            placeholder="Symbol"
          />
          <button
            onClick={() =>
              this.getStockFromDb(this.state.symbol)
            }
          >
            Search
          </button>
        </div>
        

        <ul>
          {stocks.length <= 0
            ? "NO DB ENTRIES YET"
            : stocks.map(dat => (
                <li style={{ padding: "10px" }} key={stocks.id}>
                  <span style={{ color: "gray" }}> Symbol: </span> {dat.symbol} <br />
                  <span style={{ color: "gray" }}> Name: </span> {dat.name}
                </li>
              ))}
        </ul>

       <canvas
          style={{ width: 800, height: 300 }}
          ref={node => (this.node = node)}
        />


              

      </div>
    );
  }
}

export default App;