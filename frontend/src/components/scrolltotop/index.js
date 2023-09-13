import React, { useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom'; 
import $ from 'jquery'

function ScrollToTop({ history, children }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
        $('body').animate({ scrollTop: 0 }, 200);
    });
    return () => {
      unlisten();
    }
  }, [history]);

  return <Fragment>{children}</Fragment>;
}

export default withRouter(ScrollToTop);