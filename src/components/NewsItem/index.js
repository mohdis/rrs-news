import moment from "moment";

import "./style.css";

export default function NewsItem({
  news: { imageUrl, title, desc, date, link, press },
}) {
  return (
    <div className="news-item">
      <img
        className="news-item-image"
        src={
          imageUrl
            ? imageUrl
            : "https://fakeimg.pl/400x200/?text=There is no image :("
        }
        alt=""
      />
      <div className="news-item-container">
        <span className="news-item-title">{title}</span>
        <span className="news-item-desc">{desc}</span>
        <div className="news-item-action">
          <span className="news-item-info">{`${press} - ${moment(
            date
          ).fromNow()}`}</span>
          <a
            className="news-item-redirect"
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            Go to news
          </a>
        </div>
      </div>
    </div>
  );
}
