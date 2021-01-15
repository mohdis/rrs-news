import { Dimmer, Loader, Segment } from "semantic-ui-react";
import "./style.css";

export default function Loading() {
  return (
    <Segment basic className="news-loading">
      <Dimmer active inverted>
        <Loader size="large">Loading...</Loader>
      </Dimmer>
    </Segment>
  );
}
