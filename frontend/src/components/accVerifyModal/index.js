import React from 'react'
import './style.css'
import LoginForm from '../../components/login'
import RegisterForm from '../../components/register'
import ForgotPassword from '../../components/forgotpassword'
import { MODAL, PROFILE, LOGIN, AUTHENTICATED } from '../../actionReducers'
import { allActionDucer } from '../../actionCreator'
import { NewAPI } from '../../services/api'
import { calcMD5 } from '../../utils/jsmd5'
import moment from 'moment';
import { makeToast, setCookie } from '../../common'
const $api = NewAPI.getInstance()
export default class AccVerifyModal extends React.Component {
  constructor(props) {
    super(props)
    this.closeModal = this.closeModal.bind(this)
    this.smsSent = this.smsSent.bind(this)
    this.onResetSuccess = this.onResetSuccess.bind(this)
    this.changeFormType = this.changeFormType.bind(this)
    this.onCreatedTimeout = null
  }

  componentDidMount() {

  }

  dispatchLoginData = () => {

    if (this.props.sb_modal.created) {


      this.props.dispatchLogin()
      this.props.dispatch(allActionDucer(LOGIN, { isLoggedIn: true }))




    }

  }
  componentWillUnmount() {
    clearTimeout(this.onCreatedTimeout)
  }
  login(data) {
    this.props.dispatch(allActionDucer(MODAL, { attemptingLogin: true, loginHasError: false, loginErrorMSG: '', created: true }))
    const pass = data.password, email = data.email, $time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash = calcMD5(`email${email}password${pass}time${$time}${this.props.appState.$publicKey}`)
    $api.login({ email: email, password: pass }, this.onLoginSuccess.bind(this));

    // if (data.status === 200) {
    //   if (this.props.sb_modal.created) {

    //     this.props.dispatchLogin()
    //     this.props.dispatch(allActionDucer(LOGIN, { isLoggedIn: true }))

    //   }
    // }

  }
  // time:$time,hash:$hash
  createAccount(data) {
    this.props.dispatch(allActionDucer(MODAL, { attemptingSignup: true, signupHasError: false, signupErrorMSG: '', resetHasError: false, resetErrorMSG: '', smsHasError: false, smsErrorMSG: '' }))
    $api.createAccount({ ...data }, this.onAccountCreated.bind(this))
  }
  sendSMS(mobile, dialing_code, success) {
    this.props.dispatch(allActionDucer(MODAL, { sendingSMS: true, smsHasError: false, smsErrorMSG: '', signupHasError: false, signupErrorMSG: '', }))
    let $time = moment().format('YYYY-MM-DD H:mm:ss'),
      $hash = calcMD5(`dialing${dialing_code}mobile${mobile}time${$time}${this.props.appState.$publicKey}`)
    $api.sendSMS({ mobile: mobile, dialing_code: `+${dialing_code}` }, ({ data }) => (this.smsSent(data, success)))
  }
  // , time: $time, hash: $hash
  resetPassword(data, success) {
    this.props.dispatch(allActionDucer(MODAL, { attemptingPassReset: true, resetHasError: false, resetErrorMSG: '', smsHasError: false, smsErrorMSG: '' }))
    const $dialing_code = data.dialing_code, time = moment().format('YYYY-MM-DD H:mm:ss'), mobilenumber = data.mobilenumber, password = data.password, sms = data.sms, CPassword = data.password
    $api.resetPassword({ dialing_code: $dialing_code, mobilenumber: mobilenumber, sms: sms, password: password, CPassword: CPassword }, ({ data }) => this.onResetSuccess(data, success))
  }
  // , time: time, hash: $hash 
  smsSent(data, success) {
    if (data.status === 200) {
      this.props.dispatch(allActionDucer(MODAL, { sendingSMS: false, smsHasError: false, smsErrorMSG: '' }))
      success()
    }
    else this.props.dispatch(allActionDucer(MODAL, { sendingSMS: false, smsHasError: true, smsErrorMSG: data.msg }))
  }
  onResetSuccess(data, success) {

    if (data.status === 200) {
      this.props.dispatch(allActionDucer(MODAL, { attemptingPassReset: false, resetHasError: false, resetErrorMSG: '' }))
      success()
    }
    else this.props.dispatch(allActionDucer(MODAL, { attemptingPassReset: false, resetHasError: true, resetErrorMSG: data.msg }))
  }
  onAccountCreated({ data, status }) {

    if (status === 200) {
      makeToast("User Register successfully", 6000)
      this.changeFormType({ formType: "login" })
      let date = new Date();
      date.setTime(date.getTime() + (0.5 * 24 * 60 * 60 * 1000));
      this.props.dispatch(allActionDucer(PROFILE, data.data))
      this.props.dispatch(allActionDucer(MODAL, { created: true, attemptingSignup: false, signupHasError: false, signupErrorMSG: '' }))
      let userId = data.data.uid, authToken = data.data.AuthToken;
      setCookie('AuthToken', authToken, '/', date)
      setCookie('id', userId, '/', date)
      setCookie('mobile', data.data.mobilenumber, '/', date)
      setCookie('email', data.data.email, '/', date)

      this.props.dispatch(allActionDucer(AUTHENTICATED, { ...data.data }))
      window.location.reload()
    }
    else this.onCreateError(data)
  }
  onLoginSuccess({ data, status }) {
    if (status === 200) {

      localStorage.setItem('authToken', data.AuthToken)
      this.dispatchLoginData()
      makeToast("Login successfully", 6000)

      let date = new Date();
      date.setTime(date.getTime() + (0.5 * 24 * 60 * 60 * 1000));
      this.props.dispatch(allActionDucer(PROFILE, data.data))
      this.props.dispatch(allActionDucer(MODAL, { attemptingLogin: false, loginHasError: false, loginErrorMSG: '' }))
      let userId = data.data.uid;
      console.log(data.data);

      setCookie('id', userId, '/', date)
      setCookie('email', data.data.email, '/', date)
      setCookie('mobile', data.data.mobilenumber, '/', date)

      this.props.dispatchLogin()
      this.props.dispatch(allActionDucer(LOGIN, { isLoggedIn: true }))

      this.props.dispatch(allActionDucer(AUTHENTICATED, { ...data.data }))
      this.closeModal()
    }
    else {
      console.log(status, "status");
      this.onLoginError(data)

    }
  }
  onLoginError(data) {
    this.props.dispatch(allActionDucer(MODAL, { attemptingLogin: false, loginHasError: true, loginErrorMSG: data.msg }))
    console.log(data);
  }
  changeFormType(options) {
    this.props.dispatch(allActionDucer(MODAL, options))
  }
  onCreateError(data) {
    this.props.dispatch(allActionDucer(MODAL, { signupHasError: true, signupErrorMSG: data.msg, attemptingSignup: false }))
  }
  closeModal() {
    this.props.dispatch(allActionDucer(MODAL, {
      accVerifyOpen: false, formType: null, attemptingSignup: false, signupHasError: false, signupErrorMSG: '',
      attemptingLogin: false, loginHasError: false, loginErrorMSG: ''
    }))
  }
  showForm() {
    let formTypeStack = {
      login: <LoginForm dispatchLoginData={this.dispatchLoginData} changeForm={this.changeFormType} onClose={this.closeModal} attemptingLogin={this.props.sb_modal.attemptingLogin} errorState={{ loginHasError: this.props.sb_modal.loginHasError, loginErrorMSG: this.props.sb_modal.loginErrorMSG }} onSubmit={this.login.bind(this)} />
      , register: <RegisterForm created={this.props.sb_modal.created} smsErrorMSG={this.props.sb_modal.smsErrorMSG} smsHasError={this.props.sb_modal.smsHasError} onClose={this.closeModal} register={this.createAccount.bind(this)} attemptingSignup={this.props.sb_modal.attemptingSignup} sendingSMS={this.props.sb_modal.sendingSMS} sendTextMSG={this.sendSMS.bind(this)} changeForm={this.changeFormType} signupErrorMSG={this.props.sb_modal.signupErrorMSG} signupHasError={this.props.sb_modal.signupHasError} />
      , forgotpassword: <ForgotPassword smsErrorMSG={this.props.sb_modal.smsErrorMSG} smsHasError={this.props.sb_modal.smsHasError} onClose={this.closeModal} changeForm={this.changeFormType} sendingSMS={this.props.sb_modal.sendingSMS} sendTextMSG={this.sendSMS.bind(this)} attemptingPassReset={this.props.sb_modal.attemptingPassReset} resetHasError={this.props.sb_modal.resetHasError} resetErrorMSG={this.props.sb_modal.resetErrorMSG} verifyingSMS={this.props.sb_modal.verifyingSMS} reset={this.resetPassword.bind(this)} />
    }
    const { accVerifyOpen, formType } = this.props.sb_modal, showStyles = { opacity: 1, pointerEvents: 'unset' }
    return void 0 !== formTypeStack[formType] ?
      <div className="sb-modal sb-modal-backdrop" style={accVerifyOpen ? { ...showStyles } : {}}>
        {
          formTypeStack[formType]
        }
      </div>
      :
      <div></div>
  }
  render() {

    return this.showForm()

  }
}