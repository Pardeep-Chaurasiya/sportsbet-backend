import React from 'react'
import { onFormInputFocus, onFormInputFocusLost } from '../../common'
import PhoneInput from 'react-phone-input-2'
import { validateSMSCode, validatePhone, validatePassword } from '../../utils/index'
export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mobilenumber: '',
      smscode: '',
      countdown: 60,
      howPass: false,
      c_password: '',
      password: '',
      formStep: 1,
      dialing_code: ""
    }
    console.log(this.state.dialing_code, "diadfacode");
  }
  sendSMS() {
    this.setState({ formStep: 2 })
    const dialing_code = this.state.dialing_code
    const number = this.state.mobilenumber.split(dialing_code)[1]

    if (number !== '') {
      console.log(number, dialing_code, "gopiiiiiii");
      this.setState({ canResend: false })
      this.props.sendTextMSG(number, dialing_code, this.onSMSSend.bind(this))
    }
  }
  resetPass() {
    const { mobilenumber, smscode, password } = this.state
    this.props.reset({ mobilenumber: mobilenumber, sms: smscode, password: password })
  }
  onSMSSend() {
    this.startCountDown()
    this.setState({ formStep: 2 })
  }

  canResetPass() {
    const { mobilenumber, smscode, c_password, password } = this.state
    return !this.comparePasswords() || (smscode === '' || !validateSMSCode(smscode)) || c_password === '' || (password === '' || !validatePassword(password)) || (mobilenumber === '' || !validatePhone(mobilenumber))
  }
  startCountDown() {
    this.setState({ countdown: 60 })
    this.countdownTimer = setInterval(() => this.timer(), 1000)
  }
  timer() {
    let count = this.state.countdown
    if (count >= 1) this.setState({ countdown: count - 1 })
    else {
      clearInterval(this.countdownTimer)
      this.setState({ canResend: true })
    }
  }
  newPassword() {
    this.setState({ formStep: 3 })
  }
  onInputChange(e) {
    let $el = e.target, newState = {}
    newState[$el.name] = $el.value
    this.setState(newState)
  }
  comparePasswords() {
    const { password, c_password } = this.state
    return password.trim() === c_password.trim()
  }
  back() {
    clearInterval(this.countdownTimer)
    this.setState({ formStep: 1, countdown: 60, canResend: false })
  }
  render() {
    const { mobilenumber, smscode, countdown, canResend, formStep, c_password, showPass, password } = this.state, { attemptingPassReset, resetHasError, resetErrorMSG, sendingSMS, verifyingSMS, smsHasError, smsErrorMSG } = this.props
    return (
      <div className="sb-login-form-container forgot-password">
        <div>
          <span onClick={this.props.onClose} className="sb-login-form-close icon-icon-close-x"></span>
          <div className="liquid-container ember-view" >
            <div className="liquid-child ember-view" style={{ top: "0px", left: "0px", opacity: "1" }}>
              <div data-step="forgot-password" className="sb-login-step active ember-view">
                <span onClick={() => this.props.changeForm({ formType: 'login' })} className="sb-back-to-login icon-icon-arrow-left step-change"></span>
                <div className="title">
                  <span>Forgot password?</span>
                </div>

                <div className="sb-login-form-wrapper">
                  {
                    formStep === 1 ?
                      <React.Fragment>
                        <div className="desc">
                          <span>Enter your registered Mobile Number below to recieve verification SMS code.</span>
                        </div>
                        <div className={`form ${formStep !== 1 ? 'animated fadeOut' : 'fadeIn animated'}`}>
                          <div id="ember487079" className="ember-view"><div className="form-group ">
                            <div className="form-element empty">
                              <div className="input-wrapper  show-password-switcher">
                                <div id="ember487080" className="field-icons-container ember-view">


                                </div>
                                <PhoneInput
                                  country={"al"}
                                  inputProps={{
                                    name: "phoneNumber",
                                    required: true,

                                  }}
                                  value={mobilenumber}
                                  onChange={(mobilenumber, country) => {

                                    this.setState({
                                      mobilenumber,
                                      dialing_code: country.dialCode,
                                    })
                                  }
                                  }
                                />
                                {/* <input autoFocus={true} value={mobilenumber} onChange={this.onInputChange.bind(this)} name="mobilenumber" className={`${mobilenumber !== '' && !validatePhone(mobilenumber) && 'error'} ember-text-field ember-view`} type="text" onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" /> */}
                                {/* <span className="placeholder placeholder-inactive">Mobile Number</span> */}

                              </div>
                            </div>
                          </div>
                          </div>
                          <div className="error-box">
                            <span>{smsHasError ? smsErrorMSG : ''}</span>
                          </div>
                          <button disabled={mobilenumber === '' || !validatePhone(mobilenumber)} onClick={this.sendSMS.bind(this)} className="sb-account-btn btn-primary">
                            {sendingSMS ?
                              <div className="no-results-container sb-spinner">
                                <span className="btn-preloader sb-preloader"></span>
                              </div>
                              : 'Verify Account'}
                          </button>
                        </div>
                      </React.Fragment>
                      :
                      <div className={` ${formStep !== 2 ? 'animated fadeOut' : 'animated fadeIn'}`} id="second-form">
                        <p className="recaptcha-version-3" style={{ fontSize: '20px' }}>
                          Verify your Phone Number
                        </p>
                        <span>We have send an SMS code to the number : {mobilenumber}</span>
                        <p onClick={this.back.bind(this)} className="recaptcha-version-3" style={{ cursor: 'pointer' }}>
                          Not your phone number ?
                        </p>
                        <div className="ember-view col-sm-12" style={{ display: 'flex', justifyContent: 'center' }}>
                          <div className="form-group ">
                            <div className="form-element empty">
                              <div className="input-wrapper  show-password-switcher">
                                <div id="ember487080" className="field-icons-container ember-view">
                                  <div className="password-visibility-block">
                                    {canResend ?
                                      <span onClick={this.sendSMS.bind(this)} title="resend" className="password-visibility icon icon-sb-refresh"></span>
                                      : <span title="count down" className="password-visibility count-down">{countdown}</span>}
                                  </div>

                                </div>
                                <input autoFocus={true} name="smscode" value={smscode} className="ember-text-field ember-view" type="text" onChange={this.onInputChange.bind(this)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                <span className="placeholder placeholder-inactive">SMS CODE</span>

                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group required">
                          <div className="form-element empty">
                            <div className="input-wrapper  show-password-switcher">
                              <div className="field-icons-container ember-view">
                                <div className="password-visibility-block" onClick={this.toggleShow}>
                                  <span className={`password-visibility icon ${showPass ? 'icon-sb-hide' : 'icon-sb-show'}`}></span>
                                </div>

                              </div>
                              <input disabled={attemptingPassReset} name="password" value={password} required className={`${(password !== '' && !validatePassword(password)) ? 'error animated pulse' : ''} ember-text-field ember-view`} type={showPass ? "text" : "password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange.bind(this)} />
                              <span className="placeholder placeholder-inactive">New Password</span>

                            </div>
                          </div>
                        </div>
                        <div className="form-group required">
                          <div className="form-element empty">
                            <div className="input-wrapper  show-password-switcher">
                              <div className="field-icons-container ember-view">
                                <div className="password-visibility-block" onClick={this.toggleShow}>
                                  <span className={`password-visibility icon ${showPass ? 'icon-sb-hide' : 'icon-sb-show'}`}></span>
                                </div>

                              </div>
                              <input disabled={attemptingPassReset} name="c_password" value={c_password} required className={`${(c_password !== '' && !this.comparePasswords()) ? 'error animated pulse' : ''} ember-text-field ember-view`} type={showPass ? "text" : "password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange.bind(this)} />
                              <span className="placeholder placeholder-inactive">Confirm Password</span>

                            </div>
                          </div>
                        </div>
                        <div className="error-box">
                          <span>{resetHasError ? resetErrorMSG : ''}</span>
                        </div>
                        <button disabled={this.canResetPass()} onClick={this.resetPass.bind(this)} className="sb-account-btn btn-primary submit-join-now " type="submit">
                          {attemptingPassReset ?
                            <div className="no-results-container sb-spinner">
                              <span className="btn-preloader sb-preloader"></span>
                            </div>
                            : 'Reset Password'}
                        </button>
                      </div>
                  }
                </div>


              </div>
            </div></div>    </div>
      </div>
    )
  }
}