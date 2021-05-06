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

const port = 3003;
const listener = app.listen(port, function () {
  console.log("server is listtening to the prot: " + listener.address().port);
});

const paginationResults = (requestPage, data) => {
  const resultData = data.results[0].results
  const { indexCount } = data.results[0]

  const page = requestPage ? parseInt(requestPage) : 1;
  const limit = 10;

  const start = (page - 1) * limit;
  const end = page * limit;

  const results = {};

  results.page = page;
  results.next = end < indexCount ? page + 1 : null
  results.previous = start > 0 ? page - 1 : null
  // results.pages = limit >= indexCount ? 1 : Math.ceil(indexCount / limit);
  results.results = limit >= indexCount ? resultData : resultData.slice(start, end)
 
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
      let results = paginationResults(page, result);
      results.searchKey = searchKey;
      res.render("main", results);
    } else {
      res.render("main", { msg: "Sorry, content not found!" });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get("*", (req, res) => {
  res.render("main", { msg: "Ops, something went wrong, please try again!" });
});
