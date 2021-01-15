import { Fragment, useEffect, useState } from "react";
import Parser from "rss-parser";
import moment from "moment";

import { DateTimePicker } from "react-rainbow-components";
import {
  Button,
  Dimmer,
  Divider,
  Form,
  Header,
  Icon,
  Input,
  Loader,
  Modal,
  Segment,
} from "semantic-ui-react";

import "./App.css";

function randomId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
function fetchNews(rssUrls, callback) {
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

//option: { searchedString, dateBoundary, newsLimit };
function getNewsWithSettings(newsFeeds, options) {
  console.log(newsFeeds, options);

  const res = Object.keys(newsFeeds)
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
    .flat()
    .sort((a, b) => a.date < b.date);

  const finalResult = res
    .slice(
      0,
      options.newsLimit > res.length ? res.length - 1 : options.newsLimit
    )
    .filter(({ date, title, desc }) => {
      if (
        date <= options.dateBoundary.maxDate &&
        date >= options.dateBoundary.minDate
      ) {
        if (
          title.toLowerCase().includes(options.searchedString.toLowerCase()) ||
          desc.toLowerCase().includes(options.searchedString.toLowerCase())
        ) {
          return true;
        }
      }
      return false;
    });

  console.log(finalResult);

  return finalResult;
}

function App() {
  const [newRssName, setNewRssName] = useState("");
  const [newRssUrl, setNewRssUrl] = useState("");
  const [showSettingModal, setShowSettingModal] = useState(false);
  const [searchedString, setSearchedString] = useState("");
  const [newsLimit, setNewsLimit] = useState(20);
  const [dateBoundary, setDateBoundary] = useState({
    minDate: new Date("1999/07/30"),
    maxDate: new Date(),
  });
  const [rssUrls, setRssUrls] = useState([
    {
      url: "https://www.nasa.gov/rss/dyn/earth.rss",
      name: "NASA",
      id: "151544",
    },
    {
      url: "http://feeds.bbci.co.uk/news/england/london/rss.xml",
      name: "BBC",
      id: "963778",
    },
  ]);

  const [newsFeeds, setNewsFeeds] = useState({});
  const [showingNews, setShowingNews] = useState([]);

  const inputStyles = {
    maxWidth: 320,
  };
  useEffect(
    () =>
      setShowingNews(
        getNewsWithSettings(newsFeeds, {
          searchedString,
          dateBoundary,
          newsLimit,
        })
      ),
    [newsFeeds, searchedString, dateBoundary, newsLimit]
  );

  useEffect(() => {
    fetchNews(rssUrls, (feed, feedTitle) =>
      setNewsFeeds((prevFeed) => ({ ...prevFeed, [feedTitle]: feed }))
    );
  }, [rssUrls]);

  if (showingNews.length <= 0)
    return (
      <Segment className="news-loading">
        <Dimmer active inverted>
          <Loader size="medium">Loading</Loader>
        </Dimmer>
      </Segment>
    );

  return (
    <Fragment>
      <div className="news-header">
        <Input
          className="search-input"
          icon="search"
          placeholder="Search..."
          onChange={({ target }) => setSearchedString(target.value)}
        />
        <Button
          content="Settings"
          color="google plus"
          icon="settings"
          labelPosition="right"
          onClick={() => setShowSettingModal(true)}
        />
      </div>
      <div className="news-list">
        {showingNews.map((news) => {
          return (
            <div key={news.id} className="news-item">
              <img
                className="news-item-image"
                src={
                  news.imageUrl
                    ? news.imageUrl
                    : "https://fakeimg.pl/400x200/?text=There is no image :("
                }
                alt=""
              />
              <div className="news-item-container">
                <span className="news-item-title">{news.title}</span>
                <span className="news-item-desc">{news.desc}</span>
                <div className="news-item-action">
                  <span className="news-item-info">{`${news.press} - ${moment(
                    news.date
                  ).fromNow()}`}</span>
                  <a
                    className="news-item-redirect"
                    target="_blank"
                    rel="noreferrer"
                    href={news.link}
                  >
                    Go to news
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal
        open={showSettingModal}
        onClose={() => setShowSettingModal(false)}
        onOpen={() => setShowSettingModal(true)}
      >
        <Header icon="settings" content="Setup your settings here" />
        <Modal.Content>
          <div className="rss-list">
            {rssUrls.map((rssUrl, index) => (
              <div key={rssUrl.id} className="rss-item">
                <span className="rss-item-name">{rssUrl.name}</span>
                <a
                  href={rssUrl.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rss-item-url"
                >
                  {rssUrl.url}
                </a>
                <Icon
                  className="rss-item-icon"
                  color="red"
                  name="close"
                  onClick={() =>
                    setRssUrls(
                      rssUrls.filter(
                        (rssUrl) => rssUrl.id !== rssUrls[index].id
                      )
                    )
                  }
                />
              </div>
            ))}
          </div>
          <Form
            onSubmit={() => {
              setRssUrls([
                ...rssUrls,
                { name: newRssName, url: newRssUrl, id: randomId() },
              ]);
            }}
          >
            <Form.Group widths="equal">
              <Form.Field
                label="RSS Url"
                control="input"
                placeholder="URL"
                value={newRssUrl}
                onChange={({ target }) => {
                  setNewRssUrl(target.value);
                }}
              />
              <Form.Field
                label="Name"
                control="input"
                placeholder="Name"
                value={newRssName}
                onChange={({ target }) => {
                  setNewRssName(target.value);
                }}
              />
            </Form.Group>
            <Button type="submit">Add</Button>
          </Form>
          <Divider />
          <Form>
            <Form.Group inline>
              <Form.Input
                label="News number limit"
                placeholder="Enter a number"
                name="limit"
                onChange={({ target }) => setNewsLimit(target.value)}
                value={newsLimit}
              />
            </Form.Group>
          </Form>
          <Divider />
          <div className="date-picker-container">
            <DateTimePicker
              formatStyle="medium"
              label="From date"
              style={inputStyles}
              value={dateBoundary.minDate}
              onChange={(value) =>
                setDateBoundary({ ...dateBoundary, minDate: value })
              }
            />
            <DateTimePicker
              formatStyle="medium"
              label="To date"
              style={inputStyles}
              value={dateBoundary.maxDate}
              onChange={(value) =>
                setDateBoundary({ ...dateBoundary, maxDate: value })
              }
            />
          </div>
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="google plus"
            onClick={() => setShowSettingModal(false)}
          >
            <Icon name="remove" /> Close
          </Button>
        </Modal.Actions>
      </Modal>
    </Fragment>
  );
}

export default App;

// {
//   title:
//     "NASA, NSF Sign Agreement to Advance Space, Earth, Biological, Physical Sciences",
//   contentSnippet:
//     "NASA and the U.S. National Science Foundation (NSF) have signed a memorandum of understanding affirming the agencies’ intent to continue their longstanding partnership in mutually beneficial research activities advancing space, Earth, biological, and physical sciences to further U.S. national space policy and promote the progress of science.",
//   guid:
//     "http://www.nasa.gov/press-release/nasa-nsf-sign-agreement-to-advance-space-earth-biological-physical-sciences",
//   press: "BBC NEWS",
//   date: "2 days ago",
//   id: "1454548"
// },
