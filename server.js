const express = require("express");

const fetch = require("node-fetch");

const app = express();
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const port = "3003";

const fetchApi = () => {
  const bodySend = {
    queryString: "banks",
    resultContext: {
      aspects: ["title", "lifecycle", "location", "summary", "editorial"],
    },
  };
  const options = {
    method: "POST",
    body: JSON.stringify(bodySend),
    headers: {
      "Content-Type": "application/json",
      "X-Api-Key": "59cbaf20e3e06d3565778e7b9758f7892e89468293a48663b98bd1d9",
    },
  };

  return (req, res, next) => {
    fetch(`https://api.ft.com/content/search/v1`, options)
      .then((res) => res.json())
      .then((data) => {
        const resultData = data.results[0].results;

        res.resultApi = resultData;
        next();
      });
  };
};

app.get("/api", fetchApi(), (req, res) => {
  res.json(res.resultApi);
});
const listener = app.listen(port, function () {
  console.log("server is listtening to the prot: " + listener.address().port);
});
