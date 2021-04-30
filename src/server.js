import express from "express";
import routes from "./routes";

const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use("/", routes);

const port = process.env.PORT || 3003;

const listener = app.listen(port, function () {
  console.log("server is listtening to the prot: " + listener.address().port);
});
