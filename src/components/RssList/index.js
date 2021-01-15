import RssItem from "../RssItem";

import "./style.css";

export default function RssList({ rssUrls, handleDeleteRssUrl }) {
  return (
    <div className="rss-list">
      {rssUrls.map((rssUrl) => (
        <RssItem
          key={rssUrl.id}
          handleDelete={handleDeleteRssUrl}
          rssUrl={rssUrl}
        />
      ))}
    </div>
  );
}
