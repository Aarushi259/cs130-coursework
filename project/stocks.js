
const search = (ev) => {
    term = document.querySelector("#search").value;
    console.log("search for:", term);
    console.log(term);
    document.querySelector("#container").innerHTML = "";
    getData(term);
    getInfo(term);
    getDCF(term);
    getRating(term);
    if (ev) {
        ev.preventDefault();
    }
};


const getData = (term) => {
    console.log("is search still working:", term);
    let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${term}&outputsize=full&apikey=X1YEWS4FYL75F5YL`;
    console.log(url);
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            date = Object.keys(data["Time Series (Daily)"]);
            dat = [];
            date.forEach(item => dat.push({
                x: item,
                open: parseFloat(data["Time Series (Daily)"][item]["1. open"]),
                high: parseFloat(data["Time Series (Daily)"][item]["2. high"]),
                low: parseFloat(data["Time Series (Daily)"][item]["3. low"]),
                close: parseFloat(data["Time Series (Daily)"][item]["4. close"])
            }));

            var table = anychart.data.table('x');
            table.addData(dat);
            var mapping = table.mapAs({ 'open': 'open', 'high': 'high', 'low': 'low', 'close': 'close' });

            // create stock chart
            var chart = anychart.stock();

            // create first plot on the chart
            var plot = chart.plot(0);

            // set grid settings
            plot.yGrid(true).xGrid(true).yMinorGrid(true).xMinorGrid(true);

            var series = plot.candlestick(mapping)
                .name(`${term}`);
            series.legendItem().iconType('rising-falling');

            // create scroller series with mapped data
            chart.scroller().candlestick(mapping);

            // set chart selected date/time range
            chart.selectRange('2022-01-02', '2022-05-27');

            // create range picker
            var rangePicker = anychart.ui.rangePicker();

            // init range picker
            rangePicker.render(chart);

            // create range selector
            var rangeSelector = anychart.ui.rangeSelector();

            // init range selector
            rangeSelector.render(chart);

            // sets the title of the chart
            chart.title(`${term}` + ' Stock Market Chart');

            // set container id for the chart
            chart.container('container');

            // initiate chart drawing
            chart.draw();
        })
}

const getInfo = (term) => {
    let url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${term}&apikey=X1YEWS4FYL75F5YL`;
    console.log(url);
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            info  = data["Description"];
            console.log(data["Description"]);
            console.log(info);
            document.querySelector("#desc").innerHTML = `
            <h2>${info}</h2>`;
        })
    }

    
document.querySelector("#search").onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};

const getDCF = (term) => {
    let url = `https://financialmodelingprep.com/api/v3/discounted-cash-flow/${term}?apikey=da96dcd8096e8e532ab30a3c4b81d19b`;
    console.log(url);
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            symb = data[0]["symbol"];
            dcf = data[0]["dcf"];
            price = data[0]["Stock Price"];
            document.querySelector("#dcf").innerHTML =
            `
            <h1><span class="blue">Stock</span> <span class="yellow">Information</span></h1>
                            <table class="container">
                              <thead>
                                <tr>
                                  <th><h1>Metric</h1></th>
                                  <th><h1>Value</h1></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Stock</td>
                                  <td>${symb}</td>
                                </tr>
                                <tr>
                                  <td>Stock Price</td>
                                  <td>${price}</td>
                                </tr>
                                <tr>
                                  <td>DCF Value</td>
                                  <td>${dcf}</td>
                                 </tr>
            `
        })
    }

    
document.querySelector("#search").onkeyup = (ev) => {
    // Number 13 is the "Enter" key on the keyboard
    console.log(ev.keyCode);
    if (ev.keyCode === 13) {
        ev.preventDefault();
        search();
    }
};

const getRating = (term) => {
    let url = `https://financialmodelingprep.com/api/v3/rating/${term}?apikey=da96dcd8096e8e532ab30a3c4b81d19b`;
    console.log(url);
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            score = data[0]["ratingScore"];
            rec = data[0]["ratingRecommendation"];
            document.querySelector("#dcf").innerHTML =
            `
            <h1><span class="blue">Stock</span> <span class="yellow">Information</span></h1>
                            <table class="container">
                              <thead>
                                <tr>
                                  <th><h1>Metric</h1></th>
                                  <th><h1>Value</h1></th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Stock</td>
                                  <td>${symb}</td>
                                </tr>
                                <tr>
                                  <td>Stock Price</td>
                                  <td>${price}</td>
                                </tr>
                                <tr>
                                  <td>DCF Value</td>
                                  <td>${dcf}</td>
                                 </tr>
            <tr>
            <td>Rating</td>
            <td>${score}</td>
            </tr>
            <tr>
            <td>Recommendation</td>
            <td>${rec}</td>
            </tr>
            </tbody>
        </table>
            `
        })
    }

    function getRequest(url, success) {
        var req = false;
        try {
          req = new XMLHttpRequest();
        } catch (e) {
          try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
          } catch (e) {
            try {
              req = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
              return false;
            }
          }
        }
        if (!req) return false;
        if (typeof success != 'function') success = function() {};
        req.onreadystatechange = function() {
          if (req.readyState == 4) {
            if (req.status === 200) {
              success(req.responseText)
            }
          }
        }
        req.open("GET", url, true);
        req.send(null);
        return req;
      }



