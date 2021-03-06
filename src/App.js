import { Fragment, useEffect, useState } from "react";

import newsFetcher from "./utils/newsFetcher";
import extractNewsWithSettings from "./utils/extractNewsWithSettings";
import randomId from "./utils/randomID";
import { getItemFromLS, setItemOnLS } from "./utils/lsService";

import SettingsModal from "./components/SettingsModal";
import NewsList from "./components/NewsList";
import NewsHeader from "./components/NewsHeader";
import Loading from "./components/Loading";

import "./App.css";

function App() {
  const [showingNews, setShowingNews] = useState([]); //only news that satisfy settings (they are showing in list)
  const [newsFeeds, setNewsFeeds] = useState({}); //all news from all endpoints
  const [newsLimit, setNewsLimit] = useState(20);
  const [searchedString, setSearchedString] = useState("");
  const [activeFilters, setActiveFilters] = useState([]);

  const [dateBoundary, setDateBoundary] = useState({
    // minDate: new Date() - 1000 * 60 * 60 * 24 * 10, // 10 days ago
    minDate: new Date("1999/07/30"),
    maxDate: new Date(),
  });

  const [rssUrls, setRssUrls] = useState([]);

  const [showSettingModal, setShowSettingModal] = useState(false);

  // restore state from localStorage
  useEffect(() => {
    const initialRssUrls = getItemFromLS('rssUrls');
    const initialNewsLimit = getItemFromLS('newsLimit');
    const initialSearchedString = getItemFromLS('searchedString');
    const initialActiveFilters = getItemFromLS('activeFilters');
    initialRssUrls && setRssUrls(initialRssUrls);
    initialNewsLimit && setNewsLimit(initialNewsLimit);
    initialSearchedString && setSearchedString(initialSearchedString);
    initialActiveFilters && setActiveFilters(initialActiveFilters);
  }, []);

  useEffect(
    () =>
      setShowingNews(
        extractNewsWithSettings(newsFeeds, {
          searchedString,
          dateBoundary,
          newsLimit,
          activeFilters,
        })
      ),
    [newsFeeds, searchedString, dateBoundary, newsLimit, activeFilters]
  );

  useEffect(() => {
    newsFetcher(rssUrls, (feed, feedTitle) =>
      setNewsFeeds((prevFeed) => ({ ...prevFeed, [feedTitle]: feed }))
    );
  }, [rssUrls]);

  // save state in localStorage
  useEffect(() => {
    setItemOnLS('rssUrls', rssUrls);
    setItemOnLS('newsLimit', newsLimit);
    setItemOnLS('searchedString', searchedString);
    setItemOnLS('activeFilters', activeFilters);
  }, [activeFilters, newsLimit, rssUrls, searchedString]);

  function handleDeleteRssUrl(id, name) {
    setRssUrls(rssUrls.filter((rssUrl) => rssUrl.id !== id));

    const { [name]: _deletedPress, ...resetPress } = newsFeeds;
    setNewsFeeds({ ...resetPress });
  }

  function handleAddRssUrl(newRssUrl) {
    if (newRssUrl.name === '_example_') {
      setRssUrls([...rssUrls, ...[
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
      ]]);
    }
    else {
      setRssUrls([...rssUrls, newRssUrl]);
    }
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

  const loading = rssUrls?.length > 0 && Object.keys(newsFeeds).length === 0; //if nothing loaded yet

  return (
    <Fragment>
      <NewsHeader
        handleShowSettingModal={handleShowSettingModal}
        handleSearchedString={handleSearchedString}
        searchedString={searchedString}
        filters={Object.keys(newsFeeds)}
        setActiveFilters={setActiveFilters}
        activeFilters={activeFilters}
      />
      {loading ? <Loading /> : <NewsList allNews={showingNews} />}
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
