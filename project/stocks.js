
const search = (ev) => {
    term = document.querySelector("#search").value;
    console.log("search for:", term);
    console.log(term);
    document.querySelector("#container").innerHTML = "";
    getData(term);
    getInfo(term);
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
            document.querySelector("#info").innerHTML += `
            <section class="info" >
            <div>
                <h2>${info}</h2>
            </div>
          </section>
            `;
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

