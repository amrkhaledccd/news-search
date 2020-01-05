import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";
import Home from "../pages/home/Home";
import SearchResult from "../pages/search/SearchResult";

class App extends Component {
  render() {
    return (
      <Switch>
        <Route
          exact
          path="/"
          render={props => <Home onSearch={this.handleSearch} {...props} />}
        />
        <Route path="/search" render={props => <SearchResult {...props} />} />
      </Switch>
    );
  }
}

export default withRouter(App);
