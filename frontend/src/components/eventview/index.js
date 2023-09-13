import React from 'react'

import Controls from '../../containers/controls'
import { withRouter } from 'react-router-dom'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY } from '../../actionReducers'
import SportsComponent from '../../containers/sportsComponent'
class EventView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      activeNav: 0,
      activeSportView: 0,
      showPreview: true,
      enableEventSeletionBonus: true,
      selectionBonusPercentage: 0,
      decimalFormatRemove3Digit: false,
      loadingInitialData: false,
      view: null,
      sport: undefined,
      competition: undefined,
      region: undefined,
      game: undefined
    }
    this.sortByGroups = this.sortByGroups.bind(this)
  }
  componentDidMount() {
    let { view, sport, region, competition, game } = this.props.match.params, { sessionData } = this.props.sportsbook, locState = this.props.location.state ? this.props.location.state : window.history.state && !window.history.state.hasOwnProperty('key') ? window.history.state : {}, newState = { activeView: view.charAt(0).toUpperCase() + view.slice(1) }
    if (sport)
      newState.sport = locState.sport
    if (region)
      newState.region = locState.region
    if (competition)
      newState.competition = locState.competition
    if (game)
      newState.game = locState.game
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadSports: true, ...newState }))
    if (undefined !== sessionData.sid && !this.state.loadingInitialData) {
      view === 'live' ?
        this.props.loadLiveGames()
        :
        this.props.loadPrematchGames()
      this.setState({ loadingInitialData: true, view: view, ...newState })
    }
  }
  componentDidUpdate() {
    let { view, sport, region, competition, game } = this.props.match.params, { sessionData, data } = this.props.sportsbook, locState = this.props.location.state ? this.props.location.state : window.history.state && !window.history.state.hasOwnProperty('key') ? window.history.state : {}, newState = { activeView: view.charAt(0).toUpperCase() + view.slice(1) }
    if (sport)
      newState.sport = locState.sport
    if (region)
      newState.region = locState.region
    if (competition)
      newState.competition = locState.competition
    if (game)
      newState.game = locState.game
    if (undefined !== sessionData.sid && this.state.view === view && (this.state.sport !== locState.sport || this.state.region !== locState.region || this.state.competition !== locState.competition || this.state.game !== locState.game) && this.state.loadingInitialData && data.sport) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { marketData: {}, ...newState }))
      this.setState({ loadingInitialData: false, ...newState })
    }
    else if (this.state.view !== view && data.sport) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: view.charAt(0).toUpperCase() + view.slice(1), data: [], loadSports: true, marketData: {}, game: null, sport: null, region: null, competition: null }))
      view === 'live' ?
        this.props.loadLiveGames()
        :
        this.props.loadPrematchGames()
      this.setState({ loadingInitialData: true, view: view, ...newState })
    } else {
      if (undefined !== sessionData.sid && !this.state.loadingInitialData && !data.sport) {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: view.charAt(0).toUpperCase() + view.slice(1), ...newState, loadSports: true, marketData: {}, }))
        view === 'live' ?
          this.props.loadLiveGames()
          :
          this.props.loadPrematchGames()
        this.setState({ loadingInitialData: true, view: view, ...newState })
      }
    }
  }
  componentWillUnmount() {
    this.props.bulkUnsubscribe([], true)
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { data: [],activeView:'', populargamesData: {}, activeGame: {}, activeCompetition: {}, sport: null, region: null, game: null, competition: null }))
  }
  sortByGroups(groupID) {
    this.setState({ activeNav: groupID })
  }

  render() {

    const {activeView} = this.props.sportsbook,
      { loadMarkets, addEventToSelection,sendRequest, loadGames,unsubscribe,validate,getBetslipFreebets,subscribeToSelection,retrieve} = this.props
    return (
      <div className={`event-view col-sm-12 ${activeView.toLowerCase()}`}>
        <SportsComponent bulkUnsubscribe={this.props.bulkUnsubscribe} multiview={false} loadMarkets={loadMarkets} addEventToSelection={addEventToSelection} sendRequest={sendRequest} loadGames={loadGames}/>
      </div>
    )
  }
}
export default withRouter(EventView)