import React from "react";
import API from "../../services/api";
import "../style.css";
import moment from "moment";
import { Switch, Route } from "react-router-dom";
import SingleJob from "./jobview";
import Helmet from "react-helmet";
const $api = API.getInstance();

export default class Careers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: [] };
  }
  componentDidMount() {
    $api.loadAllJobs().then(({ data }) => {
      this.setState({ data: data.data });
    });
  }
  openSingleJob(e, job) {
    e.preventDefault();
    this.props.history.push(
      `${this.props.match.path}/${job.jobname
        .split(" ")
        .join("-")
        .toLowerCase()}`,
      { id: job.id }
    );
  }
  render() {
    const { data } = this.state;
    return (
      <div className="jobs col-sm-12">
        <Helmet>
          <title>Job Oppurtunities- Drives</title>
        </Helmet>
        <Switch>
          <Route
            exact
            path={this.props.match.path}
            render={(props) => (
              <div className="job-listing-container col-sm-12">
                <div
                  className="col-sm-8 alice-bg padding-top-70 padding-bottom-70"
                  style={{ width: "100%" }}
                >
                  <div className="container">
                    <div className="row col-sm-12">
                      <div className="col-sm-12">
                        <div className="breadcrumb-area">
                          <h1>Job Listing</h1>
                          <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                              <li className="breadcrumb-item">
                                <a href="#">Home</a>
                              </li>
                              <li
                                className="breadcrumb-item active"
                                aria-current="page"
                              >
                                Job Listing
                              </li>
                            </ol>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="filtered-job-listing-wrapper col-sm-12">
                  <div className="job-filter-result">
                    {data.map((job, ind) => {
                      return (
                        <div key={ind} className="job-list">
                          <div className="body">
                            <div className="content col-sm-9">
                              <h4>
                                <a
                                  href="#"
                                  onClick={(e) => this.openSingleJob(e, job)}
                                >
                                  {job.jobname}
                                </a>
                              </h4>
                              <div className="info">
                                <span className="office-location">
                                  <a href="#">{job.location}</a>
                                </span>
                                <span className="job-type part-time">
                                  <a href="#">Full Time</a>
                                </span>
                              </div>
                            </div>
                            <div className="more col-sm-3">
                              <div className="buttons">
                                <a
                                  href="#"
                                  onClick={(e) => this.openSingleJob(e, job)}
                                  className="button"
                                  data-toggle="modal"
                                  data-target="#apply-popup-id"
                                >
                                  Apply Now
                                </a>
                              </div>
                              <p className="deadline">
                                {moment.unix(job.addtime).fromNow()}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          ></Route>
          <Route
            path={`${this.props.match.path}/:jobname`}
            render={(props) => <SingleJob {...props} />}
          />
        </Switch>
      </div>
    );
  }
}
