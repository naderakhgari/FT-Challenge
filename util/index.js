const paginationResults = (requestPage, data) => {
  const resultData = data.results[0].results;
  const { indexCount } = data.results[0];

  const page = requestPage ? parseInt(requestPage) : 1;
  const limit = 10;

  const start = (page - 1) * limit;
  const end = page * limit;

  const results = {};

  results.page = page;
  results.next = end < indexCount ? page + 1 : null;
  results.previous = start > 0 ? page - 1 : null;
  results.results = limit >= indexCount ? resultData : resultData.slice(start, end);

  return results;
};

module.exports = paginationResults;
