import React from "react";
import "./footer.css";
import moment from "moment-timezone";
import Skrill from "../../images/Skrill-Logo.svg";
import Neteller from "../../images/NETELLER.png";
import BitCoin from "../../images/bitcoin.svg";
import Ecopayz from "../../images/ecopayz.png";
import AppleStore from "../../images/storeIOS.png";
import PlayStore from "../../images/GoogleplayStore.png";
import { NavLink } from "react-router-dom";
import { LANG } from "../../actionReducers";
import { allActionDucer } from "../../actionCreator";
import { setCookie } from "../../common";
export default class Footer extends React.Component {
  constructor(props) {
    super(props);
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
  render() {
    const { appState, activeView } = this.props;
    return (
      <div
        className="footer-container"
        style={
          activeView === "Prematch" || activeView === "Live"
            ? { display: "none" }
            : {}
        }
      >
        <div className="footer-body">
          <div className="footer-inner">
            <div className="footer-row top">
              <div className="footer-col">
                <div className="footer-col-content">
                  <div className="title">About</div>
                  {/* <div className="item"><NavLink exact to="/about-us"><span>About us</span></NavLink></div> */}
                  <div className="item">
                    <NavLink exact to="/responsible-gaming">
                      <span>Responsible Gaming</span>
                    </NavLink>
                  </div>
                  <div className="item">
                    <NavLink exact to="/afiliate-program">
                      <span>Affiliate Program</span>
                    </NavLink>
                  </div>
                </div>
              </div>

              <div className="footer-col">
                <div className="footer-col-content">
                  <div className="title">Drives</div>
                  {/* <div className="item">RNG Certificate</div> */}
                  <div className="item">
                    {" "}
                    <NavLink exact to="/general-terms-and-conditions">
                      <span>General Terms &amp; Conditions</span>
                    </NavLink>
                  </div>
                  <div className="item">
                    <NavLink exact to="/privacy-policy">
                      <span>Privacy Policy</span>
                    </NavLink>
                  </div>
                  <div className="item">
                    <NavLink exact to="/cookies-policy">
                      <span>Cookies Policy</span>
                    </NavLink>
                  </div>
                  <div className="item">
                    <NavLink exact to="/contact-us">
                      <span>Contact Us</span>
                    </NavLink>
                  </div>
                  {/* <div className="item"><NavLink exact to="/careers"><span>Careers</span></NavLink></div> */}
                  {/* <div className="item"><NavLink exact to="/betting-new"><span>Responsible Gaming</span></NavLink></div> */}
                </div>
              </div>

              <div className="footer-col" style={{ flex: "1 1 100%" }}>
                <div
                  className="footer-col-content"
                  style={{
                    flex: "1 1 100%",
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <div className="title" style={{ display: "flex" }}>
                    Language
                  </div>
                  <div
                    className="lang"
                    style={{ position: "relative", display: "flex" }}
                  >
                    <div
                      tabIndex="0"
                      className="lang-custom-select custom-select"
                    >
                      <div className="selected-lang custom-select-style">
                        <span
                          className={`lang-icon ${appState.lang}-lang`}
                        ></span>
                        <span
                          className="lang-text"
                          data-lang={
                            appState.lang === "eng"
                              ? "ENGLISH"
                              : appState.lang === "fra"
                              ? "FRANÇAIS"
                              : appState.lang === "zhh"
                              ? "中文"
                              : ""
                          }
                        ></span>
                        <i className="icon-icon-arrow-down"></i>
                      </div>
                      <ul className="custom-select-style custom-select-market-types">
                        <li
                          className={`selected-lang ${
                            appState.lang === "eng" && "current"
                          }`}
                          onClick={() =>
                            this.setLang({
                              cookieValue: "en-gb",
                              sysValue: "eng",
                            })
                          }
                        >
                          {" "}
                          <span className="lang-icon eng-lang"></span>
                          <span
                            className="lang-text"
                            data-lang="English"
                          ></span>
                        </li>
                        <li
                          className={`selected-lang ${
                            appState.lang === "fra" && "current"
                          }`}
                          onClick={() =>
                            this.setLang({
                              cookieValue: "fr-fr",
                              sysValue: "fra",
                            })
                          }
                        >
                          <span className="lang-icon fra-lang"></span>
                          <span
                            className="lang-text"
                            data-lang="Français"
                          ></span>
                        </li>
                        <li
                          className={`selected-lang ${
                            appState.lang === "zhh" && "current"
                          }`}
                          onClick={() =>
                            this.setLang({
                              cookieValue: "zh-cn",
                              sysValue: "zhh",
                            })
                          }
                        >
                          <span className="lang-icon zhh-lang"></span>
                          <span className="lang-text" data-lang="中文"></span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div className="footer-col" style={{ flex: "1 1 100%" }}>
                <div
                  className="footer-col-content"
                  style={{ alignItems: "center" }}
                >
                  <div className="age-strict">
                    <strong>18+</strong>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-row bottom">
              <div className="footer-col">
                <p className="brag">
                  Drives welcome punters with highs quality types of both online
                  and offline sports, virtual games and slot games, featuring
                  differentiated high odds, intensive risk management and
                  continuously optimized user experience.
                </p>
                <p className="copy-right">
                  Copyright © {moment().format("YYYY")} Drives. All Rights
                  Reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
