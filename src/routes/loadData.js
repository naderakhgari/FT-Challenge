import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

import { paginatedResults } from "../util";

const apiKey = process.env.APIKEY;
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
    "X-Api-Key": apiKey,
  },
};

const searchKeyWord = (key, data) => {
  const searchedData = data.filter((el) => {
    return (
      el.title.title.toLowerCase().indexOf(key.toLowerCase()) >= 0 ||
      el.summary.excerpt.toLowerCase().indexOf(key.toLowerCase()) >= 0 ||
      el.editorial.subheading.toLowerCase().indexOf(key.toLowerCase()) >= 0
    );
  });
  return searchedData;
};

export const loadData = async (req, res) => {
  const response = await fetch(`https://api.ft.com/content/search/v1`, options);
  const result = await response.json();
  let resultData = result.results[0].results;

  const searchKey = req.query.key;
  if (searchKey) {
    resultData = searchKeyWord(searchKey, resultData);
  }
  const results = paginatedResults(req, resultData);
  res.json(results);
};
