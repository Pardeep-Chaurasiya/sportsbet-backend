import React from "react";
import API from "../../services/api";
import SlotGamesBanner from "../../components/slotgamebanner";
import SportsComponent from "../../containers/sportsComponent";
import { allActionDucer } from "../../actionCreator";
import { CasinoLoading } from "../../components/loader";
import {
  SPORTSBOOK_ANY,
  MODAL,
  PLAY_GAME,
  QUIT_GAME,
  GAME_BANNER,
} from "../../actionReducers";
import GamePlayMode from "./slotGameITem";
import Helmet from "react-helmet";
import $ from "jquery";
import ReactGA from "react-ga";
const $api = API.getInstance();
export default class SlotGames extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingInitailData: false,
      games: [],
      loadingGames: true,
      categories: [],
      loadingCategories: true,
      providers: [],
      loadingProviders: true,
      loadingMore: false,
      gameCurrentPage: 1,
      game: null,
      wantToPlay: false,
      activeCat: "all",
      activePro: "all",
      hidePro: false,
    };
    this.playGame = this.playGame.bind(this);
    this.closeGame = this.closeGame.bind(this);
    this.togglePlayForReal = this.togglePlayForReal.bind(this);
    this.filterGamesByCategory = this.filterGamesByCategory.bind(this);
    this.filterGamesByCategory = this.filterGamesByCategory.bind(this);
    this.filterGamesByProivder = this.filterGamesByProivder.bind(this);
    // $api.getBanners(
    //   { bid: 25 },
    //   this.bannersResult.bind(this),
    //   this.onError.bind(this)
    // );
  }
  componentDidMount() {
    $api.getSlotGames({ reqType: "post" }, this.handleCasinoGames.bind(this));
    $api.getSlotGames(
      { reqType: "get", pro: "" },
      this.handleCategories.bind(this)
    );
    $api.getSlotGameProviders(null, this.handleProviders.bind(this));
    this.props.dispatch(
      allActionDucer(SPORTSBOOK_ANY, { activeView: "Casino", loadSports: true })
    );
    if (
      undefined !== this.props.sportsbook.sessionData.sid &&
      undefined === this.props.sportsbook.data.sport &&
      !this.state.loadingInitailData
    ) {
      this.setState({ loadingInitailData: true });
      this.props.loadData();
    }
    ReactGA.pageview("/slot-game");
    let locState = this.props.location.state ? this.props.location.state : {};
    if (locState.game) {
      this.playGame(locState.game);
      this.props.history.replace(this.props.match.url);
    }
  }
  componentDidUpdate() {
    if (
      undefined !== this.props.sportsbook.sessionData.sid &&
      undefined === this.props.sportsbook.data.sport &&
      !this.state.loadingInitailData
    ) {
      this.setState({ loadingInitailData: true });
      this.props.loadData();
    }
    if (
      this.props.appState.isLoggedIn &&
      !this.state.wantToPlay &&
      this.state.game !== null
    ) {
      this.props.dispatch(allActionDucer(PLAY_GAME, { playMode: true }));
      this.setState({ wantToPlay: true });
    }
  }
  componentWillUnmount() {
    this.props.bulkUnsubscribe([], true);
    this.props.dispatch(
      allActionDucer(SPORTSBOOK_ANY, {
        data: [],
        liveNowData: {},
        upcomingData: {},
        populargamesData: {},
      })
    );
  }
  bannersResult({ data }) {
    this.props.dispatch(allActionDucer(GAME_BANNER, data.data));
  }
  onError(d) {
    console.log(d);
  }
  togleProviders() {
    this.setState((prevState) => ({ hidePro: !prevState.hidePro }));
  }
  playGame(game) {
    if (game.playtype === "fun") {
      this.props.dispatch(allActionDucer(PLAY_GAME, { playMode: true }));
      this.setState({ wantToPlay: true, game: game });
    } else {
      this.setState({ wantToPlay: this.props.appState.isLoggedIn, game: game });
      if (this.props.appState.isLoggedIn) {
        this.props.dispatch(allActionDucer(PLAY_GAME, { playMode: true }));
      } else
        this.props.dispatch(
          allActionDucer(MODAL, { accVerifyOpen: true, formType: "login" })
        );
    }
  }
  closeGame() {
    this.props.dispatch(allActionDucer(QUIT_GAME, { playMode: false }));
    this.setState({ wantToPlay: false, game: null });
  }
  togglePlayForReal() {
    let { game } = this.state;
    if (this.props.appState.isLoggedIn) {
      this.setState({
        game: { ...game, playtype: game.playtype === "real" ? "fun" : "real" },
      });
    } else
      this.props.dispatch(
        allActionDucer(MODAL, { accVerifyOpen: true, formType: "login" })
      );
  }
  handleCasinoGames({ data }) {
    // const  g = this.state.games.slice(0,this.state.games.length)
    data.data.length
      ? this.setState({ games: data.data, loadingGames: false })
      : this.setState({ loadingGames: false });
  }
  handleMoreCasinoGames({ data }) {
    const g = this.state.games.slice(0, this.state.games.length);
    data.data.length
      ? this.setState({ games: [...g, ...data.data], loadingMore: false })
      : this.setState({ loadingMore: false });
  }
  handleProviders({ data }) {
    this.setState({ providers: data.data, loadingProviders: false });
  }
  handleCategories({ data }) {
    this.setState({ categories: data.data, loadingCategories: false });
  }
  loadMore() {
    const { gameCurrentPage, activePro, activeCat } = this.state;
    let params = { reqType: "post" };
    activeCat !== "all" && (params.cate = activeCat);
    activePro !== "all" && (params.pro = activePro);
    $api.getSlotGames(
      { page: gameCurrentPage + 1, ...params },
      this.handleMoreCasinoGames.bind(this)
    );
    this.setState({ gameCurrentPage: gameCurrentPage + 1, loadingMore: true });
  }
  filterGamesByProivder(provider) {
    // const{activePro,activeCat}=this.state
    let params = { reqType: "post" };
    provider !== "all" && (params.pro = provider);
    this.setState({
      activePro: provider,
      activeCat: "all",
      loadingGames: true,
      gameCurrentPage: 1,
    });
    $api.getSlotGames(params, this.handleCasinoGames.bind(this));
    $api.getSlotGames(
      { reqType: "get", pro: params.pro },
      this.handleCategories.bind(this)
    );
  }
  filterGamesByCategory(category) {
    const { activePro } = this.state;
    let params = { reqType: "post" };
    category !== "all" && (params.cate = category);
    activePro !== "all" && (params.pro = activePro);
    this.setState({ activeCat: category, loadingGames: true });
    $api.getSlotGames(params, this.handleCasinoGames.bind(this));
  }
  render() {
    const { GamesBanner } = this.props,
      {
        loadingMore,
        loadingGames,
        games,
        providers,
        categories,
        hidePro,
        game,
        wantToPlay,
        activeCat,
        activePro,
      } = this.state;
    return (
      <div className={`sportsbook-container casino`}>
        <Helmet>
          <title>Slot Games-Drives</title>
        </Helmet>
        {wantToPlay && (
          <GamePlayMode
            game={game}
            onClose={this.closeGame}
            togglePlayForReal={this.togglePlayForReal}
          />
        )}
        <div className="sportsbook-inner">
          <div className="sportsbook-view">
            <div className="sportsbook-content">
              <div className="event-view col-sm-12">
                <div className="slot-game-view col-sm-12">
                  <SlotGamesBanner photos={GamesBanner} />
                  <div className="slot-game-container">
                    <div className="providers col-sm-12">
                      <div
                        className={`provider-header ${hidePro ? "icon-up" : "icon-down"
                          }`}
                        onClick={this.togleProviders.bind(this)}
                      >
                        <div className="title">Game providers</div>
                        {/* <div className="input">
                                        <div className="sportsbook-search" style={{width:'100%',backgroundColor: 'unset'}}>
                                            <div className="sportsbook-search-input static" style={{backgroundColor:'#d1d1d4',color:'#fff',borderRadius:'4px'}}>
                                                <input placeholder="Search Games" id="game-searcher" className="search-input ember-text-field ember-view" type="text" 
                                                ref={(el) => { this.searchTicketInput = el }} style={{backgroundColor:'#d1d1d4', width: '100%', padding: '0 0 0 15px' }} 
                                                onClick={(e)=>e.stopPropagation()}
                                                />
                                            
                                            </div>
                                        </div>
                                        </div> */}
                      </div>
                      <div
                        className={`provider-list ${hidePro && "toggle-hide"}`}
                      >
                        <ul>
                          <li>
                            <div
                              className={`provider ${activePro === "all" && "active"
                                }`}
                              onClick={() => this.filterGamesByProivder("all")}
                            >
                              ALL
                            </div>
                          </li>
                          {providers.map((provider, key) => {
                            return (
                              <li key={key}>
                                <div
                                  className={`provider ${activePro === provider.provider && "active"
                                    }`}
                                  onClick={() =>
                                    this.filterGamesByProivder(
                                      provider.provider
                                    )
                                  }
                                >
                                  {provider.title}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                    <div className="category-games">
                      <div className="category col-sm-12">
                        <ul style={{ margin: 0 }}>
                          <li>
                            <div
                              onClick={() => this.filterGamesByCategory("all")}
                              className={`${activeCat === "all" && "active"}`}
                            >
                              All
                            </div>
                          </li>
                          {categories.map((category, key) => {
                            return (
                              <li key={key}>
                                <div
                                  onClick={() =>
                                    this.filterGamesByCategory(category.id)
                                  }
                                  className={`${activeCat === category.id && "active"
                                    }`}
                                >
                                  {category.title}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <div className="games col-sm-12">
                        <ul>
                          {loadingGames ? (
                            <CasinoLoading />
                          ) : (
                            games.map((game, key) => {
                              return (
                                <li key={key} className="game">
                                  <div key={game.extearnal_game_id}>
                                    <a style={{ width: "100%" }}>
                                      {" "}
                                      <img src={game.icon} />
                                      <p>{game.name}</p>
                                      <div className="flow-button">
                                        <div>
                                          <button
                                            type="button"
                                            className="play"
                                            onClick={() =>
                                              this.playGame({
                                                ...game,
                                                playtype: "real",
                                              })
                                            }
                                          >
                                            <span>PLAY NOW</span>
                                          </button>
                                          <button
                                            type="button"
                                            className="play"
                                            onClick={() =>
                                              this.playGame({
                                                ...game,
                                                playtype: "fun",
                                              })
                                            }
                                          >
                                            <span>PLAY FOR FREE</span>
                                          </button>
                                        </div>
                                      </div>
                                    </a>
                                  </div>
                                </li>
                              );
                            })
                          )}
                          {loadingMore && <CasinoLoading />}
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div
                    className="load-more"
                    style={{ display: games.length < 20 && "none" }}
                  >
                    <div onClick={this.loadMore.bind(this)}>Load More</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
