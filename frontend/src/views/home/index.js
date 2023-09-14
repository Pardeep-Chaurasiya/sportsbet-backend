import React from 'react';
import HomeBanner from '../../components/homebanner'
import HomepageEvents from '../../components/homeEvents'
import { LiveEventLoader, CasinoLoading, SportsbookSportItemLoading } from '../../components/loader'
import Controls from '../../containers/controls'
import { SPORTSBOOK_ANY, SITE_BANNER, RIDS_PUSH } from '../../actionReducers';
import { allActionDucer } from '../../actionCreator';
import FeaturedGames from '../../components/featruedgame';
import API from '../../services/api'
import Helmet from 'react-helmet';
import { arrayBuffer } from '../../common';
import Swiper from 'swiper'
import {PreviousSlide,NextSlide} from '../../components/stateless';
import { Link } from 'react-router-dom';
const $api = API.getInstance()
export default class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            loadingInitailData: false,
            featuredbanner:[],
            games:[]
        }
        this.CasinoSwiper=null
        this.bannerRef = React.createRef()
        this.rids = this.props.sportsbook.rids
        this.timeOptions = [
            15,
            30,
            60
        ]
        $api.getBanners({bid:3},this.fBanners.bind(this),this.onError.bind(this))
        $api.getBanners({bid:1},this.bannersResult.bind(this),this.onError.bind(this))
    }
    componentDidMount() {
        this.CasinoSwiper=new Swiper('.swiper-container-casino');
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { activeView: 'Home', loadSports: true }))
        if (undefined !== this.props.sportsbook.sessionData.sid && undefined === this.props.sportsbook.data.sport && !this.state.loadingInitailData) {
            this.setState({ loadingInitailData: true })
            this.props.loadHomeData()
            this.loadHomeEvents()
        }
        // $api.getSlotGames({reqType:'post'},this.handleCasinoGames.bind(this))
    }
    componentDidUpdate() {
        if (undefined !== this.props.sportsbook.sessionData.sid && undefined === this.props.sportsbook.data.sport && !this.state.loadingInitailData) {
            this.setState({ loadingInitailData: true })
            this.props.loadHomeData()
            this.loadHomeEvents()
        }
    }
    componentWillUnmount() {
        this.props.bulkUnsubscribe([], true)
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, {
            data: [], liveNowData: {},
            upcomingData: {},
            populargamesData: {}
        }))
    }
    handleCasinoGames({data}){
        data.data.length ? this.setState({games:data.data,loadingGames:false}):this.setState({loadingGames:false})
    }
    bannersResult({data}){
        this.props.dispatch(allActionDucer(SITE_BANNER,{siteBanner:Array.isArray(data.data)?[...data.data]:[data.data[1]]}))
    }
    fBanners({data}){
        let newD = []
        if( Array.isArray(data.data))
       newD= [...data.data]
        else{
            for (const key in data.data) {
                    newD.push(data.data[key]);
            }
        }
         this.setState({featuredbanner:newD})
    }
    onError(d){
        console.log(d)
    }
    loadHomeEvents() {
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadLiveNow: true, loadUpcomingEvents: true }))
        this.queryEvents('liveNow')
        this.queryEvents('upcoming')
        // this.popularInSportsBook('game')
    }
    queryEvents(type, mf = null) {
        let id = type === 'liveNow' ? 19 : type === 'upcoming' ? 20 : 21;
        var d = {
            source: "betting",
            what: {
                sport: ["id", "name", "alias","type","order"]
            },
            where: {
                game: {
                    // "@limit": this.props.sportsbook.gameLimit
                },
                market: {
                    display_key: "WINNER", display_sub_key: "MATCH"
                }
            }
        };
        d.where.sport = {
            type: {
                "@ne": 1
            }
        };
        if ("lastMinutesBets" === type) {
            d.where.game.start_ts = {
                "@now": {
                    "@gte": 0,
                    "@lt": 60 * (mf ? mf : this.props.sportsbook.minutesFilter)
                }
            }
        } else if ("liveNow" === type) {
            d.where.game.type = 1; 
            d.what.competition= ["id", "order", "name"];
            d.what.region= ["id", "name", "alias"];
            d.what.game=["id", "team1_name", "team2_name", "team1_id", "team2_id", "order","match_length","is_live","is_started", "start_ts", "markets_count", "is_blocked", "video_id", "tv_type", "info", "team1_reg_name", "team1_reg_name"];
            d.what.event= ["id", "price", "type", "name", "order"];
            d.what.market=["id", "type", "express_id", "name"];
            d.where.event={type:{"@in":["P1", "X", "P2"]}};
            d.where.market={display_key: "WINNER", display_sub_key: "MATCH"};
     }
        else if ("upcoming" === type) {
            d.what.game="@count"
            d.where.game.type =  {"@or": [{type: {"{@in": [0, 2]}}, {visible_in_prematch: 1}]};
        }
        this.rids[id].request = {
            command: "get",
            params: { ...d, subscribe: true }, rid: id
        }
        let newRid = {}
        newRid[id]=this.rids[id]
        this.props.dispatch(allActionDucer(RIDS_PUSH,newRid))
        this.props.sendRequest(this.rids[id].request)
    }
    setMinutesFilter(filter) {
        if (filter !== null && void 0 !== filter) {
            this.queryEvents('upcoming', this.timeOptions[filter])
            this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { minutesFilter: this.timeOptions[filter], loadUpcomingEvents: true }))
        }
    }
    slideNext(){
        this.CasinoSwiper.allowSlideNext= true
        this.CasinoSwiper.slideNext()
    }
    slidePrev(){
        this.CasinoSwiper.allowSlidePrev= true
        this.CasinoSwiper.slidePrev()
    }
    playGame(game){
        this.props.history.push('/slot-games',{game:game})
    }
    goToSportsPage({url,params}){
        this.props.history.push(url,params)
    }
    render() {
        const {
            loadUpcomingEvents, loadLiveNow, minutesFilter, liveNowData, upcomingData, betSelections, oddType, data,
            populargamesData, activeView, activeGame,appTheme
        } = this.props.sportsbook, { loadMarkets, loadGames, addEventToSelection, unsubscribe,
            subscribeToSelection,
            retrieve, validate, sendRequest, getBetslipFreebets, history,handleBetResponse } = this.props,{siteBanner}= this.props.homeData, {featuredbanner,games}=this.state
        const sport = data ? data.sport : {}, newdata = [], pg = []
        for (let data in sport) {
            if (null !== sport[data])
                newdata.push(sport[data])
        }
        newdata.sort((a, b) => {
            if (a.order > b.order) {
                return 1;
            }
            if (b.order > a.order) {
                return -1;
            }
            return 0;
        })
        Object.keys(populargamesData).forEach((g) => {
            if (null !== populargamesData[g] && void 0 !== populargamesData[g])
                pg.push(populargamesData[g])
        })
        return (
            <div className={`sportsbook-container ${appTheme+'-theme'}`}>
                <Helmet>
                    <title>Drives - Sports Betting</title>
                </Helmet>
                <div className="sportsbook-inner">
                    <div className="sportsbook-view">
                        <div className="sportsbook-content">
                            <div className="event-view col-sm-12">
                              
                                <div className={`promotion col-sm-12`}>
                                    <div>
                                        <div className="promo-banner">
                                            <div>
                                            <HomeBanner photos={siteBanner} featured_banner={featuredbanner} history={this.props.history}/>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        pg.length?
                                        <div className="events-container">
                                            <div className="content-body">
                                                <div className="header">
                                                    <div className="title">Featured Games</div>
                                                   
                                                </div>
                                            </div>
                                            {loadLiveNow ?
                                                <LiveEventLoader is_live={true} />
                                                :
                                                <FeaturedGames history={history} data={pg} activeView={activeView} loadMarkets={loadMarkets}

                                                    loadGames={loadGames} activeGame={activeGame} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} />
                                            }
                                        </div>
                                        :''
                                    }
                                    <div className="events-container">
                                        <div className="content-body">
                                            <div className="header" onClick={()=>this.goToSportsPage({url:'/sports/prematch',params:{}})}>
                                                <div className="title">Upcoming </div>
                                                <div className={`minutes-filter`}>
                                                    <div className={`filter-button`}>More</div>
                                                </div>
                                            </div>
                                        </div>
                                        {loadUpcomingEvents ?
                                            <SportsbookSportItemLoading />
                                            :
                                            <HomepageEvents history={history} data={upcomingData} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} is_live={false} onEventClick={loadGames} />
                                        }
                                    </div>
                                    <div className="events-container">
                                        <div className="content-body">
                                            <div className="header" onClick={()=>this.goToSportsPage({url:'/sports/live',params:{}})}>
                                                <div className="title"> LIVE NOW</div>
                                                <div className={`minutes-filter`}>
                                                    <div className={`filter-button`}>More</div>
                                                    </div>
                                            </div>
                                        </div>
                                        {loadLiveNow ?
                                            <LiveEventLoader is_live={true} />
                                            :
                                            <HomepageEvents history={history} data={liveNowData} betSelections={betSelections} oddType={oddType} addEventToSelection={addEventToSelection} is_live={true} onEventClick={loadMarkets} />
                                        }
                                    </div>
                                    <div className="top-events">

                                    </div>
                                    <div className="events-container home-casino">
                                        <div className="content-body">
                                            <div className="header">
                                                <div className="title">Slot Games </div>
                                                <div className={`minutes-filter`}>
                                                    <div className={`filter-button`}><Link to="/slot-games">More</Link></div>
                                                </div> 
                                            </div>
                                            <div className="swiper-container swiper-container-casino" style={{overflow:'hidden'}}>

                                            <div className="swiper-wrapper">
                                                {
                                                    arrayBuffer(games,2).map((group, sID) => {
                                                    return(
                                                        <div className="swiper-slide"  key={sID}>
                                                        {
                                                            group.map((game,gID)=>{
                                                                return(
                                                                    <div key={gID} className="casino-item">
                                                                    <img src={game.icon} />
                                                                    <div className="flow-button">            
                                                                    <div>
                                                                        <button type="button" className="play" onClick={()=>this.playGame({...game,playtype:'real'})}><span>PLAY NOW</span></button>
                                                                        <button type="button" className="play" onClick={()=>this.playGame({...game,playtype:'fun'})}><span>PLAY FOR FREE</span></button>
                                                                    </div>        
                                                                    </div>
                                                                </div>
                                                                )
                                                            })
                                                        }

                                                        </div>
                                                    )
                                                    })
                                                }
                                                
                                            </div>
                                            <div className="swiper-button-prev"><PreviousSlide previousSlide={this.slidePrev.bind(this)}/></div>
                                            <div className="swiper-button-next"><NextSlide nextSlide={this.slideNext.bind(this)}/></div>
                                            </div>
                                        </div>  
                                    </div>
                                </div>
                                <Controls unsubscribe={unsubscribe}
                                    subscribeToSelection={subscribeToSelection}
                                    retrieve={retrieve} validate={validate} sendRequest={sendRequest} getBetslipFreebets={getBetslipFreebets}  handleBetResponse={handleBetResponse}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}