const express = require("express");

const fetch = require("node-fetch");

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const port = "3003";

const paginatedResults = (req, data) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const start = (page - 1) * limit;
  const end = page * limit;

  const results = {};

  if (end > data.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (start > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
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

const fetchApi = () => {
  const body = {
    queryString: "banks",
    resultContext: {
      aspects: ["title", "lifecycle", "location", "summary", "editorial"],
    },
  };
  const options = {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": "59cbaf20e3e06d3565778e7b9758f7892e89468293a48663b98bd1d9",
    },
  };

  return (req, res, next) => {
    fetch(`https://api.ft.com/content/search/v1`, options)
      .then((res) => res.json())
      .then((data) => {
        let results = [];
        const resultData = data.results[0].results;
        const searchKey = req.query.key;

        if (searchKey) {
          const searchedResults = resultData.filter((el) => {
            return (
              el.title.title.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
              el.summary.excerpt.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0 ||
              el.editorial.subheading.toLowerCase().indexOf(searchKey.toLowerCase()) >= 0
            );
          });
          results = paginatedResults(req, searchedResults);
        } else {
          results = paginatedResults(req, resultData);
        }
        results.page = parseInt(req.query.page);
        results.limit = parseInt(req.query.limit);

        res.resultApi = results;
        next();
      });
  };
};

app.get("/api", fetchApi(), (req, res) => {
  res.json(res.resultApi);
});

app.get("/search/", fetchApi(), (req, res) => {
  res.json(res.resultApi);
});

const listener = app.listen(port, function () {
  console.log("server is listtening to the prot: " + listener.address().port);
});
