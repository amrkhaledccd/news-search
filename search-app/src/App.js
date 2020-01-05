import React, { Component } from "react";
import { Route, withRouter, Switch } from "react-router-dom";

class App extends Component {
  render() {
    return (
        <Switch>
              <Route
                exact
                path="/"
                render={props => (
                  <NewsFeed
                    isAuthenticated={this.state.isAuthenticated}
                    currentUser={this.state.currentUser}
                    {...props}
                  />
                )}
              />
        </Switch>
    );
  }
}

export default withRouter(App);
