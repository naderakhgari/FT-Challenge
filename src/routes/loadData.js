import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

import { paginatedResults } from "../util";

const apiKey = process.env.APIKEY;
const apiUrl = process.env.URL;

export const loadData = async (req, res) => {
  const searchKey = req.query.searchKey;
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
  try{
    const response = await fetch(apiUrl, options);
    const result = await response.json();
    let resultData = result.results[0].results;
    console.log('what about now?',result.query.resultContext.maxResults)
    const results = paginatedResults(req, resultData);
    res.json(results);
  }catch(err){
    
    console.log('no entry found!',err)
    res.status(400).send(err)
  }
};
