import React from 'react'
import { BetSlipNotification, OddsType, OddsSettings } from '../stateless'
import { oddConvert, dataStorage, betModeChange, getCookie, makeToast, clearToast } from '../../common'
import { SPORTSBOOK_ANY, MODAL, RIDS_PUSH } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import { Transition } from 'react-spring/renderprops'
import moment from "moment-timezone";
import { calcMD5 } from "../../utils/jsmd5";
import API from "../../services/api";
import { NewAPI } from '../../services/api'
import { BetVirtualKeyboard } from '../sportsbook-virtual-keyboard'
const $api = NewAPI.getInstance();
export default class Controls extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      config: this.props.sportsbook.config,
      showFirsttime: true,
      showMatchDetails: false,
      details: {},
      matchInfoRef: null
    }
    this.swarmErrors = {
      '-1': 'Fialed',
      0: 'No error',
      1: 'Bad Request',
      2: 'Invalid Command',
      3: 'Service Unavailable',
      4: 'Request Timeout',
      5: 'No Session',
      6: 'Subscription not found',
      7: 'Not subscribed',
      10: 'Invalid Level',
      11: 'Invalid Field',
      12: 'Invalid Credentials',
      20: 'Not enough balance for operation',
      21: 'Operation not allowed',
      22: 'Limit reached',
      23: 'Service temporary is down',
      99: 'Unknown Error',
      1000: 'Internal Error',
      1001: 'User not found',
      1002: 'Wrong Login/Password',
      1003: 'User blocked',
      1004: 'User dismissed',
      1005: 'Incorrect old password',
      1008: 'Logging in the page is not possible, since user is not activated or verified',
      1009: 'Such a verification code does not exist',
      1012: 'Incorrect phone number',
      1013: 'Password is too short',
      1014: 'Failed to send verification SMS',
      1023: 'User is not verified via email',
      1099: 'Fork exception',
      1100: 'Game is already started',
      1102: 'Game start time is already past',
      1103: 'Bet editing time is already past',
      1104: 'Bet is payed',
      1105: 'Bet status not fixed',
      1106: 'Bet lose',
      1107: 'Bet is online',
      1108: 'Wrong value for coefficient',
      1109: 'Wrong value for amount (in case of system bet - amount is less than minimum allowed)',
      1021: 'Pass should contain at least 8 chars: upper and lowercase English letters, at least one digit and no space',
      1112: 'Request is already paid!',
      1113: 'Request is already stored!',
      1117: 'Wrong login or E-mail',
      1118: 'Duplicate Login',
      1119: 'Duplicate EMail',
      1120: 'Duplicate nickname',
      1122: 'Duplicate personal Id',
      1123: 'Duplicate doc number',
      1124: 'Amount is not in valid range',
      1125: 'Bet type error',
      1126: 'Bet declined by SKKS',
      1127: 'Duplicate phone number',
      1150: 'You yet are not allowed to bet on the given event yet',
      1151: 'Duplicate Facebook ID',
      1170: 'Card lot blocked',
      1171: 'Scratch card already activated',
      1172: 'Scratch card blocked',
      1174: 'Wrong scratch card currency (not supported for user currency)',
      1200: 'Wrong value exception',
      1273: 'Wrong scratch card number',
      1300: 'Double value exception',
      1400: 'Double event exception',
      1500: 'Limit exception',
      1550: 'The sum exceeds maximum allowable limit',
      1560: 'The sum is less than minimum allowable limit',
      1600: 'There is going the correction of coefficient.',
      1700: 'Wrong access exception',
      1800: 'Odds changed from %p to %c',
      1900: 'The events can be included only in the express',
      2000: 'Odds restriction exception',
      2003: 'Bet state error',
      2005: 'Cashdesk not found',
      2006: 'Cashdesk not registered',
      2007: 'Currency mismatch',
      2008: 'Client excluded',
      2009: 'Client locked',
      2018: 'Email should not be an empty',
      2020: 'First name should not be an empty',
      2024: 'Invalid email',
      2033: 'Market suspended',
      2036: 'Game suspended',
      2048: 'Wrong region',
      2051: 'Partner api access not activated',
      2052: 'Partner api Client Balance Error',
      2053: 'Partner api client limit error',
      2054: 'Partner api empty method',
      2055: 'Partner api empty request body',
      2056: 'Partner api max allowable limit',
      2057: 'Partner api min allowable limit',
      2058: 'Partner api PassToken error',
      2059: 'Partner api timestamp expired',
      2060: 'Partner api token expired',
      2061: 'Partner api user blocked',
      2062: 'Partner api wrong hash',
      2063: 'Partner api wrong login email',
      2064: 'Partner api wrong access',
      2065: 'Partner not found',
      2066: 'Partner commercial fee not found',
      2072: 'Reset code expired',
      2074: 'Same password and login',
      2075: 'Selection not found',
      2076: 'Selection count mismatch',
      2077: 'Event suspended',
      2078: 'Sport mismatch',
      2080: 'Sport not supported for the partner',
      2091: 'Password expired',
      2093: 'Username already exist',
      2098: 'Wrong currency code',
      2100: 'Payment restriction exception',
      2200: 'Client limit exception',
      2302: 'Terminal balance exception',
      2400: 'Insufficient balance',
      2403: 'Pending withdrawal requests',
      2404: 'Cash out not allowed',
      2405: 'Bonus not found',
      2406: 'Partner bonus not found',
      2407: 'Client has active bonus',
      2408: 'Invalid client verification step',
      2409: 'Partner setting not allow this type of self exclusion',
      2410: 'Invalid self exclusion type',
      2411: 'Invalid client limit type',
      2412: 'Invalid client bonus',
      2413: 'Client restricted for action',
      2414: 'Selection singles only',
      2415: 'Partner not supported test client',
      2416: 'Partner not using loyalty program',
      2417: 'Point exchange range exceed',
      2418: 'Client not using loyalty program',
      2419: 'Partner limit amount exceed',
      2420: 'Client has accepted bonus',
      2421: 'Partner api error',
      2422: 'Team not found',
      2423: 'Invalid client verification step state',
      2424: 'Partner sports book currency setting',
      2425: 'Client bet min stake limit error',
      2426: 'Max deposit request sum',
      2427: 'Email wrong hash',
      2428: 'Client already self excluded',
      2429: 'Transaction amount exceeds frozen money',
      2430: 'Wrong hash',
      2431: 'Partner Mismatch',
      2432: 'Match Not Visible',
      2433: 'Loyalty Level Not Found',
      2434: 'Max withdrawal amount',
      2436: 'Selection suspended before start time',
      2437: 'Bonus not allowed for super bet',
      3000: 'Too many invalid login attempts',
      3001: 'Currency not supported',
      3015: 'Negative amount',
      3019: 'Bet selections cannot be chained together',
      50000: 'Failed to place bet, please try again later'
    }
    this.sys_bet = []
    this.sys_bet_result = { win: 0, options: 0 }
    this.rids = this.props.sportsbook.rids
    this.placeBet = this.placeBet.bind(this)
    this.bookBet = this.bookBet.bind(this)
    this.onOddsTypeChange = this.onOddsTypeChange.bind(this)
    this.setSingleBetStake = this.setSingleBetStake.bind(this)
    this.setBetStake = this.setBetStake.bind(this)
    this.onFocus = this.onFocus.bind(this)
    this.onFocusLost = this.onFocusLost.bind(this)
    this.onClear = this.onClear.bind(this)
    this.onClearSingle = this.onClearSingle.bind(this)
    this.onOddsSettingsChange = this.onOddsSettingsChange.bind(this)
    this.betslipToggleView = this.betslipToggleView.bind(this)
    this.openBetslipSettings = this.openBetslipSettings.bind(this)
    this.hideNoty = this.hideNoty.bind(this)
    this.showMatchDetails = this.showMatchDetails.bind(this)
    this.hideMatchDetails = this.hideMatchDetails.bind(this)
    this.betslipbody = null
    this.searchTicketInput = null
    this.recaptchaValue = null
    this.recaptch_value = null
    this.retrieveBookingInput = null
    this.notifyTimeout = null
    this.isLowBalanceTimeout = null
  }
  componentDidMount() {
    const { betSelections,
      betMode,
      sys_bet_variant } = this.props.sportsbook
    if (Object.keys(betSelections).length === 1 && betMode !== 1)
      this.changeBetMode(1, true)
    if (Object.keys(betSelections).length > 1 && Object.keys(betSelections).length < 3 && betMode === 3)
      this.changeBetMode(2, true)
    if (Object.keys(betSelections).length > 16 && betMode === 3)
      this.changeBetMode(2, true)
    if (null === sys_bet_variant && this.sys_bet.length > 0) {
      if (JSON.stringify(sys_bet_variant) !== JSON.stringify(this.sys_bet[0]))
        this.setSysBetVariant(this.sys_bet[0], true)
    }

  }
  componentWillUnmount() {
    clearTimeout(this.notifyTimeout)
    clearTimeout(this.isLowBalanceTimeout)
    clearTimeout(this.animationTimeout)
    clearTimeout(this.minBetStakesTimeout)
    clearTimeout(this.maxOddForMultiBetTimeout)
    clearTimeout(this.maxSelectionForMultiBetTimeout)
    this.setState({
      isBetSlipOpen: false,
      showMatchDetails: false,
    })
  }
  componentDidUpdate() {
    const { betSelections,
      betMode, showBetSlipNoty, isOddChange, lowBalance,
      sys_bet_variant } = this.props.sportsbook
    if (Object.keys(betSelections).length === 1 && betMode !== 1)
      this.changeBetMode(1, true)
    if (Object.keys(betSelections).length > 1 && Object.keys(betSelections).length < 3 && betMode === 3)
      this.changeBetMode(2, true)
    if (Object.keys(betSelections).length > 16 && betMode === 3)
      this.changeBetMode(2, true)
    if (null === sys_bet_variant && this.sys_bet.length > 0) {
      if (JSON.stringify(sys_bet_variant) !== JSON.stringify(this.sys_bet[0]))
        this.setSysBetVariant(this.sys_bet[0], true)
    }
    if (showBetSlipNoty && !lowBalance && !isOddChange && !this.notifyTimeout) {
      this.notifyTimeout = setTimeout(() => { this.notifyTimeout = null; this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: false, betSlipNotyMsg: '', betSlipNotyType: '' })) }, 5000)
    }
  }
  showMatchDetails(e, d) {
    let viewportOffset = document.getElementById(e.target.id).getBoundingClientRect(), top = viewportOffset.top, left = (viewportOffset.left - viewportOffset.right) + 75;
    this.setState({ matchInfoRef: e, showMatchDetails: true, details: { match: d, top: top, left: left } })
  }
  hideMatchDetails() {
    this.setState({ matchInfoRef: null, showMatchDetails: false, details: {} })
  }
  isLowBalance() {
    clearTimeout(this.isLowBalanceTimeout)
    this.isLowBalanceTimeout = setTimeout(() => { this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { lowBalance: false })) }, 5000)
  }
  hideNoty() {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: false, betSlipNotyMsg: '', betSlipNotyType: '' }))
    clearTimeout(this.notifyTimeout)
    this.notifyTimeout = null
  }
  onFocus(e) {
    let el = document.querySelector(`#${e.target.id}`).closest(".keyboard-close")
    el.classList.add('open-keyboard-style')
  }
  onFocusLost(e) {
    let el = document.querySelector(`#${e.target.id}`).closest(".keyboard-close")
    el.classList.remove('open-keyboard-style')
  }
  validate() {
    if (this.searchTicketInput && this.recaptchaValue) {
      this.setState({ searchingTicket: true })
      let val = this.searchTicketInput.value, rval = this.recaptchaValue.value
      if (val !== '' && rval !== '') {
        this.props.validate(val, rval, this.showCheckResult.bind(this))
        this.searchTicketInput.value = ''
        this.recaptchaValue.value = ''
      }
    }
  }

  closeBookingResult() {
    if (this.retrieveBookingInput) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { retrieveBooking: null, retrieveBookingLoading: false }))
    }
  }
  showCheckResult(data) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { checkResult: data.data.details ? data.data.details : { StateName: 'Ticket number not found' }, searchingTicket: false }))
    window.grecaptcha.reset()
  }
  checkBookingResult(data) {
    if (data.details.state === null) {
      this.changeBetMode({ target: { value: data.details.betType } })
      this.changeBetSlipMode(1)
    }
    this.retrieveBookingInput.value = ''
    data.details ? this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { retrieveBooking: data.details, retrieveBookingLoading: false })) : this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { retrieveBookingLoading: false }))
  }
  changeBetMode(event, manual = false) {
    let betSelections = { ...this.props.sportsbook.betSelections }, { isLoggedIn } = this.props.appState
    if (Object.keys(betSelections).length > 0) {
      Object.keys(betSelections).forEach((betsele) => {
        if (betSelections[betsele].hasOwnProperty('booking_id'))
          delete betSelections[betsele].booking_id
      })
      dataStorage('betSlip', betSelections)
    }
    dataStorage('bookingNumber', null)
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { betMode: manual ? event : parseInt(event.target.value), betStake: 0, bookingNumber: null, enableFreebet: false }))
    this.props.sportsbook.sessionData.sid !== undefined && isLoggedIn && this.props.getBetslipFreebets()
    betModeChange('betStake')
  }
  changeBetSlipMode(mode) {
    if (mode !== this.props.sportsbook.betSlipMode) {
      let { isLoggedIn } = this.props.appState
      this.props.sportsbook.sessionData.sid !== undefined && isLoggedIn && this.props.getBetslipFreebets()
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { betSlipMode: parseInt(mode), enableFreebet: false }))
    }
  }
  openBetslipSettings() {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetslipSettings: !this.props.sportsbook.showBetslipSettings, animation: true, showTicketBetSearch: false }))
    if (this.animationTimeout)
      clearTimeout(this.animationTimeout)
    this.animationTimeout = setTimeout(() => {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { animation: false }))
    }, 1000)
  }
  useQuickBet(e) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { isQuickBet: e.target.checked }))
  }
  useFreeBet(e) {
    let params = { enableFreebet: e.target.checked }
    // if(!e.target.checked) params.freeBetStake= null
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, params))
  }
  setFreeBetStake(e) {
    let { freeBetStake, freeBets } = this.props.sportsbook, stake = e.target.value
    if (freeBets[parseInt(stake)].id !== freeBetStake.id)
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { freeBetStake: freeBets[parseInt(stake)] }))
  }
  setSingleBetStake(gameId, event) {
    const { betSelections, lowBalance, betSlipMode } = this.props.sportsbook
    const stake = parseFloat(`${event.target.value}`)
    if (stake > 0) {
      if (betSelections[gameId]) {
        betSelections[gameId].singleStake = stake
        betSelections[gameId].singlePosWin = stake * betSelections[gameId].price
      }
    } else {
      if (betSelections[gameId]) {
        betSelections[gameId].singleStake = ""
        betSelections[gameId].singlePosWin = 0

      }

    }
    const profile = this.props.profile
    let state = { betSelections: betSelections, betStake: isNaN(stake) ? 0 : stake }
    if (betSlipMode !== 1) {
      let isLowBalance = (profile.Balance === '0.00' && parseFloat(profile.Balance).toFixed(2) < stake) || (parseFloat(profile.bonus) > 0 && parseFloat(profile.games.split(',').includes('1') ? profile.bonus : '0').toFixed(2) < stake) ? true : false
      if (isLowBalance && !lowBalance && this.props.appState.isLoggedIn) {
        state.showBetSlipNoty = isLowBalance
        state.lowBalance = isLowBalance
        state.betSlipNotyMsg = profile.Balance === '0.00' ? <p className="lowbalance"><span trans="">Insufficient balance</span>  <a className="underline" onClick={this.deposit.bind(this)} trans="">Deposit</a> </p> : <p className="lowbalance"><span trans="">Insufficient bonus balance, consume bonus in order to use main balance</span> </p>
        state.betSlipNotyType = 'warning'
        this.isLowBalance()
      }
      else {
        clearTimeout(this.notifyTimeout)
      }
    }

    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, state))
    dataStorage('betSlip', betSelections)
    dataStorage('betStake', isNaN(stake) ? 0 : stake)
  }
  onClearSingle(gameId) {
    const { betSelections, lowBalance, betSlipMode, betStake } = this.props.sportsbook
    if (betSelections[gameId]) {
      let oldStake = betSelections[gameId].singleStake, stake = isNaN(oldStake) ? 0 : oldStake, stakeString = stake.toString()
      stakeString = stakeString.substr(0, stakeString.length - 1)
      if (stakeString !== '') {
        stake = parseFloat(stakeString)
      }
      if (stake > 0) {
        betSelections[gameId].singleStake = stake
        betSelections[gameId].singlePosWin = stake * betSelections[gameId].price
      } else {
        betSelections[gameId].singleStake = ""
        betSelections[gameId].singlePosWin = 0

      }
      const profile = this.props.profile
      let state = { betSelections: betSelections, betStake: isNaN(stake) ? 0 : stake }
      if (betSlipMode !== 1) {
        let isLowBalance = (profile.bonus === '0.00' && parseFloat(profile.Balance).toFixed(2) < stake) || (parseFloat(profile.bonus) > 0 && parseFloat(profile.games.split(',').includes('1') ? profile.bonus : '0').toFixed(2) < stake) ? true : false
        if (isLowBalance && !lowBalance) {
          state.showBetSlipNoty = isLowBalance
          state.lowBalance = isLowBalance
          state.betSlipNotyMsg = profile.bonus === '0.00' ? <p className="lowbalance"><span trans="">Insufficient balance</span>  <a className="underline" onClick={this.deposit.bind(this)} trans="">Deposit</a> </p> : <p className="lowbalance"><span trans="">Insufficient bonus balance, consume bonus in order to use main balance</span> </p>
          state.betSlipNotyType = 'warning'
          this.isLowBalance()
        }
        else {
          clearTimeout(this.notifyTimeout)
        }
      }

      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, state))
      dataStorage('betSlip', betSelections)
      dataStorage('betStake', isNaN(stake) ? 0 : stake)
    }
  }
  setSysBetVariant(event, manual = false) {
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { sys_bet_variant: manual ? event : JSON.parse(event.target.value) }))
  }
  checkForSelectionErrors(betSelections) {
    return Object.entries(betSelections).filter(function (value, index, arr) {
      return value[1].conflicts.length > 0 || (value[1].initialPrice != null && value[1].price !== value[1].initialPrice) || (value[1].suspended !== void 0 && value[1].suspended == 1)
    })
  }
  handleBetResponse({ data, status }) {
    if (status === 200) {
      this.betSuccess(data)
      makeToast("Bet created successfully", 6000)
    }
    else { this.betFailed(data && data.data.details ? data.data.details.hasOwnProperty('api_code') ? data.data.details.api_code : data.data.result ? data.data.result : 50000 : 50000) }
  }
  betSuccess(data) {
    let rid = data.rid;
    data = data.data
    const { selectionSub, betSlipMode } = this.props.sportsbook, dispatch = this.props.dispatch
    if (betSlipMode === 2) {
      dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: true, betSlipNotyType: 'success', betSlipNotyMsg: 'Your bet is accepted', betPlaced: true, betInprogress: false }))
      clearTimeout(this.betPlacedTimeout)
      this.betPlacedTimeout = setTimeout(() => {
        dispatch(allActionDucer(SPORTSBOOK_ANY, { betPlaced: false }));
        this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { betSelections: {}, betMode: 1, betStake: 0 }))
        dataStorage('betSlip', {}, 2)
        selectionSub && this.props.unsubscribe(selectionSub) && dispatch(allActionDucer(SPORTSBOOK_ANY, { selectionSub: null }))
      }, 5000);
      // const userId = getCookie('id'), authToken = getCookie('AuthToken'),email = getCookie('email'),$time = moment().format('YYYY-MM-DD H:mm:ss'),hash=
      // calcMD5(`AuthToken${authToken}uid${userId}email${email}time${$time}${this.props.appState.$publicKey}`);
      // $api.getBalance({uid:userId,AuthToken:authToken,email:email,time:$time,hash:hash},this.afterBalance.bind(this))
    } else {
      dispatch(allActionDucer(SPORTSBOOK_ANY, { betInprogress: false }))
      // this.showBookingID(data,rid)
    }
  }
  betFailed(code, extra = null) {
    let stateData = { showBetSlipNoty: true, betFailed: true, betSlipNotyMsg: this.swarmErrors[code], betInprogress: false }, dispatch = this.props.dispatch
    switch (code) {
      case 1800:
        stateData.isOddChange = true;
        if (extra) stateData.betSlipNotyMsg = stateData.betSlipNotyMsg.replace('%p', extra.old).replace('%c', extra.new)
        break;

      default:
        break;
    }
    dispatch(allActionDucer(SPORTSBOOK_ANY, { ...stateData, betSlipNotyType: stateData.isOddChange ? 'warning' : 'error' }))

    if (!stateData.isOddChange) {
      clearTimeout(this.betFailedTimeout)
      this.betFailedTimeout = setTimeout(() => {
        dispatch(allActionDucer(SPORTSBOOK_ANY, { betFailed: false }));
      }, 5000);
    }

  }
  placeBet() {

    let selectionArr = [], { betSelections, enableFreebet, freeBetStake, betMode, acceptMode, config, betStake, sys_bet_variant, oddType } = this.props.sportsbook, totalOdd = this.calculateTotalOdds(betSelections), dispatch = this.props.dispatch
    console.log(betStake, "beti");
    if (Object.keys(betSelections).length > 0) {
      dispatch(allActionDucer(SPORTSBOOK_ANY, { betInprogress: true, betSuccess: false, betFailed: false, isOddChange: false }))
      Object.keys(betSelections).forEach((selected) => {
        let eventDetails = {}
        eventDetails["SelectionId"] = betSelections[selected].eventId;
        eventDetails["SelectionName"] = betSelections[selected].pick;
        eventDetails["MarketTypeId"] = betSelections[selected].marketId;
        eventDetails["MarketName"] = betSelections[selected].marketName;
        eventDetails["MatchId"] = betSelections[selected].gamePointer.game;
        eventDetails["MatchName"] = betSelections[selected].title;
        eventDetails["RegionId"] = betSelections[selected].gamePointer.regionId;
        eventDetails["RegionName"] = betSelections[selected].gamePointer.region;
        eventDetails["CompetitionId"] = betSelections[selected].gamePointer.competition;
        eventDetails["CompetitionName"] = betSelections[selected].gamePointer.competitionName;
        eventDetails["SportId"] = betSelections[selected].gamePointer.sport;
        eventDetails["SportName"] = betSelections[selected].gamePointer.sport_name;
        eventDetails["SportFullName"] = betSelections[selected].gamePointer.alias;
        eventDetails["Price"] = betSelections[selected].price;
        eventDetails["IsLive"] = betSelections[selected].gamePointer.isLive ? betSelections[selected].gamePointer.isLive : 0;
        eventDetails["Basis"] = betSelections[selected].eventBases || 0.00;
        eventDetails["MatchInfo"] = betSelections[selected].info || "";
        eventDetails["singleStake"] = betSelections[selected].singleStake || '';
        // eventDetails["IsOutright"]=$v["IsOutright"];

        eventDetails['MatchStartDate'] = moment.unix(betSelections[selected].start_ts).format('YYYY-MM-DD H:mm:ss');
        eventDetails['EventEndDate'] = moment.unix(betSelections[selected].start_ts).add(parseInt(betSelections[selected].match_length) + 20, "minutes").format('YYYY-MM-DD H:mm:ss');
        // selectionArr.push({ SelectionId: betSelections[selected].eventId,SelectionName: betSelections[selected].title, Price: betSelections[selected].price })
        // for manual betting to api
        selectionArr.push(eventDetails)
      })
      const errors = this.checkForSelectionErrors(betSelections)
      if (errors.length) {
        const firstError = errors[0][1]; let code, extra;
        if (firstError.suspended)
          code = 2036
        else if (firstError.conflicts.length)
          code = 3019
        else {
          code = 1800
          extra = { old: firstError.initialPrice, new: firstError.price }
        }
        if (acceptMode == 2 && code == 1800) { }
        else {
          this.betFailed(code, extra)
          return
        }

      }
      if (selectionArr.length) {
        const userId = getCookie('id'), authToken = getCookie('AuthToken'), email = getCookie('email'), $time = moment().format('YYYY-MM-DD H:mm:ss'), hash =
          calcMD5(`AuthToken${authToken}Amount${Number.parseFloat(betStake).toFixed(2)}BetType${betMode}TotalPrice${totalOdd.toFixed(3)}Uid${userId}Email${email}${this.props.appState.$betKey}`);
        let params = {
          command: "do_bet",
          // Hash: hash,
          // AuthToken: authToken,
          // Created: $time,
          // Uid: userId,
          // Email: email,
          BetType: betMode,
          AcceptMode: acceptMode,
          Source: 4,
          TotalPrice: totalOdd.toFixed(3),
          Amount: Number.parseFloat(betStake).toFixed(2),
          rid: 12
        }
        if (selectionArr.length > 1 && betMode === 1) {
          selectionArr.map((sele) => {
            if (sele.singleStake >= config.min_bet_stakes[config.currency] || enableFreebet) {
              params.Amount = enableFreebet ? freeBetStake.amount : sele.singleStake.toFixed(2);
              params.Selections = [sele]
              params.TotalPrice = sele.Price.toFixed(2)
              // params.Hash = calcMD5(`AuthToken${authToken}Amount${sele.singleStake.toFixed(2)}BetType${betMode}TotalPrice${sele.Price.toFixed(3)}Uid${userId}Email${email}${this.props.appState.$betKey}`);

              if (enableFreebet) { params.bonus_id = freeBetStake.id; params.wallet_type = 2 }
              this.rids[12].request = params
              $api.doBet(params, this.handleBetResponse.bind(this))
              // this.props.sendRequest(this.rids[12].request)
            }
            else {
              dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: true, betSlipNotyType: 'warning', betSlipNotyMsg: 'Bet Amount is less than minimum ' + config.min_bet_stakes[config.currency], betInprogress: false }))

              clearTimeout(this.minBetStakesTimeout)
              this.minBetStakesTimeout = setTimeout(() => {
                dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: false }));
              }, 5000);
            }
            return true
          })
          return
        }

        params.Amount = Number.parseFloat(betStake).toFixed(2);
        params.Selections = selectionArr
        if (enableFreebet) { params.Amount = freeBetStake.amount; params.bonus_id = freeBetStake.id; params.wallet_type = 2 }
        if (betMode === 3) {
          params.SystemMinCount = sys_bet_variant.variant
          params.Amount = Number.parseFloat((Number.parseFloat(betStake) * sys_bet_variant.bets).toFixed(2)).toFixed(2)
        }
        this.rids[12].request = params
        if ((betMode === 2 && totalOdd > config.max_odd_for_multiple_bet) || selectionArr.length > config.max_selections_in_multiple_bet) {
          if (totalOdd > config.max_odd_for_multiple_bet) {
            dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: true, betSlipNotyType: 'warning', betSlipNotyMsg: 'Maximun odds for bet multiple bet (' + config.max_odd_for_multiple_bet + ') reached ', betInprogress: false }))

            clearTimeout(this.maxOddForMultiBetTimeout)
            this.maxOddForMultiBetTimeout = setTimeout(() => {
              dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: false }));
            }, 5000);
          }
          if (selectionArr.length > config.max_selections_in_multiple_bet) {
            dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: true, betSlipNotyType: 'warning', betSlipNotyMsg: 'Maximum selection for Multiple bet is ' + config.max_selections_in_multiple_bet, betInprogress: false }))

            clearTimeout(this.maxSelectionForMultiBetTimeout)
            this.maxSelectionForMultiBetTimeout = setTimeout(() => {
              dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: false }));
            }, 5000);

          }
          return
        }
        // if (enableFreebet || betStake >= config.min_bet_stakes[config.currency]) this.props.sendRequest(params)
        if (enableFreebet || betStake >= config.min_bet_stakes[config.currency]) $api.doBet(params, this.handleBetResponse.bind(this))
        else {
          dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: true, betSlipNotyType: 'warning', betSlipNotyMsg: 'Bet Amount is less than minimum ' + config.min_bet_stakes[config.currency], betInprogress: false }))

          clearTimeout(this.minBetStakesTimeout)
          this.minBetStakesTimeout = setTimeout(() => {
            dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetSlipNoty: false }));
          }, 5000);
        }
      }
    }
  }
  bookBet() {
    let selectionArr = [], { betSelections, betMode, betStake, sys_bet_variant } = this.props.sportsbook
    if (Object.keys(betSelections).length > 0) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { betInprogress: true }))
      Object.keys(betSelections).forEach((selected) => {
        selectionArr.push({ event_id: betSelections[selected].eventId, price: betSelections[selected].price, marketId: betSelections[selected].marketId })
      })
      if (selectionArr.length) {
        let params = {
          command: "book_bet",
          params: {
            type: betMode,
            source: "1",
            amount: betStake,
          }, rid: 12
        }
        if (selectionArr.length > 1 && betMode === 1) {
          selectionArr.map((sele) => {
            params.params.bets = [sele]
            params.rid = sele.marketId
            let newRid = {};
            newRid[sele.marketId] = { rid: sele.marketId, callback: this.props.handleBetResponse, request: params }
            this.props.dispatch(allActionDucer(RIDS_PUSH, newRid));
            return this.props.sendRequest(newRid[sele.marketId].request)
          })
          return true
        }
        params.params.bets = selectionArr
        this.rids[12].request = params
        if (betMode === 3) {
          params.params.sys_bet = sys_bet_variant.variant
          params.params.amount = Number.parseFloat(betStake * sys_bet_variant.bets).toFixed(2)
        }

        this.props.sendRequest(params)
      }
    }
  }
  setBetStake(event) {
    const stake = Number(event.target.value).toFixed(2), { isQuickBet, betMode, betSlipMode, betSelections, sys_bet_variant, lowBalance } = this.props.sportsbook, profile = this.props.profile;
    let stateData = {}
    if (isQuickBet) {
      if (stake > 0) { stateData.quickBetStake = stake } else stateData.quickBetStake = 0
    } else {
      let betSelectionsCopy = { ...betSelections }
      if (stake > 0) {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            let stateb = parseFloat(Number.parseFloat(stake).toFixed(2))
            betSelectionsCopy[key].singleStake = stateb
            betSelectionsCopy[key].singlePosWin = stateb * betSelectionsCopy[key].price
          })

        } else stateData.betStake = stake
      } else {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            betSelectionsCopy[key].singleStake = ""
            betSelectionsCopy[key].singlePosWin = 0
          })
          stateData.betStake = ""
        } else stateData.betStake = ""

      }
      stateData.betSelections = betSelectionsCopy
      dataStorage('betSlip', betSelectionsCopy)
      dataStorage('betStake', Number.isNaN(stake) ? "" : stake)
    }
    if (betSlipMode !== 1) {
      let moni = profile.bonus === '0.00' ? profile.Balance : profile.games.split(',').includes('1') ? profile.bonus : profile.Balance
      stateData.lowBalance = betMode === 3 ? parseFloat(parseFloat(parseFloat(stake).toPrecision()) * parseFloat(parseFloat(sys_bet_variant.bets).toPrecision(12)) || 0) > parseFloat(parseFloat(moni).toPrecision()) ? true : false : parseFloat(parseFloat(moni).toPrecision(12)) < parseFloat(parseFloat(stake).toPrecision()) ? true : false
      if (stateData.lowBalance && !lowBalance && this.props.appState.isLoggedIn) {
        stateData.showBetSlipNoty = true
        stateData.betSlipNotyMsg = profile.bonus === '0.00' ? <p className="lowbalance"><span trans="">Insufficient balance</span>  <a className="underline" onClick={this.deposit.bind(this)} trans="">Deposit</a> </p> : <p className="lowbalance"><span trans="">Insufficient bonus balance, consume bonus in order to use main balance</span> </p>
        stateData.betSlipNotyType = 'warning'
        this.isLowBalance()
      } else {
        clearTimeout(this.notifyTimeout)
      }
    }
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, stateData))
  }
  onClear() {
    const { isQuickBet, betMode, betSlipMode, betSelections, sys_bet_variant, lowBalance, betStake } = this.props.sportsbook, profile = this.props.profile;
    let stateData = {}, oldStake = betStake, stake = isNaN(oldStake) ? 0 : oldStake, stakeString = stake.toString()
    stakeString = stakeString.substr(0, stakeString.length - 1)
    if (stakeString !== '') {
      stake = parseFloat(stakeString)
    }
    if (isQuickBet) {
      if (stake > 0) { stateData.quickBetStake = stake } else stateData.quickBetStake = 0
    } else {
      let betSelectionsCopy = { ...betSelections }
      if (stake > 0) {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            let stateb = parseFloat(Number.parseFloat(stake).toFixed(2))
            betSelectionsCopy[key].singleStake = stateb
            betSelectionsCopy[key].singlePosWin = stateb * betSelectionsCopy[key].price
          })

        } else stateData.betStake = stake
      } else {
        if (betMode === 1) {
          Object.keys(betSelectionsCopy).forEach((key, index) => {
            betSelectionsCopy[key].singleStake = ""
            betSelectionsCopy[key].singlePosWin = 0
          })

        } else stateData.betStake = ""

      }
      stateData.betSelections = betSelectionsCopy
      dataStorage('betSlip', betSelectionsCopy)
      dataStorage('betStake', Number.isNaN(stake) ? "" : stake)
    }
    if (betSlipMode !== 1) {
      let moni = profile.bonus === '0.00' ? profile.Balance : profile.games.split(',').includes('1') ? profile.bonus : profile.Balance
      stateData.lowBalance = betMode === 3 ? parseFloat(parseFloat(parseFloat(stake).toPrecision()) * parseFloat(parseFloat(sys_bet_variant.bets).toPrecision(12)) || 0) > parseFloat(parseFloat(moni).toPrecision()) ? true : false : parseFloat(parseFloat(moni).toPrecision(12)) < parseFloat(parseFloat(stake).toPrecision()) ? true : false
      if (stateData.lowBalance && !lowBalance) {
        stateData.showBetSlipNoty = true
        stateData.betSlipNotyMsg = profile.bonus === '0.00' ? <p className="lowbalance"><span trans="">Insufficient balance</span>  <a className="underline" onClick={this.deposit.bind(this)} trans="">Deposit</a> </p> : <p className="lowbalance"><span trans="">Insufficient bonus balance, consume bonus in order to use main balance</span> </p>
        stateData.betSlipNotyType = 'warning'
        this.isLowBalance()
      } else {
        clearTimeout(this.notifyTimeout)
      }
    }
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, stateData))
  }
  deposit() {
    this.props.dispatch(allActionDucer(MODAL, { modalOpen: true, type: 3, tabType: 1 }))
  }
  mathCuttingFunction(a) {
    const { decimalFormatRemove3Digit } = this.props.sportsbook
    if (decimalFormatRemove3Digit) {
      let b = a.toString().split(".")[0],
        f = a.toString().split(".")[1];
      return f ? 1 < f.length ? 99 === parseInt(f.substr(0, 2)) ? parseInt(b) + 1 : parseInt(b) : Math.floor(a) : a
    }
    return Math.round(a)
  }
  reCalculate() {
    const { betSelections, enableFreebet,
      freeBetStake,
      betStake, sys_bet_variant } = this.props.sportsbook;
    let f = 0, betSelectionsArr = [];

    Object.keys(betSelections).forEach((sele) => {
      betSelectionsArr.push(betSelections[sele])
    })
    let d = [],
      h = [],
      g, e, c = sys_bet_variant.variant;
    for (e = 0; e < c; e++) { d[e] = e; h[e] = betSelectionsArr.length - e };
    h = h.reverse();
    e = c - 1;
    for (let l; d[0] <= h[0];)
      if (d[e] < h[e])
        if (e !== c - 1) e = c - 1;
        else {
          g = 1;
          for (l = 0; l < c; l++) 0 === betSelectionsArr[d[l]].flag ? g *= betSelectionsArr[d[l]].price : 1 === betSelectionsArr[d[l]].flag && (g = 0);
          f = (100 * f + this.mathCuttingFunction(100 * g)) / 100;
          d[e]++
        }
      else
        for (e--, d[e]++, g = e; g < c - 1; g++) d[g + 1] = d[g] + 1;
    // d = Math.round(this.factorial(betSelections.length) / (this.factorial(c) * this.factorial(betSelections.length -
    //     c)));
    // h = this.props.betStake*this.props.sys_bet_variant.bets / d;
    h = (enableFreebet ? freeBetStake.amount : betStake);
    this.stakePerBet = (this.mathCuttingFunction(100 * h) / 100).toFixed(2);
    f = {
      win: (this.mathCuttingFunction(f * h * 100) / 100).toFixed(2),
      options: d
    };
    this.sys_bet_result = f
  }
  removeAllBetSelections() {
    const { selectionSub, isQuickBet, betStake } = this.props.sportsbook
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { betSelections: {}, betMode: 1, betStake: isQuickBet ? betStake : 0 }))
    dataStorage('betSlip', {}, 2)
    selectionSub && this.props.unsubscribe(selectionSub, 'selectionSub')
  }
  removeGameFromBets(gameId) {
    const { betSelections, subscriptions, selectionSub } = this.props.sportsbook; let betSLen = Object.keys(betSelections).length
    let stateData = {}
    if (betSLen === 1) {
      this.removeAllBetSelections()
      return
    }
    Object.keys(betSelections).forEach((sID, k) => {
      if (parseInt(sID, 10) !== gameId) {
        let newconflicts = betSelections[sID].conflicts.slice(0)
        for (let conflict in newconflicts) {
          if (newconflicts[conflict].marketId === gameId) {
            betSelections[sID].conflicts.splice(parseInt(conflict), 1)
          }
        }
      }
    })
    delete betSelections[gameId]
    betSLen = Object.keys(betSelections).length
    if (betSLen < 2) {
      stateData.betMode = 1
      stateData.betStake = 0
    }

    dataStorage('betSlip', betSelections)
    if (subscriptions[selectionSub]) {
      this.props.unsubscribe(selectionSub)
      stateData.selectionSub = null
    }
    stateData.betSelections = betSelections
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, stateData))
    betSLen > 0 && this.props.subscribeToSelection(betSelections)
  }
  onOddsSettingsChange(e) {

    let acceptMode = this.props.sportsbook.acceptMode, mode = e.target.value
    if (mode !== acceptMode)
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { acceptMode: parseInt(mode) }))
  }
  betslipToggleView() {
    const { showFirsttime } = this.props.sportsbook
    this.setState(prevState => ({ isBetSlipOpen: showFirsttime ? false : !prevState.isBetSlipOpen }))
    this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { showBetslipSettings: false, animation: false, showFirsttime: showFirsttime ? false : showFirsttime }))
  }
  onOddsTypeChange(e) {
    let oddType = this.props.sportsbook.oddType, type = e.target.value
    if (type !== oddType) {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { oddType: type }))
      dataStorage('odds_format', type)
    }
  }
  retrieve() {
    if (this.retrieveBookingInput && this.retrieveBookingInput.value !== '') {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { retrieveBookingLoading: true }))
      let val = this.retrieveBookingInput.value
      if (val !== '') {
        this.props.retrieve(val, this.checkBookingResult.bind(this))
        this.retrieveBookingInput.value = ''
      }
    }
  }
  factorial(n) {
    return (n !== 1) ? n * this.factorial(n - 1) : 1;
  }
  getTotalBets() {
    let totalBets = 0, { betSelections, sys_bet_variant, enableFreebet, betMode } = this.props.sportsbook
    if (betMode === 1) {
      Object.keys(betSelections).forEach((sele, ind) => {
        if (betSelections[sele].singleStake !== "" && betSelections[sele].singleStake !== 0) {
          totalBets += 1
        }
      })
      return totalBets
    } else if (betMode === 3) { return null !== sys_bet_variant ? sys_bet_variant.bets : this.sys_bet_result.options }
    else if (enableFreebet) return Object.keys(betSelections).length

  }
  getTotalStake() {
    let totalStake = 0, { betSelections, sys_bet_variant, betMode, betStake } = this.props.sportsbook
    if (betMode === 1) {
      Object.keys(betSelections).forEach((sele, ind) => {
        if (betSelections[sele].singleStake !== "" && betSelections[sele].singleStake !== 0) {
          totalStake += betSelections[sele].singleStake
        }
      })
      return Number.parseFloat(totalStake, 10).toFixed(2)
    } else if (betMode === 3 && betStake) { return Number.parseFloat(betStake * sys_bet_variant.bets || 0, 10).toFixed(2) }
    else return Number.parseFloat(betStake > 0 ? betStake : 0.00, 10).toFixed(2)

  }
  calculateTotalOdds(betSelections) {
    let totalOdds = 0
    Object.keys(betSelections).forEach((sele, ind) => {
      if (totalOdds === 0) {
        totalOdds = betSelections[sele].price
      } else {
        totalOdds *= betSelections[sele].price
      }
    })
    return totalOdds
  }
  getTotalWinAmount(selectionBonusPercentage) {
    let { betSelections, freeBetStake, enableFreebet } = this.props.sportsbook, totalOdds = this.calculateTotalOdds(betSelections)
    return Number.parseFloat((totalOdds * (enableFreebet ? freeBetStake.amount : this.getTotalStake())) + ((totalOdds * (enableFreebet ? freeBetStake.amount : this.getTotalStake())) * (selectionBonusPercentage / 100)), 10).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
  getPossibleWinAmount() {
    let { betSelections, freeBetStake, enableFreebet } = this.props.sportsbook, totalOdds = this.calculateTotalOdds(betSelections)
    return Number.parseFloat(totalOdds * (enableFreebet ? freeBetStake.amount : this.getTotalStake()), 10).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')
  }
  render() {
    const { betMode, betSlipMode,
      betSelections, betStake, lowBalance, sys_bet_variant,
      showBetSlipNoty, betInprogress, showBetslipSettings,
      betSlipNotyMsg, betSlipNotyType, oddType, acceptMode, enableEventSeletionBonus, bookingNumber, betFailed, showFirsttime, isQuickBet, isOddChange, sportsbettingRules, config, authUser, freeBetStake, freeBets, enableFreebet } = this.props.sportsbook,
      { isLoggedIn } = this.props.appState, profile = this.props.profile, { isBetSlipOpen, showMatchDetails, details } = this.state
    let newSelection = [], qualifiedSelectionCount = 0, selectionBonusPercentage = 0, min_variant = 2,
      totalOdds = this.calculateTotalOdds(betSelections), chainWinning = 0,
      totalBets = betMode === 3 ? Object.keys(betSelections).length : 0
    let betlen = null !== betSelections && undefined !== betSelections ? Object.keys(betSelections).length : 0
    this.sys_bet = []
    Object.keys(betSelections).forEach((sele, ind) => {
      if (betSelections[sele].price >= 1.3)
        qualifiedSelectionCount += 1
      newSelection.push(betSelections[sele])
      if (min_variant < betlen) {
        let opts = 0, nf = this.factorial(betlen), rf = this.factorial(min_variant), nrf = this.factorial(betlen - min_variant)
        opts = nf / (rf * nrf)
        this.sys_bet.push({ variant: min_variant, sys: min_variant + '/' + betlen, bets: opts })
      }
      min_variant++
    })
    if (null !== sys_bet_variant && betStake > 0) {
      this.reCalculate()
    }
    if (betMode === 4 && betStake >= 0.5) {
      let result = 0
      Object.keys(betSelections).forEach((bet) => {
        if (result === 0) {
          result = betStake * betSelections[bet].price
        } else {
          result = (result - betStake) + (betStake * betSelections[bet].price)
        }
      })
      chainWinning = result
    }
    if (betStake > 0)
      for (const rule in sportsbettingRules) {
        if (qualifiedSelectionCount >= sportsbettingRules[rule].MinimumSelections && qualifiedSelectionCount <= sportsbettingRules[rule].MaximumSelections && betMode === sportsbettingRules[rule].BetType) {
          if (qualifiedSelectionCount < betlen && null !== sportsbettingRules[rule].IgnoreLowOddSelection)
            selectionBonusPercentage = sportsbettingRules[rule].AmountPercent
          else if (qualifiedSelectionCount < betlen && null === sportsbettingRules[rule].IgnoreLowOddSelection)
            selectionBonusPercentage = 0
          else
            selectionBonusPercentage = sportsbettingRules[rule].AmountPercent

          break
        }
      }
    newSelection.sort((a, b) => {
      if (a.order > b.order)
        return 1
      if (b.order > a.order)
        return -1

      return
    })

    return (
      betlen > 0 && <div className={`controls betslip-floating-mode-container bottom-right ${!isLoggedIn ? 'guest' : ''} ${showFirsttime ? 'first-add-show' : ''} ${isBetSlipOpen || showFirsttime ? 'open' : ''} betslip-icon`} ref={(el) => { this.betslipbody = el }}>
        <div className={`floating-mode-inner ${showFirsttime ? 'quick' : ''}`}>
          {!isBetSlipOpen && <div className="betslip-opener-container" onClick={this.betslipToggleView}>
            <span className="text"> BETSLIP</span>
            <span className="bets-count">{betlen}</span>
          </div>}
          <div className="betslip-element-container">
            <div className="floating-mode-overlay"></div>
            <div className="close-betslip"></div>
            <div className="betslip-element">
              <div className="ember-view">
                <div className="betslip-container">

                  <div className="betslip-header-settings-container">
                    <div className="betslip-header-settings betslip-header" >
                      <div className="left">
                        <div className="balance-block" style={{ fontWeight: '700' }}>{isLoggedIn && <span>{profile.currency} {(parseFloat(profile.Balance) + parseFloat(profile.bonus)).toFixed(3)}</span>}</div>
                      </div>

                      <div className="right" >
                        <div className="settings-icon-container icon" onClick={this.openBetslipSettings}>
                          <span className={`icon-icon-settings rotate ${showBetslipSettings && 'down'}`}></span>
                        </div>
                        <div className="settings-icon-container icon" onClick={this.betslipToggleView}>
                          <span className={`${showFirsttime ? 'icon-icon-arrow-down' : 'icon-icon-close-x'} remove-icon-betslip`}></span>
                        </div>
                      </div>
                    </div>


                  </div>

                  <div className="betslip-header betslip-header-settings">
                    <div className="betslip-title" style={{ padding: !isLoggedIn && '10px' }}></div>
                  </div>

                  <div className={`liquid-container`} >

                    <div className="liquid-child" style={{ top: "0px", left: "0px" }}>
                      {showBetslipSettings && <div className={`betslip-settings`}>
                        <OddsType onChange={this.onOddsTypeChange} value={oddType} />
                        {isLoggedIn && <OddsSettings onChange={this.onOddsSettingsChange} value={acceptMode} title={'Automatically accept odds.'} />}
                      </div>}

                    </div>


                  </div>

                  <div className="betslip-body">
                    {
                      betSlipMode === 2 && betlen >= 1 && isLoggedIn && authUser.has_free_bets === true && freeBets.length &&
                      <div className="betslip-settings-container">
                        <div className="quick-bet-setting">
                          <span>{enableFreebet ? 'Free Bet is ON' : 'Free Bet available'}</span>

                          <label className="sb-on-off-button">
                            <input onChange={(e) => { this.useFreeBet(e) }} type="checkbox" checked={enableFreebet} />
                            <span>
                              <span className="icon-sb-pause off"></span>
                            </span>
                          </label>
                        </div>
                        <div className="liquid-container ember-view">
                          {
                            enableFreebet ?
                              <div className="liquid-child ember-view" style={{ top: "0px", left: "0px" }}>
                                <div className="betslip-quick-bet-container open">
                                  <OddsSettings onChange={this.setFreeBetStake.bind(this)} customInput={freeBets} value={freeBetStake} title={'Choose Stake'} />
                                </div>
                              </div>
                              : null}
                        </div>
                      </div>
                    }
                    {
                      betlen > 0 ?
                        <React.Fragment>
                          <div className="betslip-tabs">
                            <div className="betslip-panel">
                              {/* <select onChange={(e) => this.changeBetMode(e)} value={betMode}>
                                <option value="1">Single</option>
                                <option disabled={betlen < 2} value="2" >Multiple</option>
                                <option disabled={betlen < 3 || betlen > 16} value="3">System</option>
                                <option disabled={betlen < 2} value="4">Chain</option>
                              </select>
                              {betMode === 3 &&
                                <select onChange={(e) => this.setSysBetVariant(e)} value={JSON.stringify(sys_bet_variant || this.sys_bet[0])}>
                                  {
                                    this.sys_bet.map((sys, i) => {
                                      return <option key={i} disabled={betlen < 2} value={JSON.stringify(sys)} >{sys.sys}({sys.bets} bets)</option>
                                    })
                                  }
                                </select>
                              } */}
                              <div className="clear-all" onClick={() => this.removeAllBetSelections()}>
                                <span>Remove All</span>
                              </div>
                            </div>
                          </div>
                          <div className="betslip-matches">
                            <div className="betslip-matches-bagger">
                              {
                                newSelection.map((selection) => {
                                  return (
                                    <div key={selection.marketId} className="betslip-match-info">
                                      <div className="sb-bet-body ">

                                        <div className="betslip-match-info-teams-block">
                                          <div className="betslip-match-left-block col-sm-10">
                                            <div className="betslip-match-teams">
                                              {selection.conflicts.length > 0 && <div className="betslip-match-details-block col-sm-1"><i className="icon-sb-error" ></i></div>}
                                              <span className={`teams col-sm-${selection.conflicts.length > 0 ? '11' : '12'}`}>{selection.title}</span>
                                            </div>
                                          </div>

                                          <div className="betslip-match-right-block col-sm-2" style={{ display: 'flex' }}>
                                            <div tabIndex="0" id={selection.marketId} className="betslip-match-details-block" onFocus={(e) => this.showMatchDetails(e, { ...selection.gamePointer, title: selection.title })} onBlur={this.hideMatchDetails}><i className="icon-icon-info" data-details-info="" ></i>
                                            </div>
                                            <div className="betslip-match-remove" onClick={() => this.removeGameFromBets(selection.marketId)}>
                                              <span className="icon-icon-close-x remove-icon-betslip"></span>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="sb-bet-info">
                                          {selection.suspended ?
                                            <div className="sb-event-overlay suspended">
                                              <div className="sb-event-overlay-info suspended-container">
                                                <div className="suspended-container-part">
                                                  <span className="sb-event-overlay-icon icon-icon-locked-stream"></span>
                                                  <span className="sb-event-overlay-title">Suspended</span>
                                                </div>
                                              </div>
                                            </div>
                                            : null
                                          }
                                          <div className="sb-bet-info-content">
                                            <span className="betslip-match-market-type">{selection.marketName} {selection.marketBase}</span>
                                            <span className="betslip-match-old-coeficiente">
                                              <span className="betslip-match-old-coeficiente">
                                                {selection.initialPrice !== selection.price ? <span>{oddConvert({
                                                  main: {
                                                    decimalFormatRemove3Digit: 0,
                                                    notLockedOddMinValue: null,
                                                    roundDecimalCoefficients: 3,
                                                    showCustomNameForFractionalFormat: null,
                                                    specialOddFormat: null,
                                                    useLadderForFractionalFormat: 0
                                                  }, env: { oddFormat: null }
                                                }, { mathCuttingFunction: () => { } })(selection.initialPrice, oddType)}</span> : null}
                                              </span>
                                            </span>
                                          </div>

                                          <div className="sb-bet-info-content">
                                            <span className="betslip-match-event">
                                              {selection.pick} {selection.pick === 'W1' || selection.pick === 'W2' ? ' - ' + selection.pick.replace(/Team 1/gi, selection.team1Name).replace(/Team 2/gi, selection.team2Name).replace(/w1/gi, selection.team1Name).replace(/w2/gi, selection.team2Name) : ''}
                                            </span>
                                            <span className="betslip-match-coeficiente">
                                              <span>{oddConvert({
                                                main: {
                                                  decimalFormatRemove3Digit: 0,
                                                  notLockedOddMinValue: null,
                                                  roundDecimalCoefficients: 3,
                                                  showCustomNameForFractionalFormat: null,
                                                  specialOddFormat: null,
                                                  useLadderForFractionalFormat: 0
                                                }, env: { oddFormat: null }
                                              }, { mathCuttingFunction: () => { } })(selection.price, oddType)}</span>
                                            </span>
                                          </div>
                                          {betMode === 1 && !enableFreebet &&
                                            <div className="sb-bet-input-block stake-text keyboard-close">
                                              <div className="stake-text ">
                                                <span>
                                                  Stake
                                                </span>

                                              </div>
                                              <div className="sb-input-inner-label">
                                                {/* <BetVirtualKeyboard onSetStake={this.setSingleBetStake} onClear={this.onClearSingle} onFocus={this.onFocus} onFocusLost={this.onFocusLost} value={selection.singleStake} id={selection.gameId}/> */}
                                                <input placeholder="0" type="number" value={selection.singleStake} onChange={(e) => this.setSingleBetStake(selection.marketId, e)} id="singlebetStake" autoComplete='off' />
                                              </div>

                                            </div>
                                          }
                                          {selection.booking_id && betSlipMode === 1 &&
                                            <div className="sb-bet-input-block booking-id-text">
                                              <div className="booking-text">
                                                <span>
                                                  Booking ID:
                                                </span>

                                              </div>

                                              <div className="booking-id">
                                                <span>{selection.booking_id}</span>
                                              </div>
                                              <div className="print-btn" onClick={() => { this.printBookingTicket() }}><span className="print-icon"></span></div>
                                            </div>
                                          }
                                          {betMode === 1 && betlen === 1 ?

                                            <div className="sb-bet-result  ">
                                              <div className="sb-bet-return top-border ">
                                                <span>Possible Win:</span>
                                                <span className="possible-win">{selection.singleStake !== "" ? (selection.singleStake * selection.price).toFixed(2) : enableFreebet ? selection.price * freeBetStake.amount : 0}</span>
                                              </div>
                                            </div>
                                            : null}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })
                              }
                            </div>


                            <div className="betslip-matches-total-info">
                              <div className="betslip-match-info-footer">
                                {(betlen > 1 && betSlipMode === 2 && !enableFreebet) || (betSlipMode === 1 && betlen > 1) ?
                                  <div className="sb-bet-input-block stake-text">
                                    <span>
                                      Stake {betMode === 1 || betMode === 3 ? 'Per Bet' : ''}
                                    </span>
                                    <div className="sb-input-inner-label">
                                      <input id="betStake" placeholder="0" type="number" onChange={(e) => this.setBetStake(e)} autoComplete='off' />

                                    </div>
                                  </div> : null}
                                <div id="ember1599" className="ember-view"></div>

                                <div className="sb-bet-result">
                                  {
                                    !showFirsttime && <React.Fragment>
                                      {(betMode === 1 || betMode === 3) &&
                                        <div className="sb-bet-return">
                                          <span className="number-of-bets">Number of Bets:</span>
                                          <span className="count-of-bets">{this.getTotalBets()}</span>
                                        </div>
                                      }
                                      {betMode === 2 &&
                                        <div className="sb-bet-return total">
                                          <span>Total Odds: </span>
                                          <span>{oddConvert({
                                            main: {
                                              decimalFormatRemove3Digit: 0,
                                              notLockedOddMinValue: null,
                                              roundDecimalCoefficients: 3,
                                              showCustomNameForFractionalFormat: null,
                                              specialOddFormat: null,
                                              useLadderForFractionalFormat: 0
                                            }, env: { oddFormat: null }
                                          }, { mathCuttingFunction: () => { } })(totalOdds, oddType)}</span>
                                        </div>
                                      }

                                      <div className="sb-bet-return">
                                        <span>Total Stake:</span>
                                        {
                                          enableFreebet ?
                                            <span>{freeBetStake.amount}</span>
                                            : <span>{this.getTotalStake().toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')}</span>

                                        }
                                      </div>

                                      <div className="sb-bet-return top-border">
                                        <span>{betMode !== 1 ? 'Possible ' : 'Total '} Win:</span>
                                        <span className="possible-win">{betMode === 3 ? (this.sys_bet_result.win).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,') : betMode === 4 ? Number.parseFloat(chainWinning).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,') : this.getPossibleWinAmount()}</span>
                                      </div>
                                    </React.Fragment>
                                    // :
                                    // <div className="quick-bet-setting" style={{display:'flex',justifyContent:'flex-end'}}>
                                    // <span style={{marginRight:'10px'}}>Save Stake</span>

                                    // <label className="sb-on-off-button">
                                    //   <input onChange={(e) => { this.useQuickBet(e) }} type="checkbox" />
                                    //   <span>
                                    //     <span className="icon-sb-pause off"></span>
                                    //   </span>
                                    // </label>
                                    // </div>
                                  }
                                  {selectionBonusPercentage > 0 && enableEventSeletionBonus && betSlipMode === 2 &&
                                    <React.Fragment>
                                      <div className="sb-bet-return bonus">
                                        <span>Bonus Percentage:</span>
                                        <span className="possible-win">{selectionBonusPercentage} </span>
                                      </div>

                                      <div className="sb-bet-return bonus">
                                        <span>Accumulator Bonus:</span>
                                        <span className="possible-win">{parseFloat((totalOdds * this.getTotalStake()) * (selectionBonusPercentage / 100), 10).toFixed(2).toString().replace(/\d(?=(\d{3})+\.)/g, '$&,')} </span>
                                      </div>
                                    </React.Fragment>
                                  }
                                  {(selectionBonusPercentage > 0 && enableEventSeletionBonus && betSlipMode === 2) || enableFreebet ?
                                    <div className="sb-bet-return bonus">
                                      <span>Total Win:</span>
                                      <span className="possible-win">{this.getTotalWinAmount(selectionBonusPercentage)} </span>
                                    </div>
                                    : null}
                                </div>
                              </div>
                            </div>
                            {
                              bookingNumber !== null && betSlipMode === 1 && betMode !== 1 ?
                                <div className="booking-id-block">
                                  <div className="text"><span>{bookingNumber !== 1 ? 'Booking ID: ' : ''} </span><span>{bookingNumber !== 1 ? bookingNumber : null}</span></div>
                                  <div className="print-btn" onClick={() => { this.printBookingTicket() }}><span className="print-icon"></span></div>
                                </div>
                                : null
                            }
                            <div className="betBtn-container">

                              {

                                betFailed && isOddChange ?
                                  <button onClick={(e) => { this.onOddsSettingsChange({ target: { value: 2 } }); this.placeBet() }} className={`placebet ${betSlipMode !== 2 ? 'betslip-hide' : ''} ${betInprogress ? 'progress' : ''}`} disabled={(betSlipMode === 2 && isLoggedIn && lowBalance && !enableFreebet) || (betStake === 0 && !enableFreebet) || betInprogress}> {
                                    betInprogress ?
                                      <div className="no-results-container sb-spinner">
                                        <span className="btn-preloader sb-preloader"></span>
                                      </div>
                                      : 'Accept changes and place bets!'
                                  }</button> :
                                  isOddChange ?
                                    <button onClick={(e) => { this.onOddsSettingsChange({ target: { value: 2 } }); this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { isOddChange: false })) }} className={`placebet ${betSlipMode !== 2 ? 'betslip-hide' : ''} ${betInprogress ? 'progress' : ''}`} disabled={(betSlipMode === 2 && isLoggedIn && lowBalance && !enableFreebet) || (betStake === 0 && !enableFreebet) || betInprogress}> {
                                      betInprogress ?
                                        <div className="no-results-container sb-spinner">
                                          <span className="btn-preloader sb-preloader"></span>
                                        </div>
                                        : 'Accept Odds changes!'
                                    }</button>
                                    : !isLoggedIn && betlen && !localStorage.getItem("walletAddress") ?
                                      <button onClick={() => this.props.dispatch(allActionDucer(MODAL, {
                                        accVerifyOpen: true,
                                        formType: 'login'
                                      }))} className={`signintobet ${betSlipMode !== 2 ? 'betslip-hide' : ''} ${betInprogress ? 'progress' : ''}`}>
                                        Sign in to place bet</button>
                                      :
                                      <button
                                        style={{ cursor: "pointer" }}
                                        onClick={
                                          profile.Balance >= this.props.sportsbook.betStake ?


                                            () => { this.placeBet() }

                                            : makeToast("Your Balance is less then Your bet stake")
                                        }
                                        className={`placebet ${betSlipMode !== 2 ? 'betslip-hide' : ''} ${betInprogress ? 'progress' : ''}`}
                                        disabled={(betSlipMode === 2 && isLoggedIn && profile.bonus === '0.00' && (parseFloat(parseFloat(betStake).toPrecision(12)) > (parseFloat(profile.Balance).toPrecision(12)) && !enableFreebet)) || (betSlipMode === 2 && isLoggedIn && parseFloat(parseFloat(profile.bonus).toPrecision(12)) > 0 && (parseFloat(parseFloat(betStake).toPrecision(12)) > parseFloat(parseFloat(profile.games.split(',').includes('1') ? profile.bonus : '0').toPrecision(12))) && !enableFreebet) || ((betStake === 0 || betStake === '') && !enableFreebet) || betInprogress}> {
                                          // betInprogress ?
                                          //   <div className="no-results-container sb-spinner">
                                          //     <span className="btn-preloader sb-preloader"></span>
                                          //   </div>
                                          // :
                                          'Place Bet'
                                        }</button>
                              }
                            </div>
                          </div>
                        </React.Fragment>
                        :
                        <div className="betslip-empty guest">
                          <span>No bets have been selected. To bet, please click on the respective result.</span>
                        </div>
                    }
                  </div>
                  <Transition
                    items={showBetSlipNoty}
                    from={{ transform: 'translate3d(0,-40px,0)', opacity: 0 }}
                    enter={{ opacity: 1, transform: 'translate3d(0,0px,0)' }}
                    leave={{ opacity: 0, transform: 'translate3d(0,-40px,0)' }}>

                    {showBetSlipNoty =>
                      showBetSlipNoty &&
                      (props => <BetSlipNotification style={props} message={betSlipNotyMsg} type={betSlipNotyType} canNotify={showBetSlipNoty} onClose={this.hideNoty} />)
                    }
                  </Transition>

                </div>
              </div>
            </div>
          </div>
        </div>
        {
          showMatchDetails && <div id="match-details-betslip" className="betslip-match-details left ember-view" style={
            {
              top: details.top + 'px',
              left: details.left + 'px',
              opacity: 1
            }
          }>
            <div className={`${details.match.sport.toLowerCase()} sb-sport-background fill sport-header sport-border`}>
              <i className="sb-sport-icon icon-sport-soccer"></i>
              <span>{details.match.sport}</span>
            </div>

            <div className="betslip-match-details-body">
              <div>
                <span>{details.match.competion}</span>
              </div>
              <div>
                <span>Not Started</span>
              </div>
              <div>
                {details.match.title}
              </div>
            </div></div>
        }
      </div>
    )

  }
}