import { Button, Dropdown, Input } from "semantic-ui-react";

import "./style.css";

export default function NewsHeader({
  handleShowSettingModal,
  handleSearchedString,
  searchedString,
  filters,
  setActiveFilters,
  activeFilters,
}) {
  const options = filters?.map( filter => ({ value: filter, text: filter })) || [];

  return (
    <div className="news-header">
      <div>
        <Input
          icon="search"
          placeholder="Search..."
          onChange={({ target }) => handleSearchedString(target.value)}
          value={searchedString}
        />
        &nbsp;&nbsp;&nbsp;
        <Dropdown
          selection 
          multiple 
          placeholder="Source filter: All"
          options={options} 
          onChange={(e, data) => setActiveFilters(data.value)}
          value={activeFilters}
        />
      </div>
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
