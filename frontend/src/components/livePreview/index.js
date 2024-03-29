import React from 'react'
import LiveEventSound from '../sound'
import { convertSetName, stringReplacer, EventIDToNameMap } from '../../common'
import moment from 'moment'
import Swiper from 'swiper'
import $ from 'jquery';

export default class LiveGamePreview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            playSound: false,
            isfloatingLiveStream: false,
            hidefloatingLiveStream: false
        }
        this.playSound = this.playSound.bind(this)
        this.headerScroll = this.headerScroll.bind(this)
        this.reverseFloatingStream = this.reverseFloatingStream.bind(this)
        this.livePreviewSwiper = null
    }
    componentDidMount() {
        this.livePreviewSwiper = new Swiper('.swiper-container', {});
        document.getElementsByTagName('body')[0].addEventListener('scroll', this.headerScroll)
    }
    componentWillUnmount() {
        document.getElementsByTagName('body')[0].removeEventListener('scroll', this.headerScroll)
    }
    headerScroll(e) {
        if (e.target.nodeName === 'BODY' && $(e.target.nodeName).scrollTop() >= 400) { if (!this.state.hidefloatingLiveStream) { $('.stream-exist').addClass('small'); this.setState({ isfloatingLiveStream: true }) } }
        else if (e.target.nodeName === 'BODY' && ($(e.target.nodeName).scrollTop() <= 300)) { $('.stream-exist').removeClass('small'); this.setState({ isfloatingLiveStream: false, hidefloatingLiveStream: false }) }
    }
    playSound() {
        this.setState(prevState => ({ playSound: !prevState.playSound }))
    }
    reverseFloatingStream() {
        $('.stream-exist').removeClass('small'); this.setState({ isfloatingLiveStream: false, hidefloatingLiveStream: true })
    }
    displayGameSets(game) {
        let sets = []
        if (game) {
            Object.keys(game.stats).forEach((val) => {
                val.includes('score_set') && sets.push(game.stats[val])
            })

        }
        return sets = sets.map((v, k) => {
            return <span key={k} className="sets-info">{v.team1_value + ' - ' + v.team2_value}</span>
        })

    }
    getSetTotalScore(activeGame) {
        return `${activeGame.info.score1 + ' - ' + activeGame.info.score2}`
    }
    render() {
        const { activeGame, activeView, activeSport, currentLiveEventName, currentLiveEventTeamName } = this.props, { isfloatingLiveStream } = this.state,
            currentSet = activeGame !== null && activeGame.info !== undefined && activeView === 'Live' ? convertSetName()(activeGame.info.current_game_state, stringReplacer(activeSport.alias, [/\s/g], [''])) : '',
            sportAlias = stringReplacer(activeSport.alias, [/\s/g, /'/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '', '']).toLowerCase();
        return (
            activeGame && (activeSport.id === 1 || activeSport.id === 3 || activeSport.id === 4) && activeGame.last_event ?
                <div className={`sb-accordion-content liquid-container ember-view game-view-container stream-exist`} style={{ zIndex: 2 }}>
                    <div className={`liquid-child ember-view`} >
                        <div className="ember-view">
                            <div className={`gameinfo-container ${sportAlias + '-container'}`}>
                                <div className="team-names">
                                    <div className="team-name">
                                        <div className="info">
                                            <span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '' }}></span>
                                            <span title={activeGame ? activeGame.team1_name : null}>{activeGame ? activeGame.team1_name : null}</span>
                                        </div>
                                    </div>
                                    <div className="score">
                                        <span>{activeSport.id === 1 || activeSport.id === 3 ? activeGame ? activeGame.info.score1 : 0 : null} {activeSport.id === 4 ? activeGame ? activeGame.stats.passes ? activeGame.stats.passes.team1_value : 0 : 0 : null}</span>
                                        <span>{activeSport.id === 1 || activeSport.id === 3 ? activeGame ? activeGame.info.score2 : 0 : null} {activeSport.id === 4 ? activeGame ? activeGame.stats.passes ? activeGame.stats.passes.team2_value : 0 : 0 : null}</span>
                                    </div>

                                    <div className="team-name">
                                        <div className="info">
                                            <span title={activeGame ? activeGame.team2_name : null} style={{ textAlign: 'right', paddingRight: '5px' }}>{activeGame ? activeGame.team2_name : null}</span>
                                            <span className="icon-icon-t-shirt" style={{ color: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></span>
                                        </div>
                                    </div>
                                </div>
                                <div className="game-time-block">
                                    <div></div>
                                    <div className="current-game-time">{currentSet === 'notstarted' ? moment.unix(activeGame.start_ts).format('D MMMM YYYY H:mm') : currentSet} {activeGame ? activeGame.info ? activeGame.info.current_game_time : null : null} {activeGame && activeGame.info && activeGame.info.match_add_minutes && activeGame.info.match_add_minutes > 0 ? ' +' + activeGame.info.add_minutes + '\'' : ''}</div>
                                    {!isfloatingLiveStream ?
                                        <div className="switch-audio" onClick={this.playSound}>
                                            <i className={`icon-sb-voice-${this.state.playSound ? 'on' : 'off'}`} title="play live sound"></i>
                                        </div> :
                                        <div className="switch-audio clear" onClick={this.reverseFloatingStream}>
                                            <i className={`uci-close`} title="Hide Stream" style={{ fontSize: '22px' }}></i>
                                        </div>}
                                </div>
                                <div className="swiper-container"  >
                                    <div className="swiper-wrapper">
                                        <div className="swiper-slide">
                                            <div className={`sb-animation-container ${sportAlias} ${activeSport.id > 1 ? 'background' : ''} ${activeSport.id === 4 ? 'blue' : ''} `}>
                                                <div className="sb-animation-block">
                                                    <div className="board-container">
                                                        <div className="board">
                                                            <div className="center"></div>
                                                            <div className="sides">
                                                                <div className="side">
                                                                    {activeSport.id === 1 ?
                                                                        <div className="angles">
                                                                            <span className="top"></span>
                                                                            <span className="bottom"></span>
                                                                        </div> :
                                                                        null
                                                                    }
                                                                    {activeSport.id === 1 ?
                                                                        <div className="areas">
                                                                            <div className="small"></div>
                                                                            <div className="large">
                                                                                <div className="circle"></div>
                                                                            </div>
                                                                        </div>
                                                                        : activeSport.id === 3 ?
                                                                            <div className="areas">
                                                                                <div className="large">
                                                                                    <div className="circle"></div>
                                                                                    <div className="lines"></div>
                                                                                </div>

                                                                                <div className="small">
                                                                                    <div className="circles-block">
                                                                                        <div className="circles">
                                                                                            <div className="left"></div>
                                                                                            <div className="right"></div>
                                                                                        </div>

                                                                                        <div className="outer-block">
                                                                                            <div className="top">
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                            </div>

                                                                                            <div className="bottom">
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="small-area">
                                                                                        <div className="center"></div>
                                                                                        <div className="circle"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            :
                                                                            activeSport.id === 4 ?

                                                                                <div className="area"></div>

                                                                                : null}
                                                                </div>
                                                                <div className="side">
                                                                    {activeSport.id === 1 ?
                                                                        <div className="angles">
                                                                            <span className="top"></span>
                                                                            <span className="bottom"></span>
                                                                        </div> :
                                                                        null
                                                                    }
                                                                    {activeSport.id === 1 ?
                                                                        <div className="areas">
                                                                            <div className="small"></div>
                                                                            <div className="large">
                                                                                <div className="circle"></div>
                                                                            </div>
                                                                        </div>
                                                                        : activeSport.id === 3 ?
                                                                            <div className="areas">
                                                                                <div className="large">
                                                                                    <div className="circle"></div>
                                                                                    <div className="lines"></div>
                                                                                </div>

                                                                                <div className="small">
                                                                                    <div className="circles-block">
                                                                                        <div className="circles">
                                                                                            <div className="left"></div>
                                                                                            <div className="right"></div>
                                                                                        </div>

                                                                                        <div className="outer-block">
                                                                                            <div className="top">
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                            </div>

                                                                                            <div className="bottom">
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                                <span></span>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="small-area">
                                                                                        <div className="center"></div>
                                                                                        <div className="circle"></div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            : activeSport.id === 4 ?

                                                                                <div className="area"></div>

                                                                                : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="ember-view">

                                                        {

                                                            activeGame && activeGame.last_event ?
                                                                <div className={`sb-animation ${activeSport.id !== 3 ? EventIDToNameMap[activeGame.last_event.type_id] ? EventIDToNameMap[activeGame.last_event.type_id].toLowerCase() : '' : ''} ${activeGame && (activeGame.last_event.type_id === '3' && activeGame.last_event.side === 2) ? 'reverse' : ''} ${activeGame && activeGame.last_event.type_id === '20' ? 'half-block' : ''} ${activeGame && activeGame.last_event.type_id === '1' ? 'highlight-animation' : ''}${activeSport.id === 3 ? 'attack' : ''} ${activeGame ? stringReplacer(activeGame.last_event.type_id === '327' || activeGame.last_event.type_id === '328' || activeGame.last_event.type_id === '329' || activeGame.last_event.type_id === '320' ? stringReplacer(activeGame.info.pass_team, [/team1/g, /team2/g], ['home', 'away']) : activeGame.last_event.side, [/1/g, /2/g, /0/g], ['home', 'away', activeGame.last_event.type_id === '20' ? 'away' : '']) : ''} ${activeSport.id === 4 && activeGame ? (activeGame.last_event.type_id === '206') ? 'left' : '' : ''} ${activeSport.id === 4 && activeGame ? (activeGame.last_event.type_id === '205') ? 'change1' : '' : ''} ${activeSport.id === 3 ? 'in-possession' : ''}`}>
                                                                    {
                                                                        activeGame && ((activeSport.id === 1 && activeGame.last_event.type_id === '21') || (activeSport.id === 1 && activeGame.last_event.type_id === '326') || activeSport.id === 3) && <div className="inner">
                                                                            <div className="animated-block"></div>
                                                                        </div>
                                                                    }
                                                                    {
                                                                        this.state.playSound ?
                                                                            activeGame && (activeSport.id === 1 || activeSport.id === 3 || activeSport.id === 4) && (activeGame.last_event.type_id === '1' || activeGame.last_event.type_id === '21' || activeGame.last_event.type_id === '3'
                                                                                || activeGame.last_event.type_id === '2' || activeGame.last_event.type_id === '206' || activeGame.last_event.type_id === '207') ?
                                                                                <LiveEventSound type_id={activeGame.last_event.type_id} alias={activeSport.alias} /> : null : null
                                                                    }
                                                                    {
                                                                        activeSport.id === 4 ?
                                                                            <div>
                                                                                <div className="home">
                                                                                    <div className="image-container">
                                                                                        <div className="image-block">
                                                                                            <img className="point" src="https://static.betconstruct.me/assets/images/game-preview/tennis/point.svg" alt="point" />
                                                                                            <span className="score">{activeGame.stats ? activeGame.stats.point ? activeGame.stats.passes.team1_value : 0 : ''}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="away">
                                                                                    <div className="image-container">
                                                                                        <div className="image-block">
                                                                                            <img className="point" src="https://static.betconstruct.me/assets/images/game-preview/tennis/point.svg" alt="point" />
                                                                                            <span className="score">{activeGame.stats ? activeGame.stats.point ? activeGame.stats.passes.team2_value : 0 : ''}</span>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            : null}
                                                                    {activeSport.id === 4 && activeGame.last_event.type_id === '206' ?
                                                                        <div className="ball-container">
                                                                            <div className="ball"></div>
                                                                        </div>
                                                                        :
                                                                        null
                                                                    }
                                                                    {
                                                                        activeSport.id === 1 && (activeGame.last_event.type_id === '5' || activeGame.last_event.type_id === '25' || activeGame.last_event.type_id === '4' || activeGame.last_event.type_id === '23' || activeGame.last_event.type_id === '24') ?
                                                                            <div >
                                                                                <div className="soccer-ball"></div>
                                                                                {
                                                                                    activeSport.id === 1 && (activeGame.last_event.type_id === '24' || activeGame.last_event.type_id === '4' || activeGame.last_event.type_id === '23') ?

                                                                                        <div className="animated-block half-block">
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                        </div>
                                                                                        :
                                                                                        <div className="animated-block half-block">
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                            <span className="bullet"></span>
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                            :
                                                                            null
                                                                    }
                                                                    {
                                                                        (activeGame.last_event.type_id === '1') ?
                                                                            <div>
                                                                                <div className="center-lines-container">
                                                                                    <div className="center-lines">
                                                                                        <span className="small"></span>

                                                                                        <span className="large">
                                                                                            <span></span>
                                                                                            <span></span>
                                                                                        </span>

                                                                                        <span className="small"></span>
                                                                                    </div>
                                                                                    <div className="center-lines">
                                                                                        <span className="small"></span>

                                                                                        <span className="large">
                                                                                            <span></span>
                                                                                            <span></span>
                                                                                        </span>

                                                                                        <span className="small"></span>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="overlay">
                                                                                    <span className="line"></span>
                                                                                    <span className="separator"></span>
                                                                                    <span className="line"></span>

                                                                                    <div className="text">
                                                                                        <span>Goal</span>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="overlay close">
                                                                                    <span className="line"></span>
                                                                                    <span className="separator"></span>
                                                                                    <span className="line"></span>
                                                                                </div>

                                                                            </div>
                                                                            :
                                                                            null
                                                                    }
                                                                </div>
                                                                : null}
                                                        {activeSport.id === 3 ?
                                                            <div className="ember-view"><div className={`sb-animation ${activeGame.last_event ? stringReplacer(stringReplacer(EventIDToNameMap[activeGame.last_event.type_id], [/([a-z])([A-Z])/g], ['$1 $2'], /\s+/g, ['']), [/[1-1]/g, /[2-2]/g, /[3-3]/g], ['one', 'two', 'three']).toLowerCase() : ''} ${activeGame && activeGame.last_event ? stringReplacer(activeGame.last_event.side, [/1/g, /2/g], ['home', 'away']) : ''}`}>
                                                                <div className="areas">
                                                                    <div className="side">
                                                                        <div className="small">
                                                                            <div className="circles-block">
                                                                                <div className="circles">
                                                                                    <div className="left"></div>
                                                                                    <div className="right"></div>
                                                                                </div>

                                                                                <div className="outer-block">
                                                                                    <span className="bullet"></span>
                                                                                    <span className="bullet"></span>
                                                                                    <span className="bullet"></span>
                                                                                    <span className="bullet"></span>
                                                                                    <span className="bullet"></span>
                                                                                    <span className="bullet"></span>
                                                                                    <span className="bullet"></span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        activeGame.last_event.type_id === '327' || activeGame.last_event.type_id === '328' || activeGame.last_event.type_id === '329' || activeGame.last_event.type_id === '320' || activeGame.last_event.type_id === '325' ?
                                                                            <div className="images-block">
                                                                                {activeGame.last_event.type_id === '320' ?
                                                                                    <div className="images">
                                                                                        <img className="foul" src="https://static.betconstruct.me/assets/images/game-preview/basketball/foul.svg" alt="foul" />
                                                                                    </div>
                                                                                    :
                                                                                    activeGame.last_event.type_id === '325' ?
                                                                                        <div className="images">
                                                                                            <img className="foul" src="https://static.betconstruct.me/assets/images/game-preview/basketball/basket-missed.svg" alt="foul" />
                                                                                        </div>
                                                                                        :
                                                                                        <div className="images">
                                                                                            <img className="basket1" src="https://static.betconstruct.me/assets/images/game-preview/basketball/basket1.svg" alt="basket1" />
                                                                                            <img className="basket2" src="https://static.betconstruct.me/assets/images/game-preview/basketball/basket2.svg" alt="basket2" />

                                                                                            <div className="ball-block">
                                                                                                <img className="ball" src="https://static.betconstruct.me/assets/images/game-preview/basketball/ball.svg" alt="ball" />
                                                                                            </div>
                                                                                        </div>
                                                                                }
                                                                            </div>
                                                                            :
                                                                            null
                                                                    }
                                                                </div>
                                                            </div>
                                                                <div className="event-info-container">
                                                                    {activeGame && activeGame.last_event && activeGame.last_event.type_id && activeSport.alias ?
                                                                        <div className="event-info">
                                                                            <div className="left">
                                                                                <span className="event" title={currentLiveEventName}>{currentLiveEventName}</span>
                                                                            </div>

                                                                            {currentLiveEventTeamName.length ? <div className="right">
                                                                                <span className="team" title={currentLiveEventTeamName}>{currentLiveEventTeamName}</span>
                                                                                <span className="line" style={{ backgroundColor: currentLiveEventTeamName.length ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : "transparent" }}></span>
                                                                            </div> : null}
                                                                        </div> : null}

                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="event-info-container">
                                                                {activeGame && activeGame.last_event && activeGame.last_event.type_id && activeSport.alias ?
                                                                    <div className="event-info">
                                                                        <div className="left">
                                                                            {(activeSport.id === 1 && activeGame.last_event.type_id === '3') ? <i className="icon-icon-cards-yellowred" style={{ color: 'rgb(217, 171, 31)', borderRadius: '4px', marginRight: '5px', fontSize: '19px' }}></i>
                                                                                : (activeSport.id === 1 && activeGame.last_event.type_id === '2') ? <i className="icon-icon-cards-yellowred" style={{ color: 'rgb(209, 25, 31)', borderRadius: '4px', marginRight: '5px', fontSize: '19px' }}></i> : null}
                                                                            {(activeSport.id === 1 && activeGame.last_event.type_id === '4') ?
                                                                                <img src="https://static.betconstruct.me/assets/images/game-statistics/corner.svg" alt="corner"></img>
                                                                                : (activeSport.id === 1 && activeGame.last_event.type_id === '6') ?
                                                                                    <img src="https://static.betconstruct.me/assets/images/game-statistics/substitution.svg" alt="Substitution"></img> :
                                                                                    (activeSport.id === 1 && activeGame.last_event.type_id === '1') ?
                                                                                        <img src="https://static.betconstruct.me/assets/images/game-preview/soccer/ball.svg" style={{ width: '15px' }} alt="goal"></img>
                                                                                        : null
                                                                            }

                                                                            <span className="event" title={currentLiveEventName}>{currentLiveEventName}</span>
                                                                        </div>

                                                                        {currentLiveEventTeamName.length ?
                                                                            <div className="right">
                                                                                <span className="team" title={currentLiveEventTeamName}>{currentLiveEventTeamName}</span>
                                                                                <span className="line" style={{ backgroundColor: currentLiveEventTeamName.length ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : "transparent" }}></span>
                                                                            </div> : null}
                                                                    </div> : null}
                                                                {
                                                                    activeGame && activeGame.info && activeGame.info.match_add_minutes && <div className="extra-time">
                                                                        <span>+{activeGame.info.match_add_minutes}'</span>
                                                                    </div>
                                                                }
                                                            </div>

                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ember-view">
                                                <div className="score-info-container">
                                                    <div className="score-info-inner">
                                                        <div className="game-info-container">
                                                            <span className="score-info-type">{activeSport.id === 1 ? 'Score' : activeSport.id === 2 || activeSport.id === 4 ? 'Set' : activeSport.id === 3 ? 'Total' : 'Score'}</span>
                                                            <span>{this.getSetTotalScore(activeGame)}</span>
                                                        </div>
                                                        <div className="sets-info-container">
                                                            <div className="sets-info-inner">
                                                                {
                                                                    this.displayGameSets(activeGame)
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="swiper-slide">
                                            <div className="game-container ember-view">
                                                <div className="game-statistics soccer">
                                                    <div className="st-scheme">
                                                        <div className="st-scheme-inner">
                                                            {activeSport.id === 1 ?
                                                                <div className="st-container">
                                                                    <div className="st-block">
                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.dangerous_attack ? activeGame.stats.dangerous_attack.team1_value : '-' : '-'}</span>
                                                                        </div>

                                                                        <div className={`st-circle p${activeGame ? activeGame.stats.dangerous_attack ? Math.ceil((activeGame.stats.dangerous_attack.team2_value / (activeGame.stats.dangerous_attack.team2_value + activeGame.stats.dangerous_attack.team1_value)) * 100) : 50 : 50}`} style={{ backgroundColor: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '', width: "44px", height: "44px" }}>
                                                                            <div className="slice">
                                                                                <div className="bar" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                                <div className="fill" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.dangerous_attack ? activeGame.stats.dangerous_attack.team2_value : '-' : '-'}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="st-type">
                                                                        <span>Dangerous Attack</span>
                                                                    </div>
                                                                </div> : null}

                                                            {activeSport.id === 1 ?
                                                                <div className="st-container">
                                                                    <div className="st-block">
                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.shot_on_target ? activeGame.stats.shot_on_target.team1_value : '-' : '-'}</span>
                                                                        </div>

                                                                        <div className={`st-circle p${activeGame ? activeGame.stats.shot_on_target ? Math.ceil((activeGame.stats.shot_on_target.team2_value / (activeGame.stats.shot_on_target.team2_value + activeGame.stats.shot_on_target.team1_value)) * 100) : 50 : 50}`} style={{ backgroundColor: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '', width: "44px", height: "44px" }}>
                                                                            <div className="slice">
                                                                                <div className="bar" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                                <div className="fill" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.shot_on_target ? activeGame.stats.shot_on_target.team2_value : '-' : '-'}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="st-type">
                                                                        <span>Shot On Target</span>
                                                                    </div>
                                                                </div> : null}
                                                            {activeSport.id === 1 ?
                                                                <div className="st-container">
                                                                    <div className="st-block">
                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.shot_off_target ? activeGame.stats.shot_off_target.team1_value : '-' : '-'}</span>
                                                                        </div>

                                                                        <div className={`st-circle p${activeGame ? activeGame.stats.shot_off_target ? Math.ceil((activeGame.stats.shot_off_target.team2_value / (activeGame.stats.shot_off_target.team2_value + activeGame.stats.shot_off_target.team1_value)) * 100) : 50 : 50}`} style={{ backgroundColor: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '', width: "44px", height: " 44px" }}>
                                                                            <div className="slice">
                                                                                <div className="bar" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                                <div className="fill" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.shot_off_target ? activeGame.stats.shot_off_target.team2_value : '-' : '-'}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="st-type">
                                                                        <span>Shot Off Target</span>
                                                                    </div>
                                                                </div> : null}
                                                            {activeSport.id === 3 ?
                                                                <div className="st-container">
                                                                    <div className="st-block">
                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.foul ? activeGame.stats.foul.team1_value : '-' : '-'}</span>
                                                                        </div>

                                                                        <div className={`st-circle p${activeGame ? activeGame.stats.foul ? Math.ceil((activeGame.stats.foul.team2_value / (activeGame.stats.foul.team2_value + activeGame.stats.foul.team1_value)) * 100) : 50 : 50}`} style={{ backgroundColor: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '', width: "44px", height: " 44px" }}>
                                                                            <div className="slice">
                                                                                <div className="bar" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                                <div className="fill" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.foul ? activeGame.stats.foul.team2_value : '-' : '-'}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="st-type">
                                                                        <span>Fouls</span>
                                                                    </div>
                                                                </div> : null}
                                                            {activeSport.id === 4 ?
                                                                <div className="st-container">
                                                                    <div className="st-block">
                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.aces ? activeGame.stats.aces.team1_value : '-' : '-'}</span>
                                                                        </div>

                                                                        <div className={`st-circle p${activeGame ? activeGame.stats.aces ? Math.ceil((activeGame.stats.aces.team2_value / (activeGame.stats.aces.team2_value + activeGame.stats.aces.team1_value)) * 100) : 50 : 50}`} style={{ backgroundColor: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '', width: "44px", height: " 44px" }}>
                                                                            <div className="slice">
                                                                                <div className="bar" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                                <div className="fill" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.aces ? activeGame.stats.aces.team2_value : '-' : '-'}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="st-type">
                                                                        <span>Aces</span>
                                                                    </div>
                                                                </div> : null}
                                                            {activeSport.id === 4 ?
                                                                <div className="st-container">
                                                                    <div className="st-block">
                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.double_fault ? activeGame.stats.double_fault.team1_value : '-' : '-'}</span>
                                                                        </div>

                                                                        <div className={`st-circle p${activeGame ? activeGame.stats.double_fault ? Math.ceil((activeGame.stats.double_fault.team2_value / (activeGame.stats.double_fault.team2_value + activeGame.stats.double_fault.team1_value)) * 100) : 50 : 50}`} style={{ backgroundColor: activeGame ? activeGame.info.shirt1_color !== '000000' ? '#' + activeGame.info.shirt1_color : 'rgb(59, 189, 189)' : '', width: "44px", height: " 44px" }}>
                                                                            <div className="slice">
                                                                                <div className="bar" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                                <div className="fill" style={{ borderColor: activeGame ? activeGame.info.shirt2_color !== '000000' ? '#' + activeGame.info.shirt2_color : 'rgb(165, 28, 210)' : '' }}></div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="value">
                                                                            <span>{activeGame ? activeGame.stats.double_fault ? activeGame.stats.double_fault.team2_value : '-' : '-'}</span>
                                                                        </div>
                                                                    </div>

                                                                    <div className="st-type">
                                                                        <span>Double Faults</span>
                                                                    </div>
                                                                </div> : null}
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                :
                ''
        )
    }
}