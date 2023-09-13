import React, { useEffect, useState } from "react";
import Helmet from "react-helmet";
import { getCookie } from "../../common";
import ReactGA from "react-ga";
export const Roulette = (props) => {
  const iframeRef = React.createRef(),
    [loading, setLoaded] = useState(true),
    onLoadFinish = () => {
      setLoaded(false);
    };
  let authorize = "";
  if (getCookie("AuthToken") && getCookie("id")) {
    authorize = `&authToken=${encodeURIComponent(
      getCookie("AuthToken")
    )}&UserId=${encodeURIComponent(getCookie("id"))}`;
  }
  useEffect(() => {
    iframeRef.current.addEventListener("load", function () {
      onLoadFinish(this);
    });
    props.bulkUnsubscribe([], true);
  }, []);
  ReactGA.pageview("/roulette");
  return (
    <div className="col-md-12 roulette-container">
      <Helmet>
        <title>Roulette - Drives</title>
      </Helmet>
      <iframe
        ref={iframeRef}
        title="Roulette Iframe"
        style={{ width: "100%", border: "none", display: loading && "none" }}
        className="col-md-12 iframe"
        src={`https://www.africabeting.com/ghana/m/#/roulette?partnerID=100001${authorize}`}
      ></iframe>
      <div
        className="no-results-container sb-spinner"
        style={{ display: !loading && "none" }}
      >
        <span
          className="btn-preloader sb-preloader"
          style={{ width: "100px", height: "100px" }}
        ></span>
      </div>
    </div>
  );
};
