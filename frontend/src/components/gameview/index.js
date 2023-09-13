import React from 'react'
import { MarketLoader } from '../loader'
import { stringReplacer, EventIDToNameMap } from '../../common'
import moment from 'moment'
import { StatsBannerSoccer, StatsBannerBasketBall, StatsBannerTennis, StatsBannerGeneric } from '../statsBanner'
import Market from '../market'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH } from '../../actionReducers'
import LiveGamePreview from '../livePreview'
import Controls from '../../containers/controls'

export default class GameView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false,
      showRelated:false,
      activeNav: 0,
      activeSportView: 0,
      showPreview: true,
      loadingInitialData: false,
      view: null,
      sport: {},
      competition: {},
      region: {},
      game: {},
      relatedGames:[]
    }
    this.rids= {...this.props.sportsbook.rids}
    this.goBack = this.goBack.bind(this)
    this.showRelatedGames= this.showRelatedGames.bind(this)
    this.relatedGames= this.relatedGames.bind(this)
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
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadMarket: true,activeView: newState.activeView, activeSport: newState.sport, activeGame: newState.game, activeRegion: newState.region, activeCompetition: newState.competition, }))
    if (void 0 !== sessionData.sid && !this.state.loadingInitialData) {
      this.loadMarkets(locState.game)
      this.getRelatedGames({sport:newState.sport,region:newState.region,competition:newState.competition,game:newState.game})
      this.setState({ loadingInitialData: true, ...newState })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { view, sport, region, competition, game } = this.props.match.params, { sessionData, marketData } = this.props.sportsbook, locState = this.props.location.state ? this.props.location.state : window.history.state && !window.history.state.hasOwnProperty('key') ? window.history.state : {}, newState = { activeView: view.charAt(0).toUpperCase() + view.slice(1) }
    if (sport)
      newState.sport = locState.sport
    if (region)
      newState.region = locState.region
    if (competition)
      newState.competition = locState.competition
    if (game)
      newState.game = locState.game
    if (void 0 !== sessionData.sid && this.state.view === view && (this.state.sport !== locState.sport || this.state.region !== locState.region || this.state.competition !== locState.competition || this.state.game !== locState.game) && this.state.loadingInitialData && Object.keys(marketData).length) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { marketData: {}, activeSport: newState.sport, activeGame: newState.game, activeRegion: newState.region, activeCompetition: newState.competition,loadMarket: true }))
      this.setState({ loadingInitialData: false, ...newState })
    }
    else {
      if (void 0 !== sessionData.sid && !this.state.loadingInitialData && !Object.keys(marketData).length) {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeSport: newState.sport, activeGame: newState.game, activeRegion: newState.region, activeCompetition: newState.competition, loadMarket: true, marketData: {} }))
        this.loadMarkets(locState.game)
        this.getRelatedGames({sport:newState.sport,region:newState.region,competition:newState.competition,game:newState.game})
        this.setState({ loadingInitialData: true, view: view, ...newState })
      }
    }
  }
  componentWillUnmount() {
    this.props.unsubscribe(this.props.sportsbook.inviewMarketsubid, 'inviewMarketsubid')
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { marketData: {}, activeGame: {} }))
  }
  loadMarkets(game) {
    if (game) {
      let request = {
        command: "get",
        params: {
          source: "betting",
          what: {game:[],market: ["id", "type", "express_id", "name", "base", "display_key", "display_sub_key", "main_order", "order", "col_count", "cashout", "group_id", "group_name"], event: ["id", "price", "type", "name","order","base"] },
          where: { game: { id: game.id } },
          subscribe: true
        }, rid: 9
      }
      let newRid = {}
        newRid[9]=this.rids[9]
        newRid.request=request
        this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(request)

    }
  }  
  getRelatedGames({sport,region,competition,game}) {
    if (game) {
      let request = {
        command: "get",
        params: {
          source: "betting",
          what: {game:["id", "team1_name", "team2_name", "team1_id", "team2_id", "order", "start_ts", "markets_count", "is_blocked", "video_id", "tv_type", "info", "team1_reg_name", "team1_reg_name"] },
          where: {sport:{id:sport.id},region:{id:region.id},competition:{id:competition.id} ,game: { id:{"@ne": game.id},is_live:1 } },
          subscribe: true
        }, rid: 'r-c-game'
      }
      let newRid = {}
      newRid['r-c-game']={rid:'r-c-game',callback:this.relatedGames,request:request}
      this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
      this.props.sendRequest(request)

    }
  }
  relatedGames(data){
   data = data.data
   if(data.hasOwnProperty('game')){
     let games=[]
     Object.keys(data.game).forEach((gameId)=>{
       games.push(data.game[gameId])
     })
     this.setState({relatedGames:games})
   }
  }
  showRelatedGames(e){
    e.stopPropagation()
    this.setState(prevState=>({showRelated:!prevState.showRelated}))
  }
  sortByGroups(groupID) {
    this.setState({ activeNav: groupID })
  }
  goBack(){
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadMarket: false, game:null,marketData:[] }))
    this.props.history.goBack()
   }
  render() {
    const { activeNav, sport, competition, region,showRelated } = this.state, { activeGame, loadMarket, activeView, activeSport, activeGameSuspended, betSelections, oddType, marketData,data } = this.props.sportsbook, { addEventToSelection, clearUpdate,getBetslipFreebets,retrieve,validate,unsubscribe,subscribeToSelection,sendRequest } = this.props
    let marketDataArr = [], marketDataGrouping = [], marketGroups = [],relatedGames=[]
    for (let data in marketData) {
      if (marketData[data]) {
        var name = marketData[data].name, groupID = marketData[data].group_id
        if (!marketGroups[groupID]) {
          marketGroups[groupID] = { id: marketData[data].group_id, name: marketData[data].group_name }
        }
        if (activeNav !== 0) {
          if (activeNav === groupID) {
            if (marketDataGrouping[name]) {
              marketDataGrouping[name].push(marketData[data])
            }
            else
              marketDataGrouping[name] = [marketData[data]]
          }
        } else {
          if (marketDataGrouping[name]) {
            marketDataGrouping[name].push(marketData[data])
          }
          else
            name !== void 0 && (marketDataGrouping[name] = [marketData[data]])
          // marketDataArr.push(marketData[data])
        }
      }
    }

    Object.keys(marketDataGrouping).forEach((name, key) => {
      name !== void 0 && marketDataArr.push({ name: name, data: marketDataGrouping[name] })
    })
    marketDataArr.sort((a, b) => {
      if (a.data[0].order > b.data[0].order)
        return 1;

      if (b.data[0].order > a.data[0].order)
        return -1;

      return 0;
    })
    return (
      <div className={`market col-sm-12 ${activeView.toLowerCase()}`}>
          <div {...{ className: `competition-name` }}onClick={this.goBack}>
              {!loadMarket ?
                      <React.Fragment>
                        <span className="icon-icon-arrow-left back-btn"  style={{fontSize:'15px'}}></span>
                        <span {...{ className: `region-icon ${region.alias ? 'flag-icon' : null} flag-${region.alias ? region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : null}`,style:{height:'14px',backgroundSize:'100%'}}}></span>
                        <span className="competition-name" style={{flex:'1 1 50%'}}>{region.name}, {competition.name}</span>
                        {/* <div className="change" onClick={this.showRelatedGames}><span>Change</span><span className={`icon-icon-arrow-${showRelated?'up':'down'}`}></span></div> */}
                      </React.Fragment>
                  : <div className="g-loading large gradient"></div>}
            </div>
            {
              showRelated &&<div className="">

                <div></div>
              </div>
            }
        <div className={`market-container ${loadMarket || !activeGame ? 'market-loading' : ''}`}>
          {
            loadMarket?
              <MarketLoader activeView={activeView} /> :
              activeGame && Object.keys(activeGame).length>0? <React.Fragment>
                {activeView !== "Live" ?
                <div {...{ className: `game-info banner-image ${stringReplacer(activeSport.name, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()}` }}>
                  
                    <div className={`game-date-time`}>
                    <span className="date">{activeGame ? moment.unix(activeGame.start_ts).format('dddd, D MMMM YYYY') : null}</span>
                    <span className="time">{activeGame ? moment.unix(activeGame.start_ts).format('H:mm') : null}</span>
                  </div>
                  <div className={`game-teams-competition`}>
                    <span className="teams"><span className="w1">{activeGame ? activeGame.team1_name : null}</span> <span className="vs">{activeGame ? activeGame.team2_name ? "vs" : '' : null}</span><span className="w2">{activeGame ? activeGame.team2_name : null}</span></span>
                  </div>
                </div>
                :
                <LiveGamePreview activeGame={activeGame} activeSport={sport} activeView={activeView}currentLiveEventTeamName ={ activeGame !== null && activeGame.last_event !== undefined && activeView === 'Live' ? activeGame.last_event.side === '1' ? activeGame.team1_name : activeGame.last_event.side === '2' ? activeGame.team2_name : '' : ''} currentLiveEventName = {activeGame !== null && void 0 !==activeSport.alias && activeGame.last_event !== undefined && activeView === 'Live' ? stringReplacer(EventIDToNameMap[activeGame.last_event.type_id], [/([a-z])([A-Z])/g, /\b(\w*Period\w*)\b/g], ['$1 $2', '']) : ''}/>
                  }
                {
                  activeView === "Live" && <React.Fragment>
                    {/* <div className="more-stats-info">
                      <div className="info-type">
                          <span>Timeline</span>
                      </div>
                      <div className="info-type">
                        <span>Match Events</span>
                      </div>
                      <div className="info-type">
                        <span>Stats</span>
                      </div>
                    </div> */}
                    {
                      activeGame && activeGame.stats?
                       activeSport.id == 1 ?
                      <StatsBannerSoccer activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket} />
                      : activeSport.id == 3 ?
                        <StatsBannerBasketBall activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket} />
                        : activeSport.id == 4 ?
                          <StatsBannerTennis activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket} />
                          : <StatsBannerGeneric activeSport={activeSport} activeGame={activeGame} loadMarket={loadMarket}/>
                          :null
                    }
                    {
                      activeSport.id === 1 && <div className="gameinfo-container">
                        <div id="ember42936" className="ember-view"><div className="time-line-container show desktop">
                          <div className="time-line normal">
                            <div className="cur-time" style={{ right: activeGame ? activeGame.info ? activeGame.info.current_game_state === 'Half Time' ? '50%' : (100 - (activeGame.info.current_game_time / 90 * 100)) + '%' : 0 : 0 }}></div>

                            <span className={`${activeGame && activeGame.info && (activeGame.info.current_game_time > 0 || activeGame.info.current_game_state === 'Half Time') && 'active'}`}>
                              <span>0</span>
                            </span>
                            <span className="active">	</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && (activeGame.info.current_game_time >= 15 || activeGame.info.current_game_state === 'Half Time') && 'active'}`}>	<span>15</span>		</span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && (activeGame.info.current_game_time >= 30 || activeGame.info.current_game_state === 'Half Time') && 'active'}`}>	<span>30</span>		</span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className="active half-time ">
                              <span className="">HT</span>
                            </span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && activeGame.info.current_game_time && activeGame.info.current_game_time >= 60 && 'active'}`}>	<span>60</span>		</span>
                            <span className="active">			</span>
                            <span className="active">			</span>
                            <span className={`${activeGame && activeGame.info && activeGame.info.current_game_time && activeGame.info.current_game_time >= 75 && 'active'}`}>	<span>75</span>		</span>
                            <span className="active">			</span>
                            <span className="active full-time">			</span>
                            <span className={`${activeGame && activeGame.info && activeGame.info.current_game_time && activeGame.info.current_game_time >= 90 && 'active'}`}>
                              <span>FT</span>
                            </span>
                          </div>
                        </div></div>
                      </div>
                    }
                  </React.Fragment>
                }

                <div className="market-event-container">
                  <div className={`scrollable`}>
                    {activeView == "Live" ?
                      <div className="sb-game-markets-game-info">
                        <i className="icon-icon-info"></i>
                        <span className="game-info-text">{activeGame ? activeGame.text_info : null} {activeGame.add_info_name ? " | " + activeGame.add_info_name : ''}</span>
                      </div>
                      : null}


                    <div>
                      <div className="events-nav mobile-markets-scroll-area">
                        <div {...{ className: `events-nav-item ${activeNav == 0 ? 'active' : null}`, onClick: () => activeNav != 0 ? this.sortByGroups(0) : null }}>
                          <div className="active-market-type"></div>
                          <span className="market-type-name">All</span>
                          </div>
                        {
                          marketGroups.map((group, id) => {
                            return (
                              <div key={group.id} {...{ className: `events-nav-item ${activeNav == group.id ? 'active' : null}`, onClick: () => activeNav != group.id ? this.sortByGroups(group.id) : null }}>
                                <div className="active-market-type"></div>
                                <span className="market-type-name">{group.name}</span>  
                                </div>
                            )
                          })
                        }
                      </div>

                      <div>
                        {marketDataArr.length > 0 ?
                          <div className={`events-list`}>
                            {
                              marketDataArr.map((market, key) => {
                                var elRef = React.createRef();
                                return (

                                  <Market ref={elRef} marketIndex={key} key={market.data[0].id+''+key} activeGameSuspended={activeGameSuspended} activeGame={activeGame} market={market} addEventToSelection={addEventToSelection} loadMarket={loadMarket} betSelections={betSelections} clearUpdate={clearUpdate} oddType={oddType} sport={sport} region={region} competition={competition} />
                                )
                              })

                            }
                          </div>
                          : null
                        }
                      </div>
                      <div className="sb-indicator-message">
                        <span>
                          The time display shown within live betting serves as an indicator. The company takes no responsibility for the correctness and currentness of the displayed information like score or time.
                            </span>
                        <br />
                      </div>

                    </div>
                  </div>
                </div>

              </React.Fragment>:
               <div className="sb-indicator-message">
                 <div className="suspended-game">
                   <span className="blocked-icon"></span>
                 <span>
                   The game is suspended
                </span>
                 </div>
               <br />
             </div>
          }
        </div>
       
      </div>
    )
  }
}