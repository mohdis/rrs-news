import randomId from "./randomID";

export default function extractNewsWithSettings(
  newsFeeds,
  { searchedString, newsLimit, dateBoundary } //options
) {
  console.log(newsFeeds);

  const sortedNews = flattenNewsFeedsObject(newsFeeds).sort(
    (a, b) => a.date < b.date
  );

  const finalResult = sortedNews
    .slice(0, newsLimit > sortedNews.length ? sortedNews.length : newsLimit)
    .filter(({ date, title, desc }) => {
      if (date <= dateBoundary.maxDate && date >= dateBoundary.minDate) {
        if (
          title.toLowerCase().includes(searchedString.toLowerCase()) ||
          desc.toLowerCase().includes(searchedString.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });

  console.log(finalResult);

  return finalResult;
}

function flattenNewsFeedsObject(newsFeeds) {
  return Object.keys(newsFeeds)
    .map((pressName) => {
      return newsFeeds[pressName].map((newsItem) => ({
        id: randomId(),
        title: newsItem.title,
        desc: newsItem.contentSnippet,
        link: newsItem.guid,
        press: pressName,
        date: new Date(newsItem.pubDate),
        imageUrl: newsItem.enclosure ? newsItem.enclosure.url : null,
      }));
    })
    .flat();
}
