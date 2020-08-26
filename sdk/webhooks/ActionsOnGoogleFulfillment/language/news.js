const NewsAPI = require("newsapi");
const newsapi = new NewsAPI("55d0fb0150d24ccab8a09fe3d8ae5d0d");

/**
 * Fetches news based on query
 * @param {*} query to be searched
 */
exports.searchFunction = async function (query) {
    var newsResults = [];
    const results = await newsapi.v2
        .everything({
            q: query,
            language: "en",
            sortBy: "relevancy",
            pageSize: 3,
            page: 1,
        })
        .then((response) => {
            const results = response.articles;
            for (var i = 0; i < results.length; i++) {
                var result = results[i];
                newsResults.push({
                    title: result.title,
                    img: result.urlToImage,
                    description: result.description,
                    content: result.content,
                });
            }
            return newsResults
        });
    return results;
};
