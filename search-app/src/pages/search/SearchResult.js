import React, { Component } from "react";
import {
  Layout,
  Row,
  Col,
  Input,
  Typography,
  Icon,
  Pagination,
  Menu,
  AutoComplete,
  Empty,
  Affix
} from "antd";
import { Link } from "react-router-dom";
import queryString from "query-string";
import news_logo from "../../logo.png";
import "./Search.css";
import { search, autocomplete } from "../../util/ApiUtil";
import Moment from "react-moment";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;
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

class SearchResult extends Component {
  state = {
    query: "",
    inputValue: "",
    totalElements: 0,
    page: 0,
    isLast: false,
    totalPages: 0,
    filter: "all",
    results: [],
    autoComplete: []
  };

  componentDidMount = () => {
    const values = queryString.parse(this.props.location.search);
    if (!values.q || values.q === "") {
      this.props.history.push("/");
    }

    var filter = this.state.filter;

    if (values.f && values.f !== "") {
      filter = values.f;
    }

    this.executeSearch(values.q, this.state.page, filter);
  };

  executeSearch = (query, page, filter) => {
    search(query, page, filter)
      .then(res => {
        this.setState({
          query: query,
          inputValue: query,
          filter: filter,
          results: res.content,
          totalElements: res.totalElements,
          page: res.number,
          totalPages: res.totalPages,
          isLast: res.last
        });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  };

  handleSearch = value => {
    if (value || value !== "") {
      this.props.history.push("/search?q=" + value + "&f=" + this.state.filter);
      window.location.reload();
    }
  };

  handleInputChange = value => {
    this.getAutocomplete(value);
  };

  getAutocomplete = prefix => {
    autocomplete(prefix, this.state.filter)
      .then(res => {
        this.setState({ inputValue: prefix, autoComplete: res });
      })
      .catch(error => {
        console.log("error: " + error);
      });
  };

  handlePageChange = page => {
    this.executeSearch(this.state.query, page - 1, this.state.filter);
    window.scrollTo(0, 0);
  };

  handleMenuClick = e => {
    if (e.key === this.state.filter) {
      return;
    }

    this.props.history.push("/search?q=" + this.state.query + "&f=" + e.key);
    this.executeSearch(this.state.query, 0, e.key);
    window.scrollTo(0, 0);
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Affix>
          <Header>
            <Row>
              <Col span={2}>
                <Link to="/">
                  <img
                    alt="News Search"
                    src={news_logo}
                    style={{ width: "90px", cursor: "pointer" }}
                  />
                </Link>
              </Col>
              <Col span={10} style={{ padding: "5px" }}>
                <AutoComplete
                  value={this.state.inputValue}
                  dataSource={this.state.autoComplete.map(renderOption)}
                  onChange={this.handleInputChange}
                  onSelect={value => this.handleSearch(value)}
                  size="large"
                  optionLabelProp="text"
                  defaultActiveFirstOption={false}
                  onFocus={() => this.handleInputChange(this.state.inputValue)}
                >
                  <Search
                    className="search-input"
                    placeholder="input search text"
                    onSearch={value => this.handleSearch(value)}
                    size="large"
                  />
                </AutoComplete>
              </Col>
            </Row>
            <Row>
              <Col span={12} push={2}>
                <Menu
                  mode="horizontal"
                  selectedKeys={this.state.filter}
                  onClick={this.handleMenuClick}
                >
                  <Menu.Item key="all">All</Menu.Item>
                  <Menu.Item key="general">General</Menu.Item>
                  <Menu.Item key="business">Business</Menu.Item>
                  <Menu.Item key="technology">Technology</Menu.Item>
                  <Menu.Item key="health">Health</Menu.Item>
                  <Menu.Item key="science">Science</Menu.Item>
                  <Menu.Item key="sports">Sports</Menu.Item>
                  <Menu.Item key="entertainment">Entertainment</Menu.Item>
                </Menu>
              </Col>
            </Row>
          </Header>
        </Affix>
        <Content>
          {this.state.results.length === 0 && (
            <Empty
              image={Empty.PRESENTED_IMAGE_DEFAULT}
              description={
                <span style={{ fontSize: "18px" }}>
                  Your search - <b>{this.state.query}</b> - didn't match any
                  document
                  {this.state.filter !== "all" && " in "}
                  <b>{this.state.filter !== "all" && this.state.filter}</b>
                </span>
              }
            />
          )}

          {this.state.results.length > 0 && (
            <div>
              <Row style={{ padding: "10px" }}>
                <Col span={12} push={2}>
                  <Text type="secondary">
                    page {this.state.page + 1} of {this.state.totalPages} pages
                    ({this.state.totalElements} results)
                  </Text>
                </Col>
              </Row>
              <div className="container">
                {this.state.results.map(elem => (
                  <Row style={{ marginBottom: "20px" }}>
                    <Col span={4} push={2}>
                      <a
                        href={elem.url}
                        title={elem.author}
                        className="thumbnail"
                      >
                        <img src={elem.urlToImage} alt={elem.author} />
                      </a>
                    </Col>
                    <Col span={3} push={2} className="meta-info">
                      <ul className="ul">
                        <li>
                          <Icon type="calendar" theme="twoTone" />
                          <Moment format="DD/MM/YYYY" date={elem.publishedAt} />
                        </li>
                        <li>
                          <Icon type="clock-circle" theme="twoTone" />
                          <Moment format="hh:mm a" date={elem.publishedAt} />
                        </li>
                        <li>
                          <Icon type="tag" theme="twoTone" />{" "}
                          <span>{elem.category}</span>
                        </li>
                      </ul>
                    </Col>
                    <Col span={8} push={2}>
                      <h3>
                        <a href={elem.url} className="title">
                          {elem.title}
                        </a>
                      </h3>
                      <p className="description">{elem.description}</p>
                    </Col>
                  </Row>
                ))}
                ;
                <Row
                  type="flex"
                  justify="center"
                  style={{ marginBottom: "25px" }}
                >
                  <Col>
                    <Pagination
                      current={this.state.page + 1}
                      total={this.state.totalElements}
                      onChange={page => this.handlePageChange(page)}
                      hideOnSinglePage={true}
                    />
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Content>
        <Footer>
          <Row type="flex" justify="center">
            <Col>Data powered by RapidAPI</Col>
          </Row>
        </Footer>
      </Layout>
    );
  }
}

export default SearchResult;
