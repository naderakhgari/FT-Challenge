export const paginatedResults = (req, data) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const start = (page - 1) * limit;
  const end = page * limit;

  const results = {};

  if (end > data.length) {
    results.next = {
      page: page + 1,
      limit: limit,
    };
  }
  if (start > 0) {
    results.previous = {
      page: page - 1,
      limit: limit,
    };
  }
  if (limit >= data.length) {
    results.pages = 1;
    results.results = data;
  } else {
    results.pages = Math.ceil(data.length / limit);
    results.results = data.slice(start, end);
  }
  return results;
};
