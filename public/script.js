const rootElem = document.getElementById("root");
const searchDiv = document.createElement("div");
const headlineDiv = document.createElement("div");

const searchText = document.createElement("input");
const searchButton = document.createElement("button");
const selectHeadline = document.createElement("select");
searchButton.innerText = "Search";

searchText.placeholder = "search...";
searchText.type = "text";

selectHeadline.innerHTML = `
<option value=${10}>${10}</option>
<option value=${20}>${20}</option>
<option value=${50}>${50}</option>`;

headlineDiv.className = "head-lines";
rootElem.appendChild(searchDiv);
rootElem.appendChild(headlineDiv);

searchDiv.appendChild(searchText);
searchDiv.appendChild(searchButton);
searchDiv.appendChild(selectHeadline);

const getAllData = async (perPage) => {
  const response = await fetch(`/api?page=2&limit=${perPage}`);
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
  let perPage = selectHeadline.value;
  selectHeadline.addEventListener("change", async (event) => {
    headeLineData = await getAllData(event.target.value);
    makePageForHeadLines(headeLineData.results);
  });
  try {
    headeLineData = await getAllData(perPage);
  } catch (err) {
    console.log("there is an error", err);
  }
  makePageForHeadLines(headeLineData.results);
}

window.onload = setup;
