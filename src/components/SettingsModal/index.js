import { useState } from "react";
import { DateTimePicker } from "react-rainbow-components";
import randomId from "../../utils/randomID";

import RssList from "../RssList";

import { Button, Divider, Form, Header, Icon, Modal } from "semantic-ui-react";

import "./style.css";

const urlRegex = /((https?):\/\/)?(www.)?[a-z0-9-]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#-]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;

export default function SettingsModal({
  setOpen,
  show,
  newsLimit,
  rssUrls,
  dateBoundary,
  handleAddRssUrl,
  handleDeleteRssUrl,
  handleNewsLimit,
  handleSetDateBoundary,
}) {
  const [newRssName, setNewRssName] = useState("");
  const [newRssUrl, setNewRssUrl] = useState("");
  const [errors, setErrors] = useState({});

  return (
    <Modal
      open={show}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >
      <Header icon="settings" content="Setup your settings here" />
      <Modal.Content>
        <RssList rssUrls={rssUrls} handleDeleteRssUrl={handleDeleteRssUrl} />
        <Form
          onSubmit={() => {
            if (newRssName === '_example_' 
              || (!errors.url && !errors.name && newRssUrl.length > 0 && newRssName.length > 0) ) {
              handleAddRssUrl({
                name: newRssName,
                url: newRssUrl,
                id: randomId(),
              });
            }
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
              onBlur={() => {
                if (!newRssUrl.match(urlRegex || newRssUrl.length === 0)) {
                  setErrors(ps => ({...ps, url: 'Url is not valid!'}));
                }
                else {
                  setErrors(ps => ({...ps, url: null}));
                }
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
              onBlur={() => {
                if (newRssName.length === 0) {
                  setErrors(ps => ({...ps, name: 'Name must be specified!'}));
                }
                else {
                  setErrors(ps => ({...ps, name: null}));
                }
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
              onChange={({ target: { value } }) => {
                if (!isNaN(parseFloat(value)) && isFinite(value)) {
                  handleNewsLimit(value)
                }
              }}
              value={newsLimit}
            />
          </Form.Group>
        </Form>
        <Divider />
        <div className="date-picker-container">
          <DateTimePicker
            className="date-picker"
            formatStyle="medium"
            label="From date"
            value={dateBoundary.minDate}
            onChange={(value) => handleSetDateBoundary("minDate", value)}
          />
          <DateTimePicker
            className="date-picker"
            formatStyle="medium"
            label="To date"
            value={dateBoundary.maxDate}
            onChange={(value) => handleSetDateBoundary("maxDate", value)}
          />
        </div>
        {(errors.url || errors.name) && <Divider />}
        {errors.url && <div className="error-message"><Icon name="warning"/>{errors.url}</div>}
        {errors.name && <div className="error-message"><Icon name="warning"/>{errors.name}</div>}
      </Modal.Content>
      <Modal.Actions>
        <Button color="google plus" onClick={() => setOpen(false)}>
          <Icon name="remove" /> Close
        </Button>
      </Modal.Actions>
    </Modal>
  );
}
