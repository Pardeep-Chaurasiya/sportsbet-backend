import React from 'react'
import * as $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import moment from 'moment-timezone'
import { BetHistoryLoader } from '../../components/loader'
import { getCookie, onSelect } from '../../common'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH } from '../../actionReducers'
import CashoutDialog from '../../components/cashoutdialog'
import Swiper from 'swiper'
import { calcMD5 } from '../../utils/jsmd5'
// import API from '../../services/api'
import { NewAPI } from '../../services/api'
const $api = NewAPI.getInstance();
export default class BetHistory extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      openedBet: null,
      loadingInitialData: false,
      showCashoutDailog: false,
      reloadHistory: false,
      openCashout: false,
      cashingOut: null,
      showFilterInputs: false,
      status: '-1',
      type: '-1',
      bet_id: '',
      period: 24,
      periodType: 1,
      datepickerF: '',
      datepickerT: '',
      activeBets: [],
      opened_bet: {}
    }
    this.upcomingGamesPeriods = [1, 2, 3, 6, 12, 24, 48, 72]
    this.betState = { 0: "Unsettled", 1: "Accepted", 3: "Lost", 2: "Returned", 4: "Won", 5: "Cashed out" }
    this.betType = { 1: "Single", 2: "Multiple", 3: "System", 4: "Chain" }
    this.openSelection = this.openSelection.bind(this)
    this.searchBetHistoryResult = this.searchBetHistoryResult.bind(this)
    this.getBetHistory = this.getBetHistory.bind(this)
    this.onDateChangeF = this.onDateChangeF.bind(this)
    this.onDateChangeT = this.onDateChangeT.bind(this)
    this.cancelAutoCashOutRule = this.cancelAutoCashOutRule.bind(this)
    this.doCashout = this.doCashout.bind(this)
    this.getBetAutoCashout = this.getBetAutoCashout.bind(this)
    this.createAutoCashOutRule = this.createAutoCashOutRule.bind(this)
    this.handleSlideChange = this.handleSlideChange.bind(this)
    this.backToMenuModal = this.backToMenuModal.bind(this)
    this.showFilter = this.showFilter.bind(this)
    this.rids = this.props.sportsbook.rids
    this.livePreviewSwiper = null
  }
  componentDidMount() {
    this.livePreviewSwiper = new Swiper('.swiper-container-history', { noSwiping: false, allowSlideNext: this.state.allowSlideNext, allowSlidePrev: this.state.allowSlidePrev });
    const { sessionData } = this.props.sportsbook
    if (!this.state.loadingInitialData) {
      this.getBetHistory()
      this.setState({ loadingInitialData: true })
    }
    $("#datepickerFH").datepicker({
      maxDate: '0', onSelect: function () { onSelect('datepickerFH') }, changeMonth: true,
      changeYear: true
    });
    $("#datepickerTH").datepicker({
      maxDate: '0', onSelect: function () { onSelect('datepickerTH') }, changeMonth: true,
      changeYear: true
    });
    $("#datepickerFH").datepicker("option", "dateFormat", "yy/mm/dd");
    $("#datepickerTH").datepicker("option", "dateFormat", "yy/mm/dd");
    this.livePreviewSwiper.on('slideChange', this.handleSlideChange);
  }
  componentDidUpdate() {
    const { sessionData, bets_history } = this.props.sportsbook
    if (undefined !== sessionData.sid && !this.state.loadingInitialData && void 0 !== bets_history.bets) {
      this.getBetHistory()
      this.setState({ loadingInitialData: true })
    }
    if (this.state.reloadHistory) {
      const { datepickerF, datepickerT, bet_id, status, type, period, periodType } = this.state;
      let p = { from_date: periodType ? (moment().unix() - 3600 * period) : moment(datepickerF).startOf('day').unix(), to_date: periodType ? moment().unix() : moment(datepickerT).endOf('day').unix() };
      if (null !== bet_id && bet_id.length > 0) p.bet_id = bet_id;
      if (status !== '-1') p.status = status;
      if (type !== '-1') p.type = type;
      this.getBetHistory(p);
    }
  }
  handleSlideChange() {
    this.livePreviewSwiper.allowSlideNext = false
    this.livePreviewSwiper.allowSlidePrev = false
  }
  backToMenuModal() {
    this.setState({ opened_bet: {}, activeBets: [] })
    this.livePreviewSwiper.allowSlidePrev = true
    this.livePreviewSwiper.slidePrev()
  }
  showNext() {
    this.livePreviewSwiper.allowSlideNext = true
    this.livePreviewSwiper.slideNext()
  }
  reloadHistory() {
    this.setState({ reloadHistory: !0 })
  }
  attemptCashout(bet = null) {
    this.setState(prevState => ({ showCashoutDailog: !prevState.showCashoutDailog, cashable_bet: bet }))
  }
  getBetHistory(where = null) {
    this.setState({ reloadHistory: !1 })
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { loadingHistory: true }))

    if (null !== where) {
      where = where
    } else where = {
      range: -1,
      startDate: moment(moment().unix() - 3600 * 24).format('YYYY-MM-DD'),
      endDate: moment().format('YYYY-MM-DD'),
    }
    // const userId = getCookie('id'), authToken = getCookie('AuthToken'), email = getCookie('email'), $time = moment().format('YYYY-MM-DD H:mm:ss'), hash =
    //   calcMD5(`AuthToken${authToken}uid${userId}email${email}time${$time}${this.props.appState.$publicKey}`);
    // where.email = email
    // where.hash = hash
    // where.uid = userId
    // where.time = $time
    // where.AuthToken = authToken
    $api.getUserBetHistory(where, this.betHistoryData.bind(this))
    // this.props.sendRequest(this.rids[14].request)

  }
  onDateChangeF(e) {
    e.persist()
    let val = e.target.value, mDate = moment(val), datepickerT = this.state.datepickerT ? this.state.datepickerT : moment().format('YYYY-MM-DD')
    if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(datepickerT).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerT), 'days') < 0 || mDate.diff(moment(datepickerT), 'days') > 30) {
      var incrDate = moment(val).add(1, 'days')
      if (moment(moment(incrDate).format('YYYY-MM-DD')).isAfter(moment(val).endOf('month').format('YYYY-MM-DD')))
        incrDate = moment(val).endOf('month')
      $("#datepickerTH").datepicker("setDate", new Date(incrDate.format('YYYY/MM/DD')));
      datepickerT = incrDate
    }
    $("#datepickerFH").val(moment(val).format('YYYY/MM/DD'));
    this.setState({ periodType: 0, datepickerF: val, datepickerT: datepickerT })
  }
  onDateChangeT(e) {
    e.persist()

    let val = e.target.value, mDate = moment(val), datepickerF = this.state.datepickerF ? this.state.datepickerF : moment().format('YYYY-MM-DD')
    if (moment(moment(val).format('YYYY-MM-DD')).isAfter(moment(val).format('YYYY-MM-DD')) || mDate.diff(moment(datepickerF), 'days') > 30 || mDate.diff(moment(datepickerF), 'days') < 0) {
      var decrDate = moment(val).subtract(1, 'days')
      if (moment(moment(decrDate).format('YYYY-MM-DD')).isBefore(moment(datepickerF).startOf('month').format('YYYY-MM-DD')))
        decrDate = moment(datepickerF).startOf('month')
      $("#datepickerFH").datepicker("setDate", new Date(decrDate.format('YYYY/MM/DD')));
      datepickerF = decrDate
    }
    $("#datepickerTH").val(mDate.format('YYYY/MM/DD'));
    this.setState({ periodType: 0, datepickerT: val, datepickerF: datepickerF })
  }
  searchBetHistoryResult() {
    const { datepickerF, datepickerT, bet_id, status, type, period, periodType } = this.state;
    let p = { range: -1, startDate: periodType ? (moment().unix() - 3600 * period).format('YYYY-MM-DD') : moment(datepickerF).startOf('day').format('YYYY-MM-DD'), endDate: periodType ? moment().format('YYYY-MM-DD') : moment(datepickerT).endOf('day').format('YYYY-MM-DD') };
    if (null !== bet_id && bet_id.length > 0) p.bet_id = bet_id;
    if (status !== '-1') p.status = status;
    if (type !== '-1') p.type = type;
    this.getBetHistory(p);
    this.setState({ showFilterInputs: false })
  }
  betHistoryData({ data }) {
    void 0 !== data.data && this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { bets_history: data.data, loadingHistory: false, reloadHistory: !1 }))
  }
  openSelection(id, sele) {
    let bet = { ...id }
    delete bet.events
    this.setState({ opened_bet: bet, activeBets: sele })
    this.showNext()
    $('.section-content').animate({ scrollTop: 0 }, 200);
  }
  showCashoutPanel(data) {
    data && this.setState({ openCashout: true, cashingOut: data })
  }
  setBetID(e) {
    e.persist()
    let a = e.target.value
    this.setState({ bet_id: a })
  }
  setBetType(e) {
    e.persist()
    let a = e.target.value
    this.setState({ type: a })
  }
  setstatus(e) {
    e.persist()
    let a = e.target.value
    this.setState({ status: a })
  }
  setPeriod(e) {
    e.persist()
    let a = e.target.value,
      $dates = $("#datepickerFH,#datepickerTH").datepicker();
    $dates.datepicker('setDate', null);
    this.setState({ datepickerF: null, datepickerT: null, periodType: 1, period: a })
  }
  clearDateRange(id) {
    $("#" + id).datepicker('setDate', null);
    id = id.substr(0, id.length - 1)
    var obj = { periodType: 1 }
    obj[id] = ''
    this.setState(obj)
  }
  doCashout(data, callback) {
    let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
    this.rids[ridStart] = {
      rid: ridStart, callback: (d) => { callback(d, this.reloadHistory.bind(this)) }, id: data.id, request: {
        command: "cashout",
        params: {
          bet_id: data.id,
          price: data.cash_out,
          mode: data.incaseAmountChange
        }, rid: ridStart
      }
    }
    "partial" === data.auto && (this.rids[ridStart].request.params.partial_price = data.partial_amount)
    let newRid = {}
    newRid[ridStart] = this.rids[ridStart]
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid))
    this.props.sendRequest(this.rids[ridStart].request)
  }
  getBetAutoCashout(data, callback) {

    let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
    this.rids[ridStart] = {
      rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
        command: "get_bet_auto_cashout",
        params: {
          bet_id: data.id
        }, rid: ridStart
      }
    }
    let newRid = {}
    newRid[ridStart] = this.rids[ridStart]
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid))
    this.props.sendRequest(this.rids[ridStart].request)
  }
  createAutoCashOutRule(data, callback) {
    let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
    this.rids[ridStart] = {
      rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
        command: "set_bet_auto_cashout",
        params: {
          bet_id: data.id,
          min_amount: data.valueReaches
        }, rid: ridStart
      }
    }
    "partial" === data.auto && (this.rids[ridStart].request.params.partial_amount = data.partial_amount);
    let newRid = {}
    newRid[ridStart] = this.rids[ridStart]
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid))
    this.props.sendRequest(this.rids[ridStart].request)
  }
  cancelAutoCashOutRule(data, callback) {
    let ridStart = parseInt(Object.keys(this.rids)[Object.keys(this.rids).length - 1]) + 1
    this.rids[ridStart] = {
      rid: ridStart, callback: (d) => { callback(d) }, id: data.id, request: {
        command: "cancel_bet_auto_cashout",
        params: {
          bet_id: data.id
        }, rid: ridStart
      }
    }
    let newRid = {}
    newRid[ridStart] = this.rids[ridStart]
    this.props.dispatch(allActionDucer(RIDS_PUSH, newRid))
    this.props.sendRequest(this.rids[ridStart].request)
  }
  showFilter() {
    this.setState(prevState => ({ showFilterInputs: !prevState.showFilterInputs }))
  }
  openLiveBetHistory(bet) {

  }
  render() {
    const { bets_history, loadingHistory, config } = this.props.sportsbook, { cashable_bet, status, type, bet_id, period, datepickerF, datepickerT, showCashoutDailog, showFilterInputs, activeBets, opened_bet } = this.state, { backToMenuModal, profile } = this.props
    let bets = []

    if (bets_history.bets) {
      Object.keys(bets_history.bets).forEach((key) => {
        bets.push(bets_history.bets[key])
      })
    }
    return (

      <div className="section-content col-sm-12">
        {
          showCashoutDailog &&
          <CashoutDialog onCancelRule={this.cancelAutoCashOutRule}
            onCashout={this.doCashout}
            cashable_bet={cashable_bet}
            profile={this.props.profile}
            onGetCashoutRule={this.getBetAutoCashout}
            onAttemptCashout={this.attemptCashout.bind(this)}
            onSetAutoCashout={this.createAutoCashOutRule}
            onUserInteraction={this.closeBetHistory}
            config={config} />
        }

        <div className="filter">
          <div className="header"><div onClick={() => { backToMenuModal() }} className="icon-icon-arrow-left back-btn"></div><div className="title" style={{ padding: '15px' }}> Bets History</div></div>

        </div>
        <div className="swiper-container-history col-sm-12" style={{ height: '100%' }}>
          <div className="swiper-wrapper">
            <div className="swiper-slide">
              <div className="filter">
                <div className="filter-drop-down">
                  <div className="filter-drop-down-header" onClick={this.showFilter}><span className="">Filter</span><span className={`icon-more icon-icon-arrow-down icon icon-show ${showFilterInputs ? 'icon-up' : "icon-hide"}`}></span></div>
                  <div className="filter-input-container" style={showFilterInputs ? { height: 'auto' } : { height: 0, display: 'none' }}>
                    <div className="input-container-flex">
                      <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                        <span>Bet ID</span>
                        <div className="sportsbook-input-value" style={{ padding: '0', margin: '5px' }}>
                          <div className="sportsbook-search-input static">
                            <input autoComplete="off" placeholder="#" style={{ textAlign: 'unset', height: '36px' }} className="search-input ember-text-field ember-view" value={bet_id} onChange={(e) => { this.setBetID(e) }} ref={(el) => this.partialInput = el} />
                          </div>
                        </div>
                      </div>
                      <div className="input-group" style={{ margin: '0 0 5px 0' }} style={{ marginLeft: '10px' }}>
                        <span>Bet Type</span>
                        <select name="betType" value={type} onChange={(e) => { this.setBetType(e) }}>
                          <option value="-1">All</option>
                          <option value="1">Single</option>
                          <option value="2">Multiple</option>
                          <option value="3">System</option>
                          <option value="4">Chain</option>
                        </select>
                        <i className="icon-icon-arrow-down"></i>
                      </div>
                    </div>
                    <div className="input-container-flex">
                      <div className="input-group">
                        <span>status</span>
                        <select name="date" onClick={(e) => e.stopPropagation()} value={status} onChange={(e) => { this.setstatus(e) }} >
                          <option value={-1}>All</option>
                          <option value={0}>Open</option>
                          <option value={1}>Lost</option>
                          <option value={2}>Returned</option>
                          <option value={3}>Won</option>
                          <option value={5}>Cashed out</option>
                        </select>
                        <i className="icon-icon-arrow-down"></i>
                      </div>
                      <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                        <span>Time Period</span>
                        <select name="date" value={period} onChange={(e) => { this.setPeriod(e) }} >
                          {
                            this.upcomingGamesPeriods.map((range, ind) => {
                              return (
                                <option key={ind} value={range}>{range} {range > 1 ? 'Hours' : 'Hour'}</option>
                              )
                            })
                          }
                        </select>
                        <i className="icon-icon-arrow-down"></i>
                      </div>
                    </div>
                    <div className="input-group" style={{ margin: '0 0 5px 0' }}>
                      <span>Date Range</span>
                      <div className="input-container-flex">
                        <div className="datepicker-holder">
                          <input type="text" id="datepickerFH" onChange={(e) => { this.onDateChangeF(e) }} placeholder="From" autoComplete="off" readOnly />
                          {datepickerF !== '' ? <div className="clear" onClick={() => this.clearDateRange("datepickerFH")}><span className="uci-close"></span></div> : null}
                        </div>
                        <div className="datepicker-holder">
                          <input type="text" id="datepickerTH" onChange={(e) => { this.onDateChangeT(e) }} placeholder="To" autoComplete="off" readOnly />
                          {datepickerT !== '' ? <div className="clear" onClick={() => this.clearDateRange("datepickerTH")}><span className="uci-close"></span></div> : null}
                        </div>
                      </div>
                    </div>
                    <div className="input-group" style={{ margin: '0 0 5px 5px' }}>
                      <div style={{ height: '38px' }}></div>
                      <button className="search" onClick={() => { this.searchBetHistoryResult() }}><span>Show</span></button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="data" style={{ marginTop: '0' }}>
                {
                  loadingHistory ?
                    <BetHistoryLoader />
                    :
                    bets.length ?
                      bets.map((bet, i) => {
                        var selections = [], b = { totalAmount: 0 }
                        b.totalAmount = (bet.bonus_bet_amount ? bet.bonus_bet_amount : "" + bet.amount ? bet.amount : "").toString()
                        Object.keys(bet.events).forEach((evt) => {
                          selections.push(bet.events[evt])
                        })
                        return (
                          <div key={bet.id}>
                            <div className="bet-details" onClick={() => { this.openSelection(bet, selections) }}>
                              <div className="bet-info-1">
                                <div>
                                  <div className={`type cms-jcon-${this.betType[bet.type].toLowerCase()}`}><span style={{ paddingLeft: '5px' }}>{this.betType[bet.type]}</span></div>
                                  <div className="id" onClick={() => bet.is_live && this.openLiveBetHistory(bet)} style={{ display: 'flex', alignItems: 'center' }}>{bet.id}
                                    {/* {bet.is_live &&<span className="game-is-live"></span>} */}
                                  </div>
                                </div>
                                <div>
                                  <div className={`state ${bet.status === 4 || bet.status === 5 ? 'icon-sb-success' : bet.status === 3 ? 'icon-sb-error-pu' : bet.status === 2 ? 'icon-sb-unsettled' : bet.status === 0 ? 'icon-sb-unsettled' : bet.status === 2 ? 'icon-sb-returned' : ''}`}
                                    style={{ lineHeight: bet.hasOwnProperty('cash_out') ? '2' : '' }}><span style={{ paddingLeft: '5px' }}>{this.betState[bet.status]}</span>
                                  </div>
                                  <div className="date">{moment(bet.date_time).format('ddd, D MMM YYYY')}</div>
                                </div>
                              </div>
                              <div className="bet-info-2">
                                <div>
                                  <div>Stake</div>
                                  <div>Odd</div>
                                </div>
                                <div>
                                  <div className="stake">{bet.amount}  {profile.currency}</div>
                                  <div className="odds">{bet.k}</div>
                                </div>
                              </div>
                              {(bet.status == 0 || bet.payout > 0) && <div className="bet-info-3">
                                <div>{bet.status == 0 ? <span style={{ display: 'block', lineHeight: '2' }}>Possible Win: </span> : <span style={{ display: 'block', lineHeight: '2' }}>Win: </span>}</div>
                                <div className="win"><span style={{ display: 'block', lineHeight: '1' }}>{bet.payout > 0 ? bet.payout : bet.possible_win}  {profile.currency}</span></div>
                              </div>}
                              {bet.hasOwnProperty('cash_out') && <div className="bet-info-4" onClick={(e) => { e.stopPropagation(); this.attemptCashout(bet) }}>
                                <span > Cashout</span><span className="" style={{ display: 'block', paddingLeft: '5px', width: 'auto', lineHeight: '1', marginRight: '5px' }}>{bet.cash_out} {profile.currency}</span>
                              </div>}

                            </div>
                          </div>
                        )
                      }) :
                      <div className="empty-content"><span>No records found</span></div>
                }
              </div>
            </div>
            <div className="swiper-slide">
              <div className="selections">
                <div className="header-selection" style={{ marginTop: '10px' }}><div onClick={this.backToMenuModal} className="icon-icon-arrow-left back-btn"></div><div className="title" style={{ padding: '15px', fontSize: '13px' }}>{this.betType[opened_bet.type]} / {moment(opened_bet.date_time).format('ddd, D MMM YYYY')}</div></div>
                {
                  opened_bet.hasOwnProperty('id') && <div className="details">
                    <div className="bet-details">
                      <div className="bet-info-1">
                        <div>
                          <div className="id">ID: {opened_bet.id}</div>
                        </div>
                      </div>
                      <div className="bet-info-2">
                        <div>
                          <div>Stake</div>
                          <div>Odd</div>
                        </div>
                        <div>
                          <div className="stake">{opened_bet.amount}  {profile.currency}</div>
                          <div className="odds">{opened_bet.k}</div>
                        </div>
                      </div>
                      {(opened_bet.status == 0 || opened_bet.payout > 0) && <div className="bet-info-3">
                        <div>{opened_bet.status == 0 ? <span style={{ display: 'block', lineHeight: '2' }}>Possible Win: </span> : <span style={{ display: 'block', lineHeight: '2' }}>Win: </span>}</div>
                        <div className="win"><span style={{ display: 'block', lineHeight: '1' }}>{opened_bet.payout > 0 ? opened_bet.payout : opened_bet.possible_win}  {profile.currency}</span></div>
                      </div>}
                      {opened_bet.hasOwnProperty('cash_out') && <div className="bet-info-4" onClick={(e) => { e.stopPropagation(); this.attemptCashout(opened_bet) }}>
                        <span > Cashout</span><span className="" style={{ display: 'block', paddingLeft: '5px', width: 'auto', lineHeight: '1', marginRight: '5px' }}>{opened_bet.cash_out} {profile.currency}</span>
                      </div>}
                    </div>
                    <div style={{ padding: '10px', fontSize: '12px', fontWeight: 600, }}>Selections</div>
                    {activeBets.map((event, id) => {
                      return (
                        <div key={id}>
                          <div className="bet-details">
                            <div className="bet-info-1">
                              <div>
                                <div className={``}>{event.MatchName}</div>
                                <div className={``} >{event.MatchInfo}</div>
                                <div className={`match sport-avatar ${event.SportName}`} ><span></span>{event.CompetitionName}</div>
                              </div>
                              <div>
                                <div className={`status ${event.Status === 4 || event.Status === 5 ? 'icon-sb-checkmark2' : event.Status === 3 ? 'icon-sb-close_mark' : event.Status === 0 ? 'icon-sb-unsettled' : event.Status === 2 ? 'icon-sb-returned' : ''}`}></div>
                                <div></div>
                                <div className="date">{moment(event.MatchStartDate).format('ddd, D MMM YYYY H:mm')}</div>
                              </div>

                            </div>
                            <div className="bet-info-2">
                              <div>
                                <div>{event.MarketName}</div>
                                <div>Pick: {event.SelectionName}</div>
                              </div>
                              <div>
                                <div className="stake"></div>
                                <div className="odds">Odd: {event.Price}</div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )
                    })}
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}