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

const culculatePublishDate = (initialDate) => {
  const publishedDate = new Date(initialDate);
  const currentDate = new Date();
  const diffTime = Math.abs(currentDate - publishedDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  switch (diffDays) {
    case 0:
      return "New";
    case 1:
      return "Yesterday";
    case diffDays >= 365:
      return Math.floor(diffDays / 365) + " Years ago";
    case diffDays >= 30:
      return Math.floor(diffDays / 30) + " Months ago";
    default:
      return "";
  }
};

function makePageForHeadLines(headLines) {
  headlineDiv.innerHTML = "";
  headLines.forEach((headeLine) => {
    const { title, id, editorial, summary, lifecycle } = headeLine;
    headlineDiv.innerHTML += `
    <section class="headLine" role="contentinfo" aria-label=${title.title}>
      <div >
        <h2 class="" id=${id}>${title.title}</h2>
        <ul>
          <li>${editorial.byline}</li>
          <li>${editorial.subheading}</li>
        </ul>
        <p>${summary.excerpt}</p>
        <div class="publish-date">${culculatePublishDate(
          lifecycle.initialPublishDateTime
        )}</div>
      </div>
    </section>`;
  });
}

selectHeadline.addEventListener("change", async (event) => {
  amountPerPage = event.target.value;
  try {
    headeLineData = await getAllData(amountPerPage, searchKeyWord);
    createPaginationElements(headeLineData.pages);
    makePageForHeadLines(headeLineData.results);
  } catch (err) {
    headlineDiv.innerHTML = `<div>Something went wrong, try again latter!</div>`;
  }
});

searchText.addEventListener("input", (event) => {
  searchKeyWord = event.target.value;
});

searchButton.addEventListener("click", async () => {
  amountPerPage = selectHeadline.value;
  try {
    headeLineData = await getAllData(amountPerPage, searchKeyWord);
    createPaginationElements(headeLineData.pages);
    makePageForHeadLines(headeLineData.results);
  } catch (err) {
    headlineDiv.innerHTML = `<div>No entry found!</div>`;
  }
});

const setup = async () => {
  try {
    headeLineData = await getAllData(amountPerPage, searchKeyWord);
    createPaginationElements(headeLineData.pages);
    makePageForHeadLines(headeLineData.results);
  } catch (err) {
    headlineDiv.innerHTML = `<div>Something went wrong, try again latter!</div>`;
  }
};

window.onload = setup;
