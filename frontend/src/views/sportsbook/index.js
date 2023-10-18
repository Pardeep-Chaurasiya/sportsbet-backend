import React from "react";

import EventView from "../../containers/eventview";
import Results from "../../containers/results";
import { stringReplacer } from "../../common";
import { Switch, Route, Redirect } from "react-router-dom";
import { RESET } from "../../actionReducers";
import { allActionDucer } from "../../actionCreator";
import Helmet from "react-helmet";
import GameView from "../../containers/gameview";
import ReactGA from "react-ga";
import Controls from "../../containers/controls";
export default class SportsBook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      activeNav: 0,
      activeSportView: 0,
    };

    this.resultMap = {
      Won: "won",
      Lost: "lose",
      Accepted: "wait",
      CashOut: "won",
      Returned: "lose",
      Ticketnumbernotfound: "Ticket number not found",
    };
  }

  componentDidMount() {
    ReactGA.pageview("/sportsbook");
  }
  componentWillUnmount() {
    this.props.dispatch(allActionDucer(RESET, {}));
  }
  componentDidUpdate() { }
  render() {
    const { activeSport, activeCompetition, activeRegion, appTheme } =
      this.props.sportsbook,
      {
        loadLiveGames,
        loadPrematchGames,
        handleBetResponse,
        retrieve,
        unsubscribe,
        sendRequest,
        subscribeToSelection,
        getBetslipFreebets,
        bulkUnsubscribe,
        validate,
        addEventToSelection,
        loadMarkets,
        loadGames,
      } = this.props,
      sportAlias = stringReplacer(
        activeSport ? activeSport.alias : "",
        [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g],
        ["", "", "", ""]
      ).toLowerCase();
    return (
      <React.Fragment>
        <div className={`sportsbook-container ${appTheme + "-theme"}`}>
          <Helmet>
            <title>Sports Book- Drives</title>
          </Helmet>
          <div className="sportsbook-inner">
            <div className="sportsbook-view">
              <div className="sportsbook-content">
                <Switch>
                  <Route exact path={this.props.match.path}>
                    <Redirect to={`${this.props.match.url}/prematch`} />
                  </Route>
                  <Route path={`${this.props.match.path}/results`}>
                    <Results
                      sendRequest={sendRequest}
                      bulkUnsubscribe={bulkUnsubscribe}
                    />
                  </Route>
                  <Route
                    exact
                    path={`${this.props.match.path}/:view/:sport/:region/:competition/:game`}
                    render={(props) => (
                      <GameView
                        getBetslipFreebets={getBetslipFreebets}
                        validate={validate}
                        retrieve={retrieve}
                        subscribeToSelection={subscribeToSelection}
                        sportAlias={sportAlias}
                        {...props}
                        unsubscribe={unsubscribe}
                        sendRequest={sendRequest}
                        addEventToSelection={addEventToSelection}
                      />
                    )}
                  />
                  <Route path={`${this.props.match.path}/:view`}>
                    <EventView
                      connect={this.connect}
                      liveEvent={this.liveEvent}
                      loadMarkets={loadMarkets}
                      loadGames={loadGames}
                      activeCompetition={activeCompetition}
                      activeRegion={activeRegion}
                      addEventToSelection={addEventToSelection}
                      sportAlias={sportAlias}
                      loadLiveGames={loadLiveGames}
                      validate={validate}
                      sendRequest={sendRequest}
                      subscribeToSelection={subscribeToSelection}
                      loadPrematchGames={loadPrematchGames}
                      bulkUnsubscribe={bulkUnsubscribe}
                      retrieve={retrieve}
                      unsubscribe={unsubscribe}
                      getBetslipFreebets={getBetslipFreebets}
                    />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </div>
        <Controls
          unsubscribe={unsubscribe}
          subscribeToSelection={subscribeToSelection}
          retrieve={retrieve}
          validate={validate}
          sendRequest={sendRequest}
          getBetslipFreebets={getBetslipFreebets}
          handleBetResponse={handleBetResponse}
        />
      </React.Fragment>
    );
  }
}
