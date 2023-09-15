import React from "react";
import { withRouter, Link } from "react-router-dom";
import "./styles.css";
import { MODAL, LANG } from "../../actionReducers";
import { allActionDucer } from "../../actionCreator";
import { setCookie } from "../../common";
import favicon from "../../images/favicon.jpg"
const DrawerMenu = (props) => {
  const setLang = (langData) => {
      if (props.appState.lang !== langData.sysValue) {
        props.dispatch(allActionDucer(LANG, { lang: langData.sysValue }));
        new Promise((resolve, reject) => {
          setCookie("think_var", langData.cookieValue, "/");
          resolve();
        }).then(() => {
          window.location.reload();
        });
      }
    },
    closeModal = () =>
      props.dispatch(allActionDucer(MODAL, { show_drawer: false }));

  return (
    <div className="layers-container">
      <div className="layer">
        <div
          className={`off-canvas ${props.show_drawer ? "open" : ""}`}
          style={{ display: "flex", background: "#2d2c2c94" }}
          onClick={closeModal}
        >
          <div className="off-canvas-scroll-container">
            <div className="menu-body" onClick={(e) => e.stopPropagation()}>
              <span
                className="sb-login-form-close uci-close"
                onClick={closeModal}
              ></span>
              <div className="liquid-container">
                <div className="brand">
                  <div className="brand-logo">
                    <Link to="/" onClick={closeModal}>
                      <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:"5px"}}>
                      <img src={favicon} style={{height:"25px",width:"25px"}}/>
                      <h1 style={{ color: "white" }}>Drives</h1>
                      </div>
                      
                    </Link>
                  </div>
                </div>
                <div className="drawer-links-container">
                  <div className="links">
                    <div className="link">
                      <Link to="/sports/prematch" onClick={closeModal}>
                        Prematch
                      </Link>
                    </div>
                    <div className="link">
                      <Link to="/sports/live" onClick={closeModal}>
                        Live-in-play
                      </Link>
                    </div>
                    {/* <div className="link"><Link to="/sports/result" onClick={closeModal}>Match Results</Link></div> */}
                    {/* <div className="link"><Link to="/slot-games" onClick={closeModal}>Slot Games</Link></div>
                      <div className="link"><Link to="/roulette" onClick={closeModal}>Roulette</Link></div>
                      <div className="link"><Link to="/news" onClick={closeModal}>News</Link></div> */}
                    {/* <div className="link"><Link to="/virtual" onClick={closeModal}>Virtual Sports</Link></div> */}
                    <div className="link">
                      <Link to="/promotions" onClick={closeModal}>
                        <div className="">
                          <span className="icon-sb-bonuses"></span>
                          <i className="notice show-notice"></i>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
                <div className="language-container">
                  <div
                    className="lang"
                    style={{ position: "relative", display: "flex" }}
                  >
                    <div
                      tabIndex="0"
                      className="lang-custom-select custom-select"
                      style={{ border: "none" }}
                    >
                      <div className="selected-lang custom-select-style">
                        <span
                          className={`lang-icon ${props.appState.lang}-lang`}
                        ></span>
                        <span
                          className="lang-text"
                          data-lang={
                            props.appState.lang === "eng"
                              ? "ENGLISH"
                              : props.appState.lang === "fra"
                              ? "FRANÇAIS"
                              : props.appState.lang === "zhh"
                              ? "中文"
                              : ""
                          }
                        ></span>
                        <i className="icon-icon-arrow-down"></i>
                      </div>
                      <ul className="custom-select-style custom-select-market-types">
                        <li
                          className={`selected-lang ${
                            props.appState.lang === "eng" && "current"
                          }`}
                          onClick={() =>
                            setLang({ cookieValue: "en-gb", sysValue: "eng" })
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
                            props.appState.lang === "fra" && "current"
                          }`}
                          onClick={() =>
                            setLang({ cookieValue: "fr-fr", sysValue: "fra" })
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
                            props.appState.lang === "zhh" && "current"
                          }`}
                          onClick={() =>
                            setLang({ cookieValue: "zh-cn", sysValue: "zhh" })
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(DrawerMenu);
