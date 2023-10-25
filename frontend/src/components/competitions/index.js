import React from 'react'
import CompetitionGame from '../competititonGame'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY } from '../../actionReducers'

export default class Competitions extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingInitialData: false,
      sport: {},
      competition: {},
      region: {},
      game: {}
    }
    this.loadGames = this.loadGames.bind(this)
    this.goBack = this.goBack.bind(this)
    this.loadMarkets = this.loadMarkets.bind(this)
  }

  componentDidMount() {
    let { view, sport, region, competition } = this.props.match.params, { sessionData } = this.props.sportsbook, locState = this.props.location.state ? this.props.location.state : window.history.state && !window.history.state.hasOwnProperty('key') ? window.history.state : {}, newState = { activeView: view.charAt(0).toUpperCase() + view.slice(1) }
    if (sport)
      newState.sport = locState.sport
    if (region)
      newState.region = locState.region
    if (competition)
      newState.competition = locState.competition

    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadCompetition: true, activeView: newState.activeView, activeSport: newState.sport, activeGame: newState.game, activeRegion: newState.region, activeCompetition: newState.competition, }))
    if (void 0 !== sessionData.sid && !this.state.loadingInitialData) {
      this.loadGames(locState.competition, locState.region, locState.sport)
      this.setState({ loadingInitialData: true, ...newState })
    }
  }
  componentDidUpdate() {
    let { view, sport, region, competition } = this.props.match.params, { sessionData, competitionData } = this.props.sportsbook, locState = this.props.location.state ? this.props.location.state : window.history.state && !window.history.state.hasOwnProperty('key') ? window.history.state : {}, newState = { activeView: view.charAt(0).toUpperCase() + view.slice(1) }
    if (sport)
      newState.sport = locState.sport
    if (region)
      newState.region = locState.region
    if (competition)
      newState.competition = locState.competition

    if (void 0 !== sessionData.sid && (this.state.sport !== locState.sport || this.state.region !== locState.region || this.state.competition !== locState.competition) && this.state.loadingInitialData && Object.keys(competitionData).length) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadCompetition: true, competitionData: {}, ...newState }))
      this.setState({ loadingInitialData: false, ...newState })
      console.log('object')
    }
    else {
      if (void 0 !== sessionData.sid && !this.state.loadingInitialData && !Object.keys(competitionData).length) {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { ...newState, loadCompetition: true }))
        this.loadGames(locState.competition, locState.region, locState.sport)
        this.setState({ loadingInitialData: true, ...newState })
      }
    }
  }
  componentWillUnmount() {
    this.props.bulkUnsubscribe([], true)
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { competitionData: {}, loadCompetition: false, competitionName: null, competition: null, competitionRegion: {} }))
  }
  goBack() {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadCompetition: false, competitionName: null, competition: null, competitionRegion: {}, competitionData: {} }))
    this.props.history.goBack()
  }
  loadMarkets(data) {
    const { sport, region, competition } = this.state, game = { ...data }
    delete game.market
    this.props.history.push(`${this.props.match.url}/${game.id}`, { sport: sport, region: region, competition: competition, game: game })
  }
  loadGames(competition, region, sport = null) {
    const { Prematch } = this.props.sportsbook
    let type = Prematch
    let request = {
      command: "get",
      params: {
        source: "betting",
        what: { game: [[]], event: [], market: [] },
        where: {
          competition: { id: competition.id },
          game: {
            type: { "@in": type }
          },
          market: { display_key: "WINNER", display_sub_key: "MATCH" }
        },
        subscribe: true
      }, rid: 8
    }
    this.props.sendRequest(request)
  }
  render() {
    const { addEventToSelection } = this.props, { region, competition, sport } = this.state, { competitionData, loadCompetition, betSelections, activeGame, oddType } = this.props.sportsbook
    return (
      <div className={`competition col-sm-12`}>
        <CompetitionGame addEventToSelection={addEventToSelection} region={region} competition={competition} sport={sport} competitionData={competitionData}
          loadMarkets={this.loadMarkets} loadCompetition={loadCompetition} betSelections={betSelections} activeGame={activeGame} oddType={oddType} goBack={this.goBack} />
      </div>
    )
  }
}