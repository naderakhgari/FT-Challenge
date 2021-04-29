const rootElem = document.getElementById("root");
const searchDiv = document.getElementById("nav");
const headlineDiv = document.getElementById("main");
const paginationDiv = document.getElementById("footer");
const searchText = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const selectHeadline = document.getElementById("select-per-page");
const paginationList = document.getElementById("page-numbers");

let page = 1;

selectHeadline.innerHTML = `
<option value=${10}>${10}</option>
<option value=${20}>${20}</option>
<option value=${50}>${50}</option>`;

const changePage = (newPage) => {
  page = newPage;
  setup();
};

const goToThePreviousPage = () => {
  if (page > 1) {
    page -= 1;
    setup();
  }
};

const goToTheNextPage = (pages) => {
  if (page < pages) {
    page += 1;
    setup();
  }
};

const createPagination = (pages) => {
  paginationList.innerHTML = `<li class="pagination-element"><a role="button" disabled=${
    page === 1
  } onclick="goToThePreviousPage()"><</a></li>`;
  for (i = 1; i <= pages; i++) {
    paginationList.innerHTML += `<li class="pagination-element"><a role="button" id=${i} onclick="changePage(${i})">${i}</a></li>`;
  }
  paginationList.innerHTML += `<li class="pagination-element"><a role="button" onclick="goToTheNextPage(${pages})">></a></li>`;
};

const getAllData = async (perPage) => {
  const response = await fetch(`/api?page=${page}&limit=${perPage}`);
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

const getSearchedData = async (key, perPage) => {
  const response = await fetch(
    `/search/?key=${key}&page=${page}&limit=${perPage}`
  );
  return await response.json();
};

const setup = async () => {
  let headeLineData = [];
  let searchKeyWord = "";
  let perPage = selectHeadline.value;
  selectHeadline.addEventListener("change", async (event) => {
    headeLineData = await getAllData(event.target.value);
    createPagination(headeLineData.pages);
    makePageForHeadLines(headeLineData.results);
  });
  searchText.addEventListener("input", (event) => {
    searchKeyWord = event.target.value;
  });
  searchButton.addEventListener("click", async () => {
    perPage = selectHeadline.value;
    headeLineData = await getSearchedData(searchKeyWord, perPage);
    makePageForHeadLines(headeLineData.results);
  });
  try {
    headeLineData = await getAllData(perPage);
  } catch (err) {}
  createPagination(headeLineData.pages);
  makePageForHeadLines(headeLineData.results);
  return headeLineData.results;
};

window.onload = setup;
