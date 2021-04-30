const rootElem = document.getElementById("root");
const searchDiv = document.getElementById("nav");
const headlineDiv = document.getElementById("main");
const paginationDiv = document.getElementById("footer");
const searchText = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const selectHeadline = document.getElementById("select-per-page");
const paginationList = document.getElementById("page-numbers");

let page = 1;
let headeLineData = [];
let searchKeyWord = searchText.value;
let amountPerPage = 10;

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

const createPaginationElements = (pages) => {
  paginationList.innerHTML = `<li><a class="pagination-element" role="button" onclick="goToThePreviousPage()"><</a></li>`;
  for (i = 1; i <= pages; i++) {
    paginationList.innerHTML += `<li><a class="pagination-element" role="button" id=${i} onclick="changePage(${i})">${i}</a></li>`;
  }
  paginationList.innerHTML += `<li><a class="pagination-element" role="button" onclick="goToTheNextPage(${pages})">></a></li>`;
};

const getAllData = async (perPage, searchKey) => {
  const response = await fetch(
    `/api?page=${page}&limit=${perPage}&searchKey=${searchKey}`
  );
  return await response.json();
};

function makePageForHeadLines(headLines) {
  headlineDiv.innerHTML = "";
  headLines.forEach((headeLine) => {
    headlineDiv.innerHTML += `
    <section class="headLine" role="contentinfo" aria-label=${headeLine.title.title}>
      <div >
        <h2 class="" id=${headeLine.id}>${headeLine.title.title}</h2>
        <ul>
          <li>${headeLine.editorial.byline}</li>
          <li>${headeLine.editorial.subheading}</li>
        </ul>
        <p>${headeLine.summary.excerpt}</p>
      </div>
    </section>`;
  });
}

selectHeadline.addEventListener("change", async (event) => {
  amountPerPage = event.target.value;
  headeLineData = await getAllData(amountPerPage, searchKeyWord);
  createPaginationElements(headeLineData.pages);
  makePageForHeadLines(headeLineData.results);
});

searchText.addEventListener("input", (event) => {
  searchKeyWord = event.target.value;
});

searchButton.addEventListener("click", async () => {
  amountPerPage = selectHeadline.value;
  headeLineData = await getAllData(amountPerPage, searchKeyWord);
  createPaginationElements(headeLineData.pages);
  makePageForHeadLines(headeLineData.results);
});

const setup = async () => {
  try {
    headeLineData = await getAllData(amountPerPage, searchKeyWord);
  } catch (err) {
    console.log("this is an error!", err);
  }
  createPaginationElements(headeLineData.pages);
  makePageForHeadLines(headeLineData.results);
  return headeLineData.results;
};

window.onload = setup;
