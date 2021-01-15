import { Fragment, useEffect, useState } from "react";

import newsFetcher from "./utils/newsFetcher";
import extractNewsWithSettings from "./utils/extractNewsWithSettings";
import randomId from "./utils/randomID";

import SettingsModal from "./components/SettingsModal";
import NewsList from "./components/NewsList";

import { Dimmer, Loader, Segment } from "semantic-ui-react";

import "./App.css";
import NewsHeader from "./components/NewsHeader";

function App() {
  const [showingNews, setShowingNews] = useState([]); //only news that satisfy settings (they are showing in list)
  const [newsFeeds, setNewsFeeds] = useState({}); //all news from all endpoints
  const [newsLimit, setNewsLimit] = useState(20);
  const [searchedString, setSearchedString] = useState("");

  const [dateBoundary, setDateBoundary] = useState({
    minDate: new Date("1999/07/30"),
    maxDate: new Date(),
  });

  const [rssUrls, setRssUrls] = useState([
    {
      url: "https://www.nasa.gov/rss/dyn/earth.rss",
      name: "NASA",
      id: randomId(),
    },
    {
      url: "http://feeds.bbci.co.uk/news/england/london/rss.xml",
      name: "BBC",
      id: randomId(),
    },
  ]);

  const [showSettingModal, setShowSettingModal] = useState(false);

  useEffect(
    () =>
      setShowingNews(
        extractNewsWithSettings(newsFeeds, {
          searchedString,
          dateBoundary,
          newsLimit,
        })
      ),
    [newsFeeds, searchedString, dateBoundary, newsLimit]
  );

  useEffect(() => {
    newsFetcher(rssUrls, (feed, feedTitle) =>
      setNewsFeeds((prevFeed) => ({ ...prevFeed, [feedTitle]: feed }))
    );
  }, [rssUrls]);

  function handleDeleteRssUrl(id, name) {
    setRssUrls(rssUrls.filter((rssUrl) => rssUrl.id !== id));

    const { [name]: _deletedPress, ...resetPress } = newsFeeds;
    setNewsFeeds({ ...resetPress });
  }

  function handleAddRssUrl(newRssUrl) {
    setRssUrls([...rssUrls, newRssUrl]);
  }

  function handleNewsLimit(value) {
    setNewsLimit(value);
  }

  function handleSetDateBoundary(name, value) {
    setDateBoundary({ ...dateBoundary, [name]: value });
  }
  function handleShowSettingModal() {
    setShowSettingModal(true);
  }
  function handleSearchedString(value) {
    setSearchedString(value);
  }

  if (showingNews.length <= 0)
    return (
      <Segment className="news-loading">
        <Dimmer active inverted>
          <Loader size="large">Loading...</Loader>
        </Dimmer>
      </Segment>
    );

  return (
    <Fragment>
      <NewsHeader
        handleShowSettingModal={handleShowSettingModal}
        handleSearchedString={handleSearchedString}
      />
      <NewsList allNews={showingNews} />
      <SettingsModal
        show={showSettingModal}
        setOpen={setShowSettingModal}
        rssUrls={rssUrls}
        newsLimit={newsLimit}
        dateBoundary={dateBoundary}
        handleDeleteRssUrl={handleDeleteRssUrl}
        handleAddRssUrl={handleAddRssUrl}
        handleNewsLimit={handleNewsLimit}
        handleSetDateBoundary={handleSetDateBoundary}
      />
    </Fragment>
  );
}

export default App;

/* 
{
  title:
  "NASA, NSF Sign Agreement to Advance Space, Earth, Biological, Physical Sciences",
desc:
  "NASA and the U.S. National Science Foundation (NSF) have signed a memorandum of understanding affirming the agencies’ intent to continue their longstanding partnership in mutually beneficial research activities advancing space, Earth, biological, and physical sciences to further U.S. national space policy and promote the progress of science.",
link:
  "http://www.nasa.gov/press-release/nasa-nsf-sign-agreement-to-advance-space-earth-biological-physical-sciences",
press: "BBC NEWS",
date: new Date(),
id: "1454548",
},
*/
