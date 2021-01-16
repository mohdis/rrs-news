import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import './style.css'

const NewsToolbar = ({filters, setActiveFilters, activeFilters}) => {
  const options = filters?.map( filter => ({ value: filter, text: filter })) || [];
  console.log(options);

  return (
    <div className="news-toolbar-container">
      <Dropdown 
        selection 
        multiple 
        placeholder="Source filter: All"
        options={options} 
        onChange={(e, data) => setActiveFilters(data.value)}
        value={activeFilters}
      />
    </div>
  );
}

export default NewsToolbar;