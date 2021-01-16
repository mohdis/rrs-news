import { Button, Input } from "semantic-ui-react";

import "./style.css";

export default function NewsHeader({
  handleShowSettingModal,
  handleSearchedString,
  searchedString,
}) {
  return (
    <div className="news-header">
      <Input
        icon="search"
        placeholder="Search..."
        onChange={({ target }) => handleSearchedString(target.value)}
        value={searchedString}
      />
      <Button
        content="Settings"
        color="google plus"
        icon="settings"
        labelPosition="right"
        onClick={() => handleShowSettingModal(true)}
      />
    </div>
  );
}
