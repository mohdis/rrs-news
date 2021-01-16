import { Icon } from "semantic-ui-react";
import NewsItem from "../NewsItem";

import "./style.css";

export default function NewsList({ allNews }) {
  return (
    allNews?.length > 0 ?
    <div className="news-list">
      {allNews.map((news) => {
        return <NewsItem key={news.id} news={news} />;
      })}
    </div>
    : <div className="no-result-message">No results found ... <Icon name="search"/></div>
  );
}
