import React from "react";
import { NavLink } from "react-router-dom";
import "./header.css";
import axios from "axios";
import * as $ from "jquery";
import logo from "../../images/logo.png";
import moment from "moment-timezone";
import favicon from "../../images/favicon.jpg";
import { allActionDucer } from "../../actionCreator";
import { PROFILE } from "../../actionReducers";
import ReCAPTCHA from "react-google-recaptcha";

import IERC20ABI from '../../abi/IERC20ABI';
import { Web3Context } from "../../App";
import MerkleABI from "../../abi/MerkleABI";
import {
  NetIdMessage,
  NETID,
  DepositDecimals,
  DepositToken,
  API_ENDPOINT,
  Merkle,
  USDTDecimals
} from "../../config";
import { NewAPI } from "../../services/api";
import Web3Token from "web3-token";

import {
  SEARCHING_GAME,
  SPORTSBOOK_ANY,
  MODAL,
  LANG,
} from "../../actionReducers";
import {
  expiredRecaptcha,
  onSubmit,
  updateBrowserHistoryState,
  setCookie,
  dataStorage,
  makeToast,
} from "../../common";
import { withRouter } from "react-router-dom";
import { Transition } from "react-spring/renderprops";
import getWeb3 from "../../web3/getweb3";
import BetHistory from "../bethistory";
import { BetHistoryLoader } from "../loader";

const $api = NewAPI.getInstance();

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showRecaptcha: false,
      time: "",
      showFullInput: false,
      Balance: 0,
      isModalOpen: false,
      isSubmitApplicationModal: false,
      isWithdrawalModal: false,
      isHistoryModal: false,
      depositAmount: "",
      withdrawalAmount: "",
      betHistoryDatas: [],
      betHistoryLoader: false,
      datepickerFrom: "",
      datepickerTo: "",
      showLoad: false,
      withdraws: [],
      checked: false,
      web3: null,
      accounts: null,
    };
    this.openModal = this.openModal.bind(this);
    this.logOut = this.logOut.bind(this);
    this.openSearchedGame = this.openSearchedGame.bind(this);
    this.setOddType = this.setOddType.bind(this);
    this.changeTheme = this.changeTheme.bind(this);
    this.onFormInputFocus = this.onFormInputFocus.bind(this);
    this.onFormInputFocusLost = this.onFormInputFocusLost.bind(this);
    this.searchInput = null;
    this.timeInterval = null;
    this.recaptch_value = null;
    this.supportedTZ = ["Africa/Accra"];
    this.offsetTmz = [];
    this.searchBetHistoryResult = this.searchBetHistoryResult.bind(this);
  }

  componentDidMount() {
    // console.log(moment.tz.names())
    for (var i in this.supportedTZ) {
      this.offsetTmz.push(
        this.supportedTZ[i] +
        " (GMT " +
        moment.tz(this.supportedTZ[i]).format("Z") +
        ")"
      );
    }
    this.setTime();
    setInterval(() => {
      if (
        JSON.parse(localStorage.getItem("netId")) &&
        JSON.parse(localStorage.getItem("walletToken"))
      ) {
        $api.getBalance({}, this.afterBalance.bind(this));
      }
    }, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timeInterval);
    clearTimeout(this.animationTimeout);
  }

  logOut() {
    this.props.dispatchLogout();
  }

  walletlogOut() {
    localStorage.removeItem("walletToken");
  }

  // if (JSON.parse(localStorage.getItem("netId")) && JSON.parse(localStorage.getItem("walletToken"))) {
  //   console.log("hello");
  //   $api.getBalance(
  //     {

  //     },
  //     this.afterBalance.bind(this)
  //   );
  // }

  onFormInputFocus() {
    this.setState({ showFullInput: true });
  }

  onFormInputFocusLost(e) {
    if (Object.keys(this.props.searchData).length === 0)
      this.setState({ showFullInput: false });
    else if (
      Object.keys(this.props.searchData).length > 0 &&
      Object.keys(this.props.searchData.sport).length === 0
    ) {
      this.clearSearch();
      this.setState({ showFullInput: false });
    }
  }

  setOddType(t) {
    let oddType = this.props.oddType;
    if (t !== oddType)
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { oddType: t }));
    dataStorage("odds_format", t);
  }

  changeTheme(theme) {
    let appTheme = this.props.appTheme;
    if (theme !== appTheme)
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { appTheme: theme }));
  }

  openModal(contentType = null, tab = null) {
    this.props.dispatch(
      allActionDucer(MODAL, {
        modalOpen: true,
        type: contentType,
        tabType: tab !== null ? tab : 0,
      })
    );
  }
  openFormModal(contentType) {
    this.props.dispatch(
      allActionDucer(MODAL, { accVerifyOpen: true, formType: contentType })
    );
  }

  setTime() {
    this.timeInterval = setInterval(() => {
      this.setState({ time: moment.tz(this.supportedTZ[0]).format("H:mm:ss") });
    }, 1000);
  }

  setRecaptchaValue(e) {
    e.persist();
    this.recaptch_value = e.target.value;
  }

  clearTicketResult() {
    if (this.searchTicketInput && this.recaptchaValue) {
      this.props.dispatch(
        allActionDucer(SPORTSBOOK_ANY, {
          checkResult: null,
          searchingTicket: false,
        })
      );
    }
  }

  openSearchedGame(competition, region, sport, game = null) {
    // console.log(competition,region,sport,game)
    const activeView = this.props.activeView,
      historyState = { sport: sport, region: region, competition: competition };
    null !== game && (historyState.game = game);
    if (activeView === "Live" || activeView === "Prematch") {
      this.props.history.push(
        `/sports/${activeView.toLowerCase()}/${sport.alias}/${region.name}/${competition.id
        }${null !== game ? "/" + game.id : ""}`,
        historyState
      );
    } else
      this.props.history.push(
        `/sports/prematch/${sport.alias}/${region.name}/${competition.id}/${game.id}`,
        {
          sport: sport.id,
          region: region.id,
          competition: competition.id,
          game: game.id,
        }
      );
  }
  // async requestAccount() {
  //   console.log("requesting account .... ");
  //   if (window.ethereum) {
  //     console.log("Meta mask detected .... ");
  //     try {
  //       const accounts = await window.ethereum.request({
  //         method: "eth_requestAccounts",
  //       })
  //       const account = accounts[0];
  //       console.log(account, "account");
  //       const balance = await window.ethereum.request({
  //         method: "eth_getBalance", params: [account, "latest"]
  //       })
  //       const wei = parseInt(balance, 16);
  //       const eth = (wei / Math.pow(10, 18))
  //       this.setState({ Balance: eth })
  //       console.log(this.state.Balance, "anu");
  //       this.props.dispatch(allActionDucer(PROFILE, { Balance: this.state.Balance, metamaskAddress: account }))
  //       localStorage.setItem("walletAddress", account);
  //       makeToast("metamask connected successfully", 4000)

  //     } catch (error) {
  //       console.log(error, "error");
  //     }
  //   } else {
  //     alert("metamask not detected")
  //   }
  // }

  connectWallet = async (setWeb3, setNetId, setAccounts) => {
    try {
      const web3 = await getWeb3();

      setWeb3(web3);
      console.log(web3, "web3");

      const accounts = await web3.eth.getAccounts();
      setAccounts(accounts);
      // this.setState({
      //   web3: web3,
      //   accounts: accounts
      // })
      const walletId = accounts[0];
      console.log(web3, accounts[0], "account");
      const Token = localStorage.getItem("walletToken");
      if (!Token) {
        const token = await Web3Token.sign(
          (msg) => web3.eth.personal.sign(msg, walletId),
          "1d"
        );

        const tokenData = {
          token,
          timestamp: Date.now(),
        };





        $api.registerWithWallet(
          { walletId: walletId },
          this.onLoginSuccess.bind(this)
        );
        localStorage.setItem("walletToken", JSON.stringify(tokenData));
      } else {
        makeToast("metamask connected successfully", 3000);
      }
      // componentDidUpdate(prevProps, prevState) {
      //   const { web3, accounts } = this.state;
      //   if (web3 && accounts && (web3 !== prevProps.web3 || accounts !== prevProps.accounts)) {
      //     const netId = Number(web3.eth.net.getId());
      //     if (netId === Number(NETID)) {
      //       this.setState({ showLoad: true });
      //       this.loadData(accounts);
      //     } else {
      //       alert(NetIdMessage);
      //     }
      //   }
      // }

      const netId = await web3.eth.net.getId();
      console.log(netId, "netid");
      setNetId(netId);
      if (web3 && accounts) {
        const netId = Number(await web3.eth.net.getId());
        if (netId === Number(NETID)) {
          this.setState({ showLoad: true })
          this.loadData(accounts);
        }
        else {
          alert(NetIdMessage)
        }

      }
    } catch (error) {
      console.error("Error connecting to the wallet:", error);
    }
  };

  onLoginSuccess({ data, status }) {
    console.log(data, "status");
    if (status === 200) {
      // localStorage.setItem('authToken', data.AuthToken)
      makeToast("Token Updated with your wallet", 4000);

      $api.getBalance({}, this.afterBalance.bind(this));
    }
    if (status === 201) {
      // localStorage.setItem('authToken', data.AuthToken)
      makeToast(" Login with New wallet address ", 4000);
      $api.getBalance({}, this.afterBalance.bind(this));
    }
    if (status === 500) {
      setTimeout(localStorage.removeItem("walletToken"), 1000);
    }

    // else {
    //   console.log(status, "status");
    //   this.onLoginError(data)

    // }
  }
  afterBalance({ data, status }) {

    if (status) {
      this.props.dispatch(
        allActionDucer(PROFILE, { Balance: data?.virtual_balance })
      );
    }
  }

  openDepositModal = () => {
    this.setState({
      isModalOpen: true,
    });
  };
  openSubmitAppliationModal = () => {
    this.setState({
      isSubmitApplicationModal: true,
    });
  };
  openWithdrawalModal = () => {
    this.setState({
      isWithdrawalModal: true,
    });
  };
  openHistoryModal = () => {
    this.setState({
      isHistoryModal: true,
    });

    $api.getUserBetHistory(
      {
        startDate: moment().startOf("day").format(),
        endDate: moment().endOf("day").format(),
      },
      this.betHistoryData.bind(this)
    );
  };
  betHistoryData({ data, status }) {
    console.log(data, "India--");
    console.log(status, "status");
    if (status === 200) {
      this.setState({ betHistoryDatas: data, betHistoryLoader: false });
      console.log(this.state.betHistoryDatas, "datas");
    }
  }

  closeDepositModal = () => {
    this.setState({
      isModalOpen: false,
      depositAmount: ""
    });
  };
  closeSubmitApplicationModal = () => {
    this.setState({
      isSubmitApplicationModal: false,
      withdrawalAmount: ""
    });
  };
  closeWithdrawalModal = () => {
    this.setState({
      isWithdrawalModal: false,

    });
  };

  closeHistoryModal = () => {
    this.setState({
      isHistoryModal: false,
    });
  };

  handleSubmitApplicationAmount = () => {
    this.setState({ withdrawalAmount: "" })
    $api.withdrawalAmount({ withdrawalAmount: this.state.withdrawalAmount }, this.afterSubmitApplication.bind(this));
  }
  afterSubmitApplication({ data, status }) {
    console.log(data, status, "withdrawal");
    if (status === 201) {
      console.log(status, "withdwaral");
      makeToast(data?.message, 4000)
      this.setState({ isSubmitApplicationModal: false })
    }
  }
  handleDepositInputChange = (event) => {
    this.setState({
      depositAmount: event.target.value,
    });
  };
  handleWithdrawalInputChange = (event) => {
    this.setState({
      withdrawalAmount: event.target.value,
    });
  };

  approveDeposit = async (amount, web3, accounts, netId) => {
    if (!web3)
      return alert("Please connect wallet")

    if (NETID !== Number(netId))
      return alert(NetIdMessage)

    if (amount <= 0)
      return alert("Please input amount")

    const token = new web3.eth.Contract(IERC20ABI, DepositToken)
    const allowance = await token.methods.allowance(accounts[0], Merkle).call()

    if ((allowance / 10 ** DepositDecimals) > amount)
      return alert("Alredy approved")

    // approve max uint 256
    token.methods.approve(
      Merkle,
      "115792089237316195423570985008687907853269984665640564039457584007913129639935"
    ).send({ from: accounts[0] })
  }

  depositFunds = async (amount, web3, accounts, netId) => {
    if (!web3)
      return alert("Please connect wallet")

    if (NETID !== Number(netId))
      return alert(NetIdMessage)

    if (amount <= 0)
      return alert("Please input amount")

    const token = new web3.eth.Contract(IERC20ABI, DepositToken)
    const balance = await token.methods.balanceOf(accounts[0]).call()

    if (amount > balance / 10 ** DepositDecimals)
      return alert("You dont have enough balance")

    const allowance = await token.methods.allowance(accounts[0], Merkle).call()

    if (allowance / 10 ** DepositDecimals < amount)
      return alert("Please approve")

    const depositor = new web3.eth.Contract(MerkleABI, Merkle)

    depositor.methods.deposit(String(amount * 10 ** DepositDecimals))
      .send({ from: accounts[0] })
  }


  withdraw = async (e, web3, accounts, root, amount) => {
    e.preventDefault();
    const tokenData = JSON.parse(localStorage.getItem("walletToken"));
    // const config = {
    //   headers: {
    //     'Authorization': `Bearer ${tokenData.token}`
    //   }
    // };
    if (!web3) return alert("Please connect wallet");

    const proofData = await axios.get(API_ENDPOINT + "get-prof/" + root + "/" + accounts[0] + "/" + amount);
    const merkle = new web3.eth.Contract(MerkleABI, Merkle);
    const isClaimed = await merkle.methods.claimed(root, accounts[0]).call();

    if (isClaimed) {
      return alert("Already withdrawn");
    }

    const proof = proofData.data.result;
    merkle.methods.claim(
      proof,
      accounts[0],
      amount,
      root
    ).send({ from: accounts[0] });
  }

  loadData = async (accounts) => {
    try {

      const tokenData = JSON.parse(localStorage.getItem("walletToken"));
      // const config = {
      //   headers: {
      //     'Authorization': `Bearer ${tokenData.token}`
      //   }
      // };
      const rootsData = await axios.get(API_ENDPOINT + 'roots');
      const roots = rootsData.data.result;
      console.log(roots, "rootsdata");
      const withdraws = [];

      for (let i = 0; i < roots.length; i++) {
        const detailsData = await axios.get(API_ENDPOINT + 'get-data-by-root/' + roots[i]);
        const detailsArr = detailsData.data.result.data;

        const result = detailsArr.find(item => item.address === accounts[0]);

        if (result) {
          result.root = roots[i];
          withdraws.push(result);
        }
      }

      this.setState({
        withdraws: withdraws,
        showLoad: false,
        checked: true
      });

    } catch (e) {
      alert("Can't load data");
      console.log('error', e);
    }
  }




  renderDepositModal(web3, accounts, netId) {
    if (this.state.isModalOpen) {
      return (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: " 100%",
            background: "rgba(0, 0, 0, 0.5)" /* Transparent background */,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999 /* High z-index */,
          }}
        >
          <div className="sb-login-form-container sign-up">
            <div className="login-Modal">
              <span
                onClick={this.closeDepositModal}
                className="sb-login-form-close icon-icon-close-x"
              ></span>
              <div className="liquid-container ember-view">
                <div
                  className="liquid-child ember-view"
                  style={{ top: "0px", left: "0px", opacity: "1" }}
                >
                  <div
                    data-step="sign-in"
                    id="ember129058"
                    className="sb-login-step active ember-view"
                    style={{
                      background: "#fff",
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "8px,",
                      zIndex: 1000,
                    }}
                  >
                    {" "}
                    <div className="title">
                      <span>Deposit</span>
                    </div>
                    <div className="sb-login-form-wrapper">
                      <input
                        type="number"
                        placeholder="Enter deposit amount"
                        value={this.state.depositAmount}
                        onChange={this.handleDepositInputChange}
                      />
                      <div style={{ marginTop: "50px" }}>
                        <button
                          className="sb-account-btn btn-primary"
                          onClick={() => this.approveDeposit(
                            this.state.depositAmount,
                            web3,
                            accounts,
                            netId
                          )
                          }
                        >
                          Approve
                        </button>
                        <button
                          className="sb-account-btn btn-primary"
                          onClick={() => this.depositFunds(
                            this.state.depositAmount,
                            web3,
                            accounts,
                            netId
                          )
                          }
                          style={{ background: "orange", margin: "20px" }}
                        >
                          Deposit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  renderSubmitApplicationModal(web3, accounts, netId) {
    if (this.state.isSubmitApplicationModal) {
      return (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: " 100%",
            background: "rgba(0, 0, 0, 0.5)" /* Transparent background */,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999 /* High z-index */,
          }}
        >
          <div className="sb-login-form-container sign-up">
            <div className="login-Modal">
              <span
                onClick={this.closeSubmitApplicationModal}
                className="sb-login-form-close icon-icon-close-x"
              ></span>
              <div className="liquid-container ember-view">
                <div
                  className="liquid-child ember-view"
                  style={{ top: "0px", left: "0px", opacity: "1" }}
                >
                  <div
                    data-step="sign-in"
                    id="ember129058"
                    className="sb-login-step active ember-view"
                    style={{
                      background: "#fff",
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "8px,",
                      zIndex: 1000,
                    }}
                  >
                    {" "}
                    <div className="title">
                      <span>Submit Application</span>
                    </div>
                    <div className="sb-login-form-wrapper">
                      <input
                        type="number"
                        placeholder="Enter Withdrawal amount.."
                        value={this.state.withdrawalAmount}
                        onChange={this.handleWithdrawalInputChange}
                      />
                      <div style={{ marginTop: "50px" }}>

                        <button
                          className="sb-account-btn btn-primary"
                          onClick={this.handleSubmitApplicationAmount}

                          style={{ background: "orange", margin: "20px" }}
                        >
                          Submit Application
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
  renderWithdrawalModal(web3, accounts, netId) {
    if (this.state.isWithdrawalModal) {
      return (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: " 100%",
            background: "rgba(0, 0, 0, 0.5)" /* Transparent background */,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999 /* High z-index */,
          }}
        >
          <div className="sb-login-form-container sign-up">
            <div className="login-Modal">
              <span
                onClick={this.closeWithdrawalModal}
                className="sb-login-form-close icon-icon-close-x"
              ></span>
              <div className="liquid-container ember-view">
                <div
                  className="liquid-child ember-view"
                  style={{ top: "0px", left: "0px", opacity: "1" }}
                >
                  <div
                    data-step="sign-in"
                    id="ember129058"
                    className="sb-login-step active ember-view"
                    style={{
                      background: "#fff",
                      padding: "20px",
                      textAlign: "center",
                      borderRadius: "8px,",
                      zIndex: 1000,
                    }}
                  >
                    {" "}
                    <div className="title">
                      <span>Withdrawal</span>
                    </div>
                    <div className="sb-login-form-wrapper">
                      <div className='create section__padding'>
                        <div className="create-container">
                          <form className='writeForm' autoComplete='off'>
                            {
                              !web3
                                ? (
                                  <div className="formGroup">
                                    <label>Please connect wallet</label>
                                  </div>
                                )
                                : (
                                  <>
                                    {
                                      this.state.showLoad
                                        ? (
                                          <div className="formGroup">
                                            <label>Load data ...</label>
                                          </div>
                                        )
                                        :
                                        (
                                          this.state.withdraws.length > 0
                                            ? (
                                              this.state.withdraws.map(i => {
                                                return (
                                                  <div key={i.root}>
                                                    <p> Amount: {i.amount / 10 ** USDTDecimals}</p>
                                                    <button
                                                      onClick={(e) => this.withdraw(e, web3, accounts, i.root, i.amount)}
                                                      className='writeButton'
                                                    >
                                                      Withdraw
                                                    </button>
                                                  </div>
                                                );
                                              })
                                            )
                                            : (
                                              <>
                                                {
                                                  this.state.checked
                                                    ? (
                                                      <p style={{ color: "red" }}>Nothing to withdraw yet</p>
                                                    )
                                                    : null
                                                }
                                              </>
                                            )
                                        )
                                    }
                                  </>
                                )
                            }
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }
  handleFromDateChange = (event) => {
    this.setState({ datepickerFrom: event.target.value });
  };

  handleToDateChange = (event) => {
    this.setState({ datepickerTo: event.target.value });
  };
  searchBetHistoryResult() {
    let { datepickerFrom, datepickerTo } = this.state;
    this.setState({
      betHistoryLoader: true,
      datepickerFrom: "",
      datepickerTo: "",
    });
    $api.getUserBetHistory(
      { startDate: datepickerFrom, endDate: datepickerTo },
      this.betHistoryData.bind(this)
    );
  }
  renderHistoryModal() {
    if (this.state.isHistoryModal) {
      return (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: " 100%",
              background: "rgba(0, 0, 0, 0.5)" /* Transparent background */,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999 /* High z-index */,
            }}
          >
            <div className="sb-login-form-container">
              <div style={{ height: "100vh", width: "100vw" }}>
                <span
                  onClick={this.closeHistoryModal}
                  className="sb-login-form-close icon-icon-close-x"
                ></span>
                <div className="liquid-container ember-view">
                  <div
                    className="liquid-child ember-view"
                    style={{ top: "0px", left: "0px", opacity: "1" }}
                  >
                    <div
                      data-step="sign-in"
                      id="ember129058"
                      className="sb-login-step active ember-view"
                      style={{
                        background: "#fff",
                        padding: "20px",
                        textAlign: "center",
                        borderRadius: "8px,",
                        zIndex: 1000,
                      }}
                    >
                      <div className="title">
                        <span>Bets History</span>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <div style={{ display: "flex" }}>
                          <label htmlFor="fromDate">From:</label>
                          <input
                            type="date"
                            id="fromDate"
                            name="fromDate"
                            required
                            value={this.state.datepickerFrom}
                            onChange={this.handleFromDateChange}
                          />
                        </div>

                        <div style={{ display: "flex" }}>
                          <label htmlFor="toDate">To:</label>
                          <input
                            type="date"
                            id="toDate"
                            name="toDate"
                            required
                            value={this.state.datepickerTo}
                            onChange={this.handleToDateChange}
                          />
                        </div>
                        <div
                          className="input-group"
                          style={{ margin: "0 0 5px 5px" }}
                        >
                          <button
                            className="search"
                            onClick={() => {
                              this.searchBetHistoryResult();
                            }}
                          >
                            <span>Show</span>
                          </button>
                        </div>
                      </div>

                      {this.state.betHistoryLoader ? (
                        <BetHistoryLoader />
                      ) : (
                        <div style={{ marginTop: "50px" }}>
                          {this.state.betHistoryDatas.length ? (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                flexDirection: "column",
                                alignItems: "center",
                              }}
                            >
                              {this.state.betHistoryDatas.map((item) => {
                                return (
                                  <div
                                    key={item.id}
                                    style={{
                                      height: "auto",
                                      width: "80%",
                                      border: "1px solid grey",
                                      borderRadius: "5px",
                                      marginBottom: "10px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span style={{ marginLeft: "20px" }}>
                                        Match Id :-
                                      </span>
                                      <span style={{ marginRight: "20px" }}>
                                        {item.MatchId}
                                      </span>
                                    </p>
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span style={{ marginLeft: "20px" }}>
                                        Match Name :-
                                      </span>
                                      <span style={{ marginRight: "20px" }}>
                                        {item["Tournament.MatchName"]}
                                      </span>
                                    </p>
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span style={{ marginLeft: "20px" }}>
                                        Market Name :-
                                      </span>
                                      <span style={{ marginRight: "20px" }}>
                                        {item.MarketName}
                                      </span>
                                    </p>
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span style={{ marginLeft: "20px" }}>
                                        Contract Money :-
                                      </span>
                                      <span style={{ marginRight: "20px" }}>
                                        {item.Amount}
                                      </span>
                                    </p>
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span style={{ marginLeft: "20px" }}>
                                        Selection Name :-
                                      </span>
                                      <span style={{ marginRight: "20px" }}>
                                        {item.SelectionName}
                                      </span>
                                    </p>
                                    {item.status.toLowerCase() === "pending" ? (
                                      <p
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <span style={{ marginLeft: "20px" }}>
                                          Possible Win :-
                                        </span>
                                        <span style={{ marginRight: "20px" }}>
                                          {(item.possible_win.toFixed(2))}
                                        </span>
                                      </p>
                                    ) : null}
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span style={{ marginLeft: "20px" }}>
                                        Status :-
                                      </span>
                                      <span style={{ marginRight: "20px" }}>
                                        {item.status}
                                      </span>
                                    </p>
                                    {item.status.toLowerCase() === "win" ? (
                                      <p
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <span style={{ marginLeft: "20px" }}>
                                          You Won :-
                                        </span>
                                        <span style={{ marginRight: "20px" }}>
                                          {/* {item.possible_win} */}
                                          {item.possible_win.toFixed(2)}

                                        </span>
                                      </p>
                                    ) : null}
                                    {item.status.toLowerCase() === "lose" ? (
                                      <p
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <span style={{ marginLeft: "20px" }}>
                                          You Lose :-
                                        </span>
                                        <span style={{ marginRight: "20px" }}>
                                          {item.Amount}
                                        </span>
                                      </p>
                                    ) : null}
                                    <p
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <span style={{ marginLeft: "20px" }}>
                                        Created At :-
                                      </span>
                                      <span style={{ marginRight: "20px" }}>
                                        {moment(item.updatedAt).format(
                                          "YYYY-MM-DD"
                                        )}
                                      </span>
                                    </p>
                                  </div>
                                );
                              }).reverse()}
                            </div>
                          ) : (
                            <div>
                              <h1>No Record Found .......</h1>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {/* <BetHistory /> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
    return null;
  }

  validate() {
    if (this.searchTicketInput && this.recaptchaValue) {
      this.setState({ searchingTicket: true });
      var val = this.searchTicketInput.value,
        rval = this.recaptchaValue.value;

      if (val !== "" && rval !== "") {
        this.props.validate(val, rval, this.showCheckResult.bind(this));

        this.searchTicketInput.value = "";
        this.recaptchaValue.value = "";
      }
    }
  }

  valChange(e) {
    let val = e.target.value;
    if (val !== "") this.setState({ showRecaptcha: true });
    else this.setState({ showRecaptcha: false });
  }

  setLang(langData) {
    if (this.props.appState.lang !== langData.sysValue) {
      this.props.dispatch(allActionDucer(LANG, { lang: langData.sysValue }));
      new Promise((resolve, reject) => {
        setCookie("think_var", langData.cookieValue, "/");
        resolve();
      }).then(() => {
        window.location.reload();
      });
    }
  }

  openBetslipSettings() {
    this.props.dispatch(
      allActionDucer(SPORTSBOOK_ANY, {
        showBetslipSettings: !this.props.sportsbook.showBetslipSettings,
        animation: true,
        showTicketBetSearch: false,
      })
    );
    if (this.animationTimeout) clearTimeout(this.animationTimeout);
    this.animationTimeout = setTimeout(() => {
      this.props.dispatch(allActionDucer(SPORTSBOOK_ANY, { animation: false }));
    });
  }

  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = "";
      this.setState({ showFullInput: false });
      this.props.dispatch(
        allActionDucer(SPORTSBOOK_ANY, {
          searchData: {},
          searchDataC: {},
          searching: false,
        })
      );
    }
  }

  showCheckResult(data) {
    this.props.dispatch(
      allActionDucer(SPORTSBOOK_ANY, {
        checkResult: data.data.details
          ? data.data.details
          : { StateName: "Ticket number not found" },
        searchingTicket: false,
      })
    );

    window.grecaptcha.reset();
    this.setState({ showRecaptcha: false });
  }

  render() {
    const {
      appState,
      profile,
      searchDataC,
      searchData,
      searching,
      activeView,
      Prematch,
      Live,
      checkResult,
      searchingTicket,
      site_recaptch_key,
      config,
      oddType,
    } = this.props,
      { time, showRecaptcha, showFullInput } = this.state,
      searchGame = (event) => {
        var d = {},
          type = activeView === "Live" ? Live : Prematch;
        d[appState.lang] = event.target.value;
        if (event.target.value.length > 2) {
          this.props.dispatch(
            allActionDucer(SEARCHING_GAME, { searchData: {}, searching: true })
          );
          this.props.sendRequest({
            command: "get",
            params: {
              source: "betting",
              what: {
                sport: ["id", "name", "alias"],
                region: ["id", "name", "alias"],
                competition: [],
                game: "type start_ts team1_name team1_id team2_name team2_id id".split(
                  " "
                ),
              },
              where: {
                sport: { type: { "@ne": 1 } },
                game: {
                  type: { "@in": type },
                  "@or": [
                    {
                      team1_name: {
                        "@like": d,
                      },
                    },
                    {
                      team2_name: {
                        "@like": d,
                      },
                    },
                  ],
                },
              },
              subscribe: false,
            },
            rid: 6,
          });
          let s = {
            source: "betting",
            what: {
              competition: [],
              region: ["alias", "name", "id"],
              game: ["type", "start_ts", "team1_name", "team2_name", "id"],
              sport: ["id", "name", "alias"],
            },
            where: {
              competition: {
                name: {
                  "@like": d,
                },
              },
            },
          };
          this.props.sendRequest({
            command: "get",
            params: s,
            rid: "6.5",
          });
        } else {
          this.props.dispatch(
            allActionDucer(SEARCHING_GAME, {
              searchData: {},
              searchDataC: {},
              searching: false,
            })
          );
        }
      };
    let searchResult = { game: [], competition: [] },
      hasGameResult =
        Object.keys(searchData).length > 0 &&
        Object.keys(searchData.sport).length > 0,
      hasCompetionsResult =
        Object.keys(searchDataC).length > 0 &&
        Object.keys(searchDataC.sport).length > 0,
      emptyResult =
        (Object.keys(searchData).length > 0 &&
          Object.keys(searchData.sport).length < 1) ||
        (Object.keys(searchDataC).length > 0 &&
          Object.keys(searchDataC.sport).length < 1);

    if (hasGameResult) {
      searchResult.game = [];
      Object.keys(searchData.sport).forEach((sport) => {
        searchResult.game.push(searchData.sport[sport]);
      });
    }
    if (hasCompetionsResult) {
      searchResult.competition = [];
      Object.keys(searchDataC.sport).forEach((sport) => {
        searchResult.competition.push(searchDataC.sport[sport]);
      });
    }

    return (
      <Web3Context.Consumer>
        {(props) => {
          if (props.netId) {
            localStorage.setItem("netId", props.netId);
          } else {
            localStorage.removeItem("netId");
          }
          return (
            <>
              {this.renderDepositModal(props.web3, props.accounts, props.netId)}
              {this.renderHistoryModal()}
              {this.renderSubmitApplicationModal(props.web3, props.accounts, props.netId)}
              {this.renderWithdrawalModal(props.web3, props.accounts, props.netId)}


              <div
                className={`header-container ${this.props.casinoMode.playMode && "fullscreen"
                  }`}
              >
                <div className="header-body bg-primary">
                  <div className="header-inner">
                    <div className="header-row main">
                      <div className="header-col left websiteName">
                        <div className="brand">
                          {/* <div className="brand-name"></div> */}
                          <div className="brand-logo">
                            <NavLink to="/">
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "5px",
                                }}
                              >
                                <img
                                  src={favicon}
                                  style={{ height: "28px", width: "28px" }}
                                />
                                <h1 style={{ color: "white" }}>Drives</h1>
                              </div>
                            </NavLink>
                          </div>
                        </div>
                      </div>
                      <div className="header-col right">
                        <div className="nav-controls">
                          {(!JSON.parse(localStorage.getItem("walletToken")) ||
                            !props.netId) &&
                            !appState.isLoggedIn ? (
                            <React.Fragment>
                              <div>
                                {props.web3
                                  ? props.netId && NETID !== props.netId
                                    ? (makeToast(NetIdMessage),
                                      props.setNetId(null))
                                    : null
                                  : null}
                              </div>
                              {/* <div

                                className="login"
                                onClick={() => this.openFormModal("login")}
                              >
                                <button style={{ borderRadius: "5px" }}>sign in</button>
                              </div> */}
                              {/* <div
                              className="register"
                              onClick={() => this.openFormModal("register")}
                            >
                              <button
                                style={{
                                  backgroundColor: "green",
                                  borderRadius: "5px",
                                }}
                              >
                                Register
                              </button>
                            </div> */}
                              <div
                                onClick={() =>
                                  this.connectWallet(
                                    props.setWeb3,
                                    props.setNetId,
                                    props.setAccounts,
                                    props.web3,
                                    props.accounts
                                  )
                                }
                              >
                                <button
                                  style={{
                                    backgroundColor: "orange",
                                    borderRadius: "5px",
                                    border: "0px",
                                    color: "black",
                                    padding: "3px 5px",
                                    cursor: "pointer",
                                    fontWeight: 100,
                                  }}
                                >
                                  Connect Wallet
                                </button>
                              </div>
                            </React.Fragment>
                          ) : (
                            <div tabIndex={0} className="user-account-buttons">
                              <div className="balance">
                                {parseFloat(profile.Balance).toFixed(2)}
                              </div>
                              {profile?.userData?.UserProfile?.avatar ? (
                                <div
                                  style={{
                                    position: "relative",
                                    display: "block",
                                    width: "39px",
                                    backgroundSize: " 100% 100%",
                                    borderRadius: "100%",
                                    cursor: "pointer",

                                    flexShrink: 0,
                                    position: "absolute",
                                    right: "-30px",
                                    height: "38px",
                                    border: " 1px solid #08b981",
                                  }}
                                >
                                  <img
                                    src={`${profile?.userData?.UserProfile?.avatar}`}
                                    style={{
                                      height: "38px",
                                      width: "38px",
                                      borderRadius: "50%",
                                    }}
                                  />
                                </div>
                              ) : (
                                <div
                                  className="user-avatar"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                ></div>
                              )}

                              <div className="user-account-menu">
                                <ul>
                                  {appState.isLoggedIn && (
                                    <li onClick={() => this.openModal(1)}>
                                      <span className="profile-icon icon-sb-edit-profile"></span>
                                      <span>Profile</span>
                                    </li>
                                  )}

                                  <li onClick={this.openHistoryModal}>
                                    <span className="profile-icon icon-sb-my-bets"></span>
                                    <span>Bets History</span>
                                  </li>

                                  <li onClick={this.openDepositModal}>
                                    <span className="profile-icon icon-sb-deposit"></span>
                                    <span>Deposit</span>
                                  </li>


                                  <li onClick={this.openSubmitAppliationModal}>
                                    <span className="profile-icon icon-sb-wallet"></span>
                                    <span>Submit Application</span>
                                  </li>
                                  <li onClick={this.openWithdrawalModal}>
                                    <span className="profile-icon icon-sb-wallet"></span>
                                    <span>withdrawal </span>
                                  </li>


                                  {appState.isLoggedIn && (
                                    <li onClick={() => this.openModal(1, 2)}>
                                      <span className="profile-icon icon-sb-edit-profile"></span>
                                      <span>Change Password</span>
                                    </li>
                                  )}
                                  {appState.isLoggedIn && (
                                    <li
                                      onClick={this.logOut}
                                      className="logout"
                                    >
                                      <span className="profile-icon icon-sb-log-out"></span>
                                      <span>Log out</span>
                                    </li>
                                  )}
                                  {props.web3 && (
                                    <li
                                      onClick={this.walletlogOut}
                                      className="logout"
                                    >
                                      <span className="profile-icon icon-sb-log-out"></span>
                                      <span>Log out</span>
                                    </li>
                                  )}
                                </ul>
                              </div>
                            </div>
                          )}
                          <div
                            style={{ marginLeft: "20px" }}
                            className="hambarger-menu"
                            onClick={() =>
                              this.props.dispatch(
                                allActionDucer(MODAL, { show_drawer: true })
                              )
                            }
                          >
                            <svg
                              viewBox="0 0 100.00000762939453 59.1787109375"
                              version="1.1"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <g transform="scale(0.15163967806185535)">
                                <path
                                  d="M876.5,662.5"
                                  transform="translate(-217.04200744628906,-292.625)"
                                ></path>
                                <g>
                                  <g>
                                    <path
                                      fill="#fff"
                                      d="M252.542,363.625h504.917c19.604,0,35.5-15.912,35.5-35.5c0-19.622-15.896-35.5-35.5-35.5H252.542    c-19.605,0-35.5,15.878-35.5,35.5C217.042,347.713,232.937,363.625,252.542,363.625z"
                                      transform="translate(-217.04200744628906,-292.625)"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      fill="#fff"
                                      d="M757.459,452.236H252.542c-19.605,0-35.5,15.913-35.5,35.5c0,19.622,15.895,35.5,35.5,35.5h504.917    c19.604,0,35.5-15.878,35.5-35.5C792.959,468.149,777.063,452.236,757.459,452.236z"
                                      transform="translate(-217.04200744628906,-292.625)"
                                    ></path>
                                  </g>
                                  <g>
                                    <path
                                      fill="#fff"
                                      d="M757.459,611.883H252.542c-19.605,0-35.5,15.878-35.5,35.5c0,19.587,15.895,35.5,35.5,35.5h504.917    c19.604,0,35.5-15.913,35.5-35.5C792.959,627.761,777.063,611.883,757.459,611.883z"
                                      transform="translate(-217.04200744628906,-292.625)"
                                    ></path>
                                  </g>
                                </g>
                              </g>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="header-row secondary">
                      <div className="header-col col-sm-12">
                        <div
                          className={`nav-links ${activeView === "Live" || activeView === "Prematch"
                            ? "partial"
                            : "full"
                            }`}
                        >
                          <div className="link">
                            <NavLink exact to="/">
                              <span>Home</span>
                            </NavLink>
                          </div>
                          <div className="link">
                            <NavLink to="/sports/prematch">
                              <span>Prematch</span>
                            </NavLink>
                          </div>
                          <div className="link">
                            <NavLink to="/sports/live">
                              <span>Live</span>
                            </NavLink>
                          </div>

                          {/* <div className="link"><NavLink to="/virtual"><span>Virtual Sports</span></NavLink></div> */}
                          {/* <div className="link new"><NavLink to="/roulette"><span className="text-warning" style={{fontWeight:"900"}}>Roulette</span></NavLink></div>
                                          <div className="link"><NavLink to="/slot-games"><span>Slot Games</span></NavLink></div>
                                          <div className="link"><NavLink to="/news"><span>News</span></NavLink></div> */}
                          {/* <div className="link"><NavLink to="/sports/result"><span>Match Results</span></NavLink></div> */}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Web3Context.Consumer>
    );
  }
}

export default withRouter(Header);
