import { Icon } from "semantic-ui-react";

import "./style.css";

export default function RssItem({ handleDelete, rssUrl: { id, url, name } }) {
  return (
    <div className="rss-item">
      <span className="rss-item-name">{name}</span>
      <a className="rss-item-url" rel="noreferrer" target="_blank" href={url}>
        {url}
      </a>
      <Icon
        className="rss-item-icon"
        color="red"
        name="close"
        onClick={() => handleDelete(id)}
      />
    </div>
  );
}
