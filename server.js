const http = require("https");
const express = require("express");
const { request } = require("http");
const app = express();
const bodyParser = require("body-parser");
let ejs =require("ejs");
app.set("view engine","ejs");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
let companyName = "ITC.NS";
app.get("/", (request, response) => {
  response.sendFile(__dirname+"/home.html");
});

app.post("/api/data", (requ, resp) => {
  companyName =
  JSON.parse(requ.body.companyName)+".ns";
  console.log(requ.body);

  const options = {
    method: "GET",
    hostname: "apidojo-yahoo-finance-v1.p.rapidapi.com",
    port: null,
    path: "/market/v2/get-quotes?region=IN&symbols=" + companyName,
    headers: {
      "X-RapidAPI-Key": "b23c711cdemsh5279606922d2ae6p119a11jsn51e867c9e3e5",
      "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      useQueryString: true,
    },
  };

  const request = http.request(options, function (res) {
    const chunks = [];
    let stockData;

    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      try {
        stockData = JSON.parse(body);
      } catch (e) {
        console.log(e)
      }
      console.log(JSON.parse(JSON.stringify(stockData)));
      if ((stockData.quoteResponse.result).length !== 0) {
        // resp.send(stockData)
        let previousClose =
          stockData.quoteResponse.result[0].regularMarketPreviousClose;
        let previousOpen = stockData.quoteResponse.result[0].regularMarketOpen;
        let high = stockData.quoteResponse.result[0].regularMarketDayHigh;
        let low = stockData.quoteResponse.result[0].regularMarketDayLow;
        let fthigh = stockData.quoteResponse.result[0].fiftyTwoWeekHigh;
        let ftlow = stockData.quoteResponse.result[0].fiftyTwoWeekLow;
        let liveprice = stockData.quoteResponse.result[0].regularMarketPrice;
        // resp.write("<h1>Current Price: " + liveprice + "</h1>");
        // resp.write("<h2>Previous open: " + previousOpen + "</h2>");
        // resp.write("<h2>Previous close: " + previousClose + "</h2>");
        // resp.write("<h2>High: " + high + "</h2>");
        // resp.write("<h2>Low: " + low + "</h2>");
        // resp.write("<h2>52 week high: " + fthigh + "</h2>");
        // resp.write("<h2>52 week low: " + ftlow + "</h2>");
        const data={
          compName:companyName.toUpperCase().slice(0,-3),
          currPrice:" ₹ "+liveprice,
          popen:" ₹ "+previousOpen,
          pclose:" ₹ "+previousClose,
          thigh:" ₹ "+high,
          tlow:" ₹ "+low,
          fhigh:" ₹ "+fthigh,
          flow:" ₹ "+ftlow,
          statusCode:200
        }
        resp.json(data);
      } else {
        resp.json("{statusCode:404}");
      }
    });
  });

  request.end();
});
app.get("/app/data",(req,res)=>{

res.sendFile(__dirname+"/temp.html");
   console.log("hello");
});

app.post("/app/data",(reque,respo)=>{
  // if(reque.body.newItem)
  // {
  console.log(reque.body.newItem);
 var listName = reque.body.newItem+".ns";
  const options = {
    method: "GET",
    hostname: "apidojo-yahoo-finance-v1.p.rapidapi.com",
    port: null,
    path: "/market/v2/get-quotes?region=IN&symbols=" + listName,
    headers: {
      "X-RapidAPI-Key": "b23c711cdemsh5279606922d2ae6p119a11jsn51e867c9e3e5",
      "X-RapidAPI-Host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
      useQueryString: true,
    },
  };

  const request = http.request(options, function (res) {
    const chunks = [];
    let stockDat;
    res.on("data", function (chunk) {
      chunks.push(chunk);
    });

    res.on("end", function () {
      const body = Buffer.concat(chunks);
      try {
        stockDat = JSON.parse(body);
       
      } catch (e) {
        console.log(e)
      }
      console.log(JSON.parse(JSON.stringify(stockDat)));
    })
  })
  request.end();
// }
})
app.listen(3000, () => {
  console.log("Server started on port 3000");
});
