const rootElem = document.getElementById("root");
const searchDiv = document.createElement("div");
const headlineDiv = document.createElement("div");

const searchText = document.createElement("input");

searchText.placeholder = "search...";
searchText.type = "text";

headlineDiv.className = "head-lines";
rootElem.appendChild(searchDiv);
rootElem.appendChild(headlineDiv);

searchDiv.appendChild(searchText);

const getAllData = async () => {
  const response = await fetch("/api?page=2&limit=8");
  return await response.json();
};

function makePageForHeadLines(headLines) {
  headlineDiv.innerHTML = "";
  headLines.forEach((headeLine) => {
    headlineDiv.innerHTML += `
    <div class="headLine">
      <div class="divElStyle2 col-11 sm-col-11 md-col-11 lg-col-11 xl-col-11">
        <h2 class="h2ElStyle col-12" id=${headeLine.id}>${headeLine.title.title}</h2>
        <ul>
          <li>${headeLine.editorial.byline}</li>
          <li>${headeLine.editorial.subheading}</li>
        </ul>
        <p>${headeLine.summary.excerpt}</p>
      </div>
    </div>`;
  });
}

async function setup() {
  let headeLineData = [];
  try {
    headeLineData = await getAllData();
  } catch (err) {
    console.log("there is an error", err);
  }
  console.log(headeLineData);
  makePageForHeadLines(headeLineData.results);
}

window.onload = setup;
