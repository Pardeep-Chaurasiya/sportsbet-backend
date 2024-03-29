const initialStates = {
  appState: {
    isReady: false,
    lang: "eng",
    isLoggedIn: false,
    $publicKey: "ZDJSc2QzbDBlSG8yTmpZPQ==",
    $betKey: "8b3fb44d4bc2d5c5d8cd25891ba6e32c",
  },
  promoBanner: {},
  homeData: {
    siteBanner: [],
  },
  slotGames: {
    playMode: false,
    GamesBanner: [],
  },
  sb_modal: {
    show_drawer: false,
    attempttingBonusClaim: !1,
    attempttingBonusWithdraw: !1,
    showClaimDialog: !1,
    showDepositDialog: !1,
    modalOpen: false,
    type: 0,
    accVerifyOpen: false,
    created: false,
    formType: null,
    tabType: 0,
    contentType: null,
    loginHasError: false,
    loginErrorMSG: "",
    attemptingLogin: false,
    sendingSMS: false,
    attemptingSignup: false,
    signupHasError: false,
    signupErrorMSG: "",
    smsHasError: false,
    smsErrorMSG: "",
    attemptingPassReset: false,
    resetHasError: false,
    resetErrorMSG: "false",
    verifyingSMS: "",
  },
  profile: {
    uid: null,
    nickname: "",
    dailing_code: null,
    mobilenumber: null,
    firstName: "",
    lastName: "",
    email: "",
    image: null,
    currency: null,
    AuthToken: null,
    birth_date: "",
    gender: "",
    balance: 0,
    bonus: 0,
    games: "",
    member_type: null,
    Balance: 0,
    walletAddress: ""
  },
  sportsBook: {
    appTheme: "light",
    timezone: null,
    authUser: {
      auth_token: null,
      authentication_status: null,
      is_new_client: null,
      qr_code_origin: null,
      user_id: null,
    },
    data: [],
    loadSports: true,

    competition: null,
    competitionData: {},
    competitionName: "",
    competitionRegion: { id: null, name: null, alias: null },
    loadCompetition: true,
    compitition: { name: "", order: "" },
    activeCompetition: { id: "", name: "", alias: "" },

    marketData: {},
    loadMarket: true,
    inviewMarketsubid: null,

    loadResultsGames: true,
    loadResultsGame: false,
    resultsGames: [],
    resultsGame: {},
    sportCompetitionList: [],

    multiviewGames: [],

    loadingHistory: false,
    bets_history: {},
    showBetHistory: false,

    popularcompetitionData: {},
    populargamesData: {},
    showFirsttime: false,
    sessionData: {},
    subid: null,
    inviewGamesubid: null,
    sportsubid: null,
    subscriptions: [],
    viewmode: "0",
    game: null,
    sport: null,
    region: null,
    betSelections: {},
    betStake: 0,
    betMode: 2,
    betSlipMode: 2,
    activeRegion: { id: null, name: null, alias: null },
    Prematch: [0, 2],
    activeGame: null,
    lowBalance: false,
    activeSport: { name: "", alias: "" },
    Live: [1],
    bookingNumber: null,
    searching: false,
    searchData: {},
    searchDataC: {},
    changingOutcome: false,
    maxOddForMultiBet: false,
    showBetSlipNoty: false,
    betSlipNotyMsg: "",
    betSlipNotyType: "",
    maxSelectionForMultiBet: false,
    minBetStakes: false,
    betPlaced: false,
    betFailed: false,
    betInprogress: false,
    msg: null,
    activeView: "",
    swarmResCode: {
      OK: 0,
      SESSION_LOST: 5,
      NEED_TO_LOGIN: 12,
    },
    config: {},
    sys_bet_variant: null,
    isLoggedIn: false,
    betTicketData: {},
    searchInput: null,
    activeGameSuspended: false,
    recentOpenedRSgame: null,
    acceptMode: 0,
    oddType: "decimal",
    isQuickBet: false,
    quickBetStake: 0,
    isOddChange: false,
    isQuickBetStakeZero: false,
    cashable_bet: null,
    enableEventSeletionBonus: true,
    showPreview: true,
    selectionBonusPercentage: 0,
    decimalFormatRemove3Digit: false,
    animation: false,
    checkResult: null,
    retrieveBooking: null,
    playSound: false,
    showBookingID: false,
    showBetslipSettings: false,
    showTicketBetSearch: false,
    searchingTicket: false,
    retrieveBookingLoading: false,
    gameLimit: 5,
    loadTopEvents: true,
    loadUpcomingEvents: true,
    loadLiveNow: true,
    minutesFilter: 60,
    liveNowData: {},
    upcomingData: {},
    upcomingSubId: null,
    liveNowSubId: null,
    freeBetStake: null,
    freeBets: [],
    enableFreebet: false,
    rids: {
      1: { rid: 1, callback: null },
      2: { rid: 2, callback: null },
      3: { rid: 3, callback: null },
      4: { rid: 4, callback: null },
      5: { rid: 5, callback: null },
      6: { rid: 6, callback: null },
      6.5: { rid: 6.5, callback: null },
      7: { rid: 7, callback: null },
      8: { rid: 8, callback: null },
      9: { rid: 9, callback: null },
      10: { rid: 10, callback: null },
      11: { rid: 11, callback: null },
      12: { rid: 12, callback: null },
      13: { rid: 13, callback: null },
      14: { rid: 14, callback: null },
      15: { rid: 15, callback: null },
      16: { rid: 16, callback: null },
      17: { rid: 17, callback: null },
      18: { rid: 18, callback: null },
      19: { rid: 19, callback: null },
      20: { rid: 20, callback: null },
      21: { rid: 21, callback: null },
    },
  },
};

export const APPREADY = 1,
  SESSION = 1.1,
  LANG = 1.2,
  LOGIN = 2,
  AUTHENTICATED = 2.1,
  LOGOUT = 3,
  PROFILE = 4,
  UPDATE_PROFILE = 4.1,
  PROFILE_EMPTY = 4.2,
  CHANGE_PASSWORD = 5,
  DEPOSIT = 5,
  WITHDRAW = 6,
  DO_BET = 7,
  DO_BOOKING = 8,
  CASHOUT = 9,
  SPORT = 10,
  LOAD_SPORT = 10.1,
  UPDATE_SPORT = 10.2,
  LOAD_COMPETITIONS = 11,
  COMPETITIONS = 11.1,
  UPDATE_COMPETITIONS = 11.2,
  MARKET = 12,
  UPDATE_MARKET = 12.1,
  LOAD_MARKET = 12.2,
  EVENT = 13,
  UPDATE_EVENT = 13.1,
  PARTNER_CONFIG = 14,
  GAME_SEARCH = 15,
  LOADING_GAME_SEARCH = 15.1,
  BET_RULES = 16,
  BONUS = 17,
  BET_BOOKING = 18,
  POPULAR_COMPETITION = 19,
  POPULAR_GAMES = 20,
  CURRENCY_CONFIG = 21,
  SUBSCRIPTION = 22,
  SUBSCRIPTION_UPDATE = 22.1,
  RECAPTCHA = 23,
  BET_HISTORY = 24,
  LOAD_BET_HISTORY = 24.1,
  SHOW_BET_HISTORY = 24.2,
  SPORT_COMPETITION = 25,
  GAMES_RESULTS = 26,
  LOAD_GAMES_RESULTS = 26.1,
  GAME_RESULT = 27,
  LOAD_GAME_RESULT = 27.1,
  BET_BOOKED = 28,
  BET_ACCEPTED = 29,
  MULTIVIEW_GAMES = 30,
  RIDS_PUSH = 31,
  RIDS_REMOVE = 31.1,
  SEARCHING_GAME = 32,
  SEARCH_DATA = 32.1,
  SPORTSBOOK_ANY = 33,
  MODAL = 34,
  SITE_BANNER = 35,
  PLAY_GAME = 36,
  QUIT_GAME = 36.1,
  GAME_BANNER = 36.2,
  RESET = 59;

export const sportsBookReducer = (
  state = initialStates.sportsBook,
  { type, payload }
) => {
  switch (type) {
    case SESSION:
      return { ...state, sessionData: { ...payload } };
    case PARTNER_CONFIG:
      return { ...state, config: { ...payload } };
    case AUTHENTICATED:
      return { ...state, authUser: { ...payload } };
    case GAMES_RESULTS:
      return { ...state, authUser: { ...payload } };
    case DO_BOOKING:
      return { ...state, ...payload };
    case BET_BOOKED:
      return { ...state, ...payload };
    case DO_BET:
      return { ...state, ...payload };
    case BET_ACCEPTED:
      return { ...state, ...payload };
    case POPULAR_COMPETITION:
      return { ...state, popularcompetitionData: { ...payload.data } };
    case POPULAR_GAMES:
      return { ...state, populargamesData: { ...payload.data } };
    case SPORT_COMPETITION:
      return { ...state, sportCompetitionList: payload.data };
    case EVENT:
      return { ...state, sportCompetitionList: { ...payload.data } };
    case UPDATE_EVENT:
      return { ...state, sportCompetitionList: { ...payload.data } };
    case CASHOUT:
      return { ...state, showCashoutDailog: payload.showCashoutDailog };
    case SPORT:
      return {
        ...state,
        data: { ...payload.data },
        loadSports: payload.loadSports,
      };
    case LOAD_SPORT:
      return { ...state, loadSports: payload.loadSports };
    case UPDATE_SPORT:
      return { ...state, data: { ...payload.data } };

    case COMPETITIONS:
      return {
        ...state,
        competitionData: { ...payload.data },
        loadCompetition: payload.loadCompetition,
      };
    case LOAD_COMPETITIONS:
      return { ...state, loadCompetition: payload.loadCompetition };
    case UPDATE_COMPETITIONS:
      return { ...state, competitionData: { ...payload.data } };
    case MARKET:
      return {
        ...state,
        marketData: { ...payload.data },
        loadMarket: payload.loadMarket,
      };
    case LOAD_MARKET:
      return { ...state, loadMarket: payload.loadMarket };
    case UPDATE_MARKET:
      return { ...state, marketData: { ...payload.data } };

    case GAMES_RESULTS:
      return {
        ...state,
        resultsGames: { ...payload.data },
        loadResultsGames: payload.loadResultsGames,
      };
    case LOAD_GAMES_RESULTS:
      return { ...state, loadResultsGames: payload.loadResultsGames };
    case GAME_RESULT:
      return {
        ...state,
        resultsGame: { ...payload.data },
        loadResultsGame: payload.loadResultsGame,
      };
    case LOAD_GAME_RESULT:
      return { ...state, loadResultsGames: payload.loadResultsGame };

    case BET_HISTORY:
      return {
        ...state,
        bets_history: [...payload.data],
        loadingHistory: payload.loadingHistory,
      };
    case LOAD_BET_HISTORY:
      return { ...state, loadingHistory: payload.loadingHistory };
    case SHOW_BET_HISTORY:
      return { ...state, showBetHistory: payload.showBetHistory };

    case RIDS_PUSH:
      return { ...state, rids: { ...state.rids, ...payload } };
    case SEARCHING_GAME:
      return { ...state, ...payload };
    case MULTIVIEW_GAMES:
      return { ...state, multiviewGames: [...payload] };
    case SPORTSBOOK_ANY:
      return { ...state, ...payload };
    case RESET:
      return { ...state, data: [], competitionData: [], marketData: [] };
    default:
      return state;
  }
};
export const profileReducer = (
  state = initialStates.profile,
  { type, payload }
) => {
  switch (type) {
    case PROFILE:
      return { ...state, ...payload };
    case PROFILE_EMPTY:
      return state;

    default:
      return state;
  }
};
export const modalReducer = (
  state = initialStates.sb_modal,
  { type, payload }
) => {
  switch (type) {
    case MODAL:
      return { ...state, ...payload };

    default:
      return state;
  }
};
export const authUserReducer = (
  state = initialStates.authUser,
  { type, payload }
) => {
  switch (type) {
    // case AUTHENTICATED :
    //     return {...state, ...payload}

    default:
      return state;
  }
};
export const homeDataReducer = (
  state = initialStates.homeData,
  { type, payload }
) => {
  switch (type) {
    case SITE_BANNER:
      return { ...state, ...payload };

    default:
      return state;
  }
};
export const casinoReducer = (
  state = initialStates.slotGames,
  { type, payload }
) => {
  switch (type) {
    case PLAY_GAME:
      return { ...state, playMode: true };

    case QUIT_GAME:
      return { ...state, playMode: false };
    case GAME_BANNER:
      return { ...state, GamesBanner: payload };

    default:
      return state;
  }
};
export const appStateReducer = (
  state = initialStates.appState,
  { type, payload }
) => {
  switch (type) {
    case LOGIN:
      return { ...state, isLoggedIn: true };
    case LOGOUT:
      return { ...state, isLoggedIn: false };
    case APPREADY:
      return { ...state, ...payload };
    case LANG:
      return { ...state, ...payload };
    default:
      return state;
  }
};
