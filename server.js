const express = require("express");
const exphbs = require("express-handlebars");
const fetch = require("node-fetch");
const dotenv = require("dotenv");
dotenv.config();

const apiKey = process.env.APIKEY;
const apiUrl = process.env.URL;
const app = express();
app.use(express.static(__dirname + "/public"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "index",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
    partialsDir: __dirname + "/views/partials",
  })
);

const paginationResults = (requestPage, data) => {
  const page = requestPage ? parseInt(requestPage) : 1;
  const limit = 10;

  const start = (page - 1) * limit;
  const end = page * limit;

  const results = {};
  results.page = page;

  if (end < data.length) {
    results.next = page + 1;
  } else {
    results.next = null;
  }

  if (start > 0) {
    results.previous = page - 1;
  } else {
    results.previous = null;
  }

  if (limit >= data.length) {
    results.pages = 1;
    results.results = data;
  } else {
    results.pages = Math.ceil(data.length / limit);
    results.results = data.slice(start, end);
  }
  return results;
};

app.get("/", async (req, res) => {
  const { searchKey, page } = req.query;

  const body = {
    queryString: searchKey,
    resultContext: {
      aspects: ["title", "lifecycle", "location", "summary", "editorial"],
    },
  };

  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": apiKey,
    },
  };

  try {
    const response = await fetch(apiUrl, options);
    const result = await response.json();

    if (result.results[0].indexCount) {
      let resultData = result.results[0].results;
      let results = paginationResults(page, resultData);
      results.searchKey = searchKey;
      res.render("main", results);
    } else {
      res.render("main", { msg: "Sorry, content not found!" });
    }
  } catch (err) {
    res.status(400).send(err);
  }

  app.get("*", (req, res) => {
    res.render("main", { msg: "Sorry, content not found!" });
  });
});

const port = 3003;
const listener = app.listen(port, function () {
  console.log("server is listtening to the prot: " + listener.address().port);
});
