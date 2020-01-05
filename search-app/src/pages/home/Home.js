import React, { Component } from "react";
import news_logo from "../../logo.png";
import { Input, AutoComplete, Icon } from "antd";
import { autocomplete } from "../../util/ApiUtil";
import "./Home.css";

const { Search } = Input;
const { Option } = AutoComplete;

function renderOption(item) {
  return (
    <Option key={item} text={item}>
      <Icon type="search" className="autocomplete-icon" />
      {item}
    </Option>
  );
}

class Home extends Component {
  state = {
    value: "",
    autoComplete: []
  };

  handleSearch = value => {
    if (value !== "") {
      this.props.history.push("/search?q=" + value);
    }
  };

  handleInputChange = value => {
    this.getAutocomplete(value);
  };

  getAutocomplete = prefix => {
    autocomplete(prefix)
      .then(res => {
        this.setState({ value: prefix, autoComplete: res });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img alt="News Search" src={news_logo} />
          <AutoComplete
            value={this.state.value}
            dataSource={this.state.autoComplete.map(renderOption)}
            onChange={this.handleInputChange}
            onSelect={value => this.handleSearch(value)}
            size="large"
            optionLabelProp="text"
            defaultActiveFirstOption={false}
          >
            <Search
              className="search-input"
              placeholder="input search text"
              onSearch={value => this.handleSearch(value)}
              size="large"
            />
          </AutoComplete>
        </header>
      </div>
    );
  }
}

export default Home;
