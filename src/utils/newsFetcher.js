import Parser from "rss-parser";

export default function newsFetcher(rssUrls, callback) {
  const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
  const parser = new Parser({
    headers: { "Access-Control-Allow-Origin": "*" },
  });

  rssUrls.forEach((rssUrl) => {
    parser.parseURL(CORS_PROXY + rssUrl.url, (error, feed) => {
      if (error) return;

      callback(feed.items, rssUrl.name || feed.title || "");
    });
  });
}
