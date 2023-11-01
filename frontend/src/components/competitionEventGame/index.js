import React from 'react'
import LiveBtn from '../liveBtn'
import moment from 'moment-timezone'
import {
  stringReplacer,
  convertSetName
} from '../../common'
import { withRouter } from 'react-router-dom'
class CompetitionEventGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      loadGames: false,
      games: [], data: [],
      gamesArr: [],
      draggedGame: null
    };
    this.gamebody = null
    this.timeout = null
    this.onDragStart = this.onDragStart.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.addClass = this.addClass.bind(this)
  }
  loadMarkets(game, sport, region, competition) {
    const activeView = this.props.activeView
    if (activeView === 'Live' || activeView === 'Prematch') {
      this.props.loadMarkets(competition, region, sport, game)
      // updateBrowserHistoryState({sport:sport.id,region:region.id,competition:competition.id,game:game.id},`/sports/${activeView.toLowerCase()}/${sport.alias}/${region.name}/${competition.id}/${game.id}`)
    }
    else {
      const view = activeView === 'Home' ? 'live' : 'prematch'
      this.props.history.replace(`/sports/${view}/${sport.alias}/${region.name}/${competition.id}/${game.id}`, { sport: sport.id, region: region.id, competition: competition.id, game: game.id })
    }
  }
  sortDateByDayASC(a, b) {

    if (moment(a.date).isAfter(b.date, 'day')) {
      return 1;
    }
    if (moment(a.date).isBefore(b.date, 'day')) {
      return -1;
    }
    return 0;
  }
  sortDateByTimeASC(a, b) {
    var anewDate = moment.unix(a.start_ts).format('YYYY-MM-DD H:mm');
    var bnewDate = moment.unix(b.start_ts).format('YYYY-MM-DD H:mm');
    if (moment(anewDate).isAfter(bnewDate)) {
      return 1;
    }
    if (moment(anewDate).isBefore(bnewDate)) {
      return -1;
    }
    return 0;
  }
  sortDateDESC(a, b) {
    if (a.date > b.date) {
      return -1;
    }
    if (b.date > a.date) {
      return 1;
    }
    return 0;
  }
  onDragStart(e, g, c) {
    e.dataTransfer.setData('text', JSON.stringify(g))
    // e.dataTransfer.effectAllowed = "move";
    this.addClass(g.id + '' + c)
  }
  gameClicked(g) {
    this.setState({ draggedGame: g.id })
    this.props.addToMultiViewGames(g.id)
  }
  onDragEnd(e, g) {
    this.setState({ draggedGame: null })
    document.getElementById(g).classList.remove('dragging')
  }
  addClass(g) {
    this.timeout = setTimeout(() => {
      document.getElementById(g).classList.add('dragging')
    });
  }
  componentWillUnmount() {
    clearTimeout(this.timeout)
  }
  render() {
    const {
      props: { multiview, games, region, sport, betSelections, addEventToSelection, activeGame, competition, multiviewGames, oddType },
      state: { }
    } = this;
    let data = [], eventSize = 0
    if (null !== games && undefined !== games)
      Object.keys(games).forEach((game, ind) => {
        if (null !== games[game]) {
          data.push(games[game])
          if (eventSize === 0) {
            let cc = games[game]
            const dd = cc;
            if (dd.market && dd.market[Object.keys(dd.market)[0]] && dd.market[Object.keys(dd.market)[0]].event) {
              eventSize = Object.keys(dd.market[Object.keys(dd.market)[0]].event).length
            }
          }
        }
      })
    data.sort(this.sortDateByDayASC)
    return (
      <div ref={(e) => { this.gamebody = e }} className={`sportlist-competition-accordion`} >
        <div className="sb-accordion-container">
          {
            data.map((game, index) => {
              if (null !== game && (null !== game.market)) {
                let currentSet = game !== null && game.info && game.info.current_game_state ? convertSetName()(game.info.current_game_state, stringReplacer(sport.alias, [/\s/g], [''])) : '';
                let events = [], cmarket, marketSize = game.market ? Object.keys(game.market).length : 0, eventMarket = game.market ? game.market[Object.keys(game.market)[0]] : null;
                if (marketSize > 0 && eventSize > 0)
                  for (const mark in game.market) {
                    cmarket = game.market[mark]
                    if (cmarket && cmarket.type === "P1XP2") {
                      Object.keys(cmarket.event).forEach((eventItem, ind) => {
                        if (null !== cmarket.event[eventItem])
                          events.push(cmarket.event[eventItem])
                      })
                      break;
                    } else if (cmarket && cmarket.type === "P1P2") {
                      Object.keys(cmarket.event).forEach((eventItem, ind) => {
                        if (null !== cmarket.event[eventItem])
                          events.push(cmarket.event[eventItem])
                      })
                      break;
                    }
                  }
                events.sort((a, b) => {
                  if (a.order > b.order)
                    return 1
                  if (b.order > a.order)
                    return -1
                  return 0
                })
                return (
                  !multiviewGames.includes(game.id) ?
                    <div key={index} title={game.team1_name + " - " + game.team2_name} id={game.id + '' + competition.id} className={`sb-accordion-item match open ember-view ${multiview ? 'draggable' : ''}`} draggable={multiview ? true : false}
                      onDragStart={(e) => { this.onDragStart(e, game, competition.id) }} onDragEnd={(e) => { this.onDragEnd(e, game.id + '' + competition.id) }}>
                      <div onClick={() => activeGame && activeGame.id !== game.id && !multiview ? this.loadMarkets(game, sport, region, competition) : multiview ? this.gameClicked(game) : this.loadMarkets(game, sport, region, competition)} className={`${eventSize > 0 ? 'col-sm-6' : 'col-sm-12'} sb-accordion-title match-title ${activeGame && activeGame.id === game.id ? 'select' : ''}`}>
                        <div className="match-title-text">
                          <span className="col-sm-10">{game.team1_name}</span>
                          <span className="col-sm-2">{game.info ? game.info.score1 : ''}</span>
                        </div>
                        <div className="match-title-text match-title-text-x2">
                          <span className="col-sm-10">{game.team2_name}</span>
                          <span className="col-sm-2">{game.info ? game.info.score2 : ''}</span>
                        </div>
                        <div className="hidden-icons">
                          <div className="match-time">
                            <div className="match-time-info">
                              {game.info ? currentSet !== 'notstarted' ? currentSet : moment.unix(game.start_ts).format('D MMMM YYYY H:mm') : null} {game.info ? game.info.current_game_time : null}
                            </div>
                            {/* <div  className="goal-alert-msg">Goal!!!</div> */}
                          </div>
                          <span className="add-to-favorite" data-balloon="Add to Favourites">
                            <i className="icon-icon-star"></i>
                          </span>
                        </div>

                      </div>
                      {eventSize > 0 && <div className="col-sm-6 sb-accordion-content match-content sportlist-game-accordion" style={{ display: 'flex' }}>
                        <div>
                          <div className="sb-game-bet-block-wrapper col-sm-12">
                            <div className="sb-game-bet-block">
                              {
                                (events.length > 0) ?
                                  events.map((e, i) => {
                                    return (

                                      <LiveBtn key={i} e={e} betSelections={betSelections} game={game} eventMarket={eventMarket} addEventToSelection={addEventToSelection} oddType={oddType} competition={competition} sport={sport} region={region} />
                                    )
                                  })
                                  :
                                  this.props.eventTypeLen.map((e, i) => {
                                    return (
                                      <div key={i} className="sb-game-bet-block-inner" title="-"><div className="sb-game-bet-coeficiente">-</div></div>
                                    )
                                  })
                              }
                            </div>
                          </div>
                        </div>

                      </div>}
                    </div>
                    : null
                )
              }
            })
          }
        </div>
      </div>
    )
  }
}
export default withRouter(CompetitionEventGame)