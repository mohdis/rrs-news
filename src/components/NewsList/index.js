import NewsItem from "../NewsItem";

import "./style.css";

export default function NewsList({ allNews }) {
  return (
    <div className="news-list">
      {allNews.map((news) => {
        return <NewsItem key={news.id} news={news} />;
      })}
    </div>
  );
}
