import React from 'react'
import * as $ from 'jquery'
import 'jquery-ui/ui/widgets/datepicker'
import moment from 'moment-timezone'
import { onFormInputFocus, onFormInputFocusLost, onSelect, makeToast, getCookie } from '../../common'
import { allActionDucer } from '../../actionCreator'
import { SPORTSBOOK_ANY, RIDS_PUSH, PROFILE, LOGIN, LOGOUT, MODAL } from '../../actionReducers'
import { validateEmail, validateFullname, validatePhone, validatePassword, validateUsername, validateSMSCode } from '../../utils/index'
import { calcMD5 } from '../../utils/jsmd5'
import API from '../../services/api'
const $api = API.getInstance()
export default class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formType: 1,
            showPass: false,
            username: this.props.profile.nickname,
            password: '',
            old_password: '',
            c_password: '',
            uid: getCookie('id'),
            AuthToken: getCookie('AuthToken'),
            email: this.props.profile.email,
            firstname: this.props.profile.firstName,
            lastname: this.props.profile.lastName,
            phoneNumber: this.props.profile.mobilenumber,
            idnumber: this.props.profile.idnumber,
            gender: this.props.profile.gender,
            birth_date: this.props.profile.birth_date ? moment.unix(this.props.profile.birth_date).format('YYYY/MM/DD') : '',
            address: this.props.profile.address,
            document_type: this.props.profile.document_type,
            formStep: 1,
            countdown: 60,
            canResend: false,
            terms: false,
            phoneNumberEmpty: false,
            usernameEmpty: false,
            lastnameEmpty: false,
            firstnameEmpty: false,
            termsEmpty: false,
            passwordEmpty: false,
        }
        $api.setToken(this.state.AuthToken)
        this.onInputChange = this.onInputChange.bind(this)
        this.toggleShow = this.toggleShow.bind(this)
        this.changePass = this.changePass.bind(this)
    }
    componentDidMount() {
        $("#datepickerBD").datepicker({
            maxDate: new Date(moment().subtract(18, 'years')), onSelect: function () { onSelect('datepickerBD') }, changeMonth: true,
            changeYear: true
        });
        $("#datepickerBD").datepicker("option", "dateFormat", "yy/mm/dd");
        $("#datepickerBD").datepicker("setDate", new Date(this.state.birth_date));
        this.setState({ birth_date: moment($("#datepickerBD").val()).format('YYYY/MM/DD') })
    }
    changeForm(type) {
        type !== this.props.formType && this.props.changeForm(type)
    }
    toggleShow() {
        !this.state.changingpass && this.setState(prevState => ({ showPass: !prevState.showPass }));
    }
    onDateChangeBD(e) {
        e.persist()
        let val = e.target.value
        $("#datepickerBD").val(moment(val).format('YYYY/MM/DD'));
        this.setState({ birth_date: moment(val).format('YYYY/MM/DD') })
    }
    onInputChange(e) {
        let $el = e.target, newState = {}
        newState[$el.name] = $el.value
        newState[$el.name + 'Empty'] = false
        if (!this.state.formEdited) newState['formEdited'] = true
        this.setState(newState)
    }
    updateInfo() {
        this.setState({ updatingInfo: true })
        const { username, phoneNumber, formEdited, birth_date, document_type, idnumber, uid, email, AuthToken, address, gender, firstname, lastname } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss')
        let p = { mobilenumber: phoneNumber, uid: uid, AuthToken: AuthToken, idnumber: idnumber || '', address: address, email: email, gender: gender, nickname: username, firstName: firstname, lastName: lastname, document_type: document_type, time: $time }
        if (birth_date !== '') p['birth_date'] = moment(birth_date).unix(); else p['birth_date'] = 0
        const $hash = calcMD5(`AuthToken${AuthToken}uid${uid}mobilenumber${phoneNumber}email${email}time${$time}${this.props.appState.$publicKey}`)
        p.hash = $hash
        if (formEdited) $api.updateProfile(p, this.onEditSucess.bind(this))
        else {
            this.setState({ updatingInfo: false })
            makeToast('Noting to Update!', 5000)
        }
    }
    changePass() {
        this.setState({ changingpass: true })
        const { uid, AuthToken, password, old_password, phoneNumber, c_password } = this.state, $time = moment().format('YYYY-MM-DD H:mm:ss'),
            $hash = calcMD5(`uid${uid}password${old_password}AuthToken${AuthToken}time${$time}${this.props.appState.$publicKey}`)
        $api.changePassword({ c_password: c_password, old_pass: old_password, password: password, AuthToken: AuthToken }, this.onPasswordChanged.bind(this))
    }
    onPasswordChanged({ data }) {
        if (data.status === 200) {
            makeToast(data.msg, 5000)
            this.props.dispatchLogout(1)
            this.props.dispatch(allActionDucer(MODAL, { modalOpen: false, type: 0 }))
        }
        this.setState({ changingpass: false, formEdited: false })
        makeToast(data.msg, 5000)
    }
    onEditSucess({ data }) {
        if (data.status === 200) {
            const { username, phoneNumber, birth_date, document_type, idnumber, uid, email, address, gender } = this.state
            this.props.dispatch(allActionDucer(PROFILE, { birth_date: birth_date !== '' ? moment(birth_date).unix() : 0, mobile: phoneNumber, uid: uid, idnumber: idnumber, address: address, email: email, gender: gender, nickname: username, document_type: document_type }))
        }
        this.setState({ edited: data.msg, updatingInfo: false, formEdited: false })
        makeToast(data.msg, 5000)
    }
    render() {
        const { showPass, password, phoneNumber, email, username, c_password, updatingInfo, changingpass, phoneNumberEmpty,
            usernameEmpty,
            termsEmpty, firstnameEmpty, lastnameEmpty,
            passwordEmpty, idnumber, birth_date, gender, address, document_type, old_password, lastname, firstname } = this.state, { backToMenuModal, formType, onClose } = this.props
        return (
            <div className="section-content col-sm-12">
                <div className="filter">
                    <div className="header">
                        <div onClick={() => { backToMenuModal() }} className="icon-icon-arrow-left back-btn"></div>
                        <div className="title" style={{ padding: '15px' }}>My Profile</div>

                    </div>
                    <div className="sorter">
                        <div className={formType == 1 ? 'active' : ''} onClick={() => { this.changeForm(1) }}> <span>Edit Profile </span>
                        </div>
                        <div className={formType == 2 ? 'active' : ''} onClick={() => { this.changeForm(2) }}><span>Change Password</span>
                        </div>
                    </div>
                </div>
                {
                    formType === 1 ?
                        <div className="sb-login-form-container sign-up" >
                            <div style={{ width: '100%' }}>

                                <div className="liquid-container ember-view">
                                    <div className="liquid-child ember-view">
                                        <div data-step="sign-up" className="sb-login-step active ember-view">
                                            <div className="sb-login-form-wrapper">
                                                <div className={`form ${formType !== 1 ? 'animated fadeOut' : 'fadeIn animated'}`} id="first-form">
                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <input value={this.props.profile.dialing_code + " " + phoneNumber} className={`ember-text-field ember-view`} type="text" readOnly />
                                                                <span className={`placeholder ${phoneNumber === '' && 'placeholder-inactive'}`}>Phone Number</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>

                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">

                                                                <input name="username" value={username} className={`${(username !== '' && !validateUsername(username)) || usernameEmpty ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" readOnly />
                                                                <span className={`placeholder ${username === '' && 'placeholder-inactive'}`}>Nickname</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">

                                                                <input name="firstname" value={firstname} className={`${(firstname !== '' && !validateFullname(firstname)) || firstnameEmpty ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" autoComplete="off" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} />
                                                                <span className={`placeholder ${firstname === '' && 'placeholder-inactive'}`}>First Name</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">

                                                                <input name="lastname" value={lastname} className={`${(lastname !== '' && !validateFullname(lastname)) || lastnameEmpty ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" autoComplete="off" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} />
                                                                <span className={`placeholder ${lastname === '' && 'placeholder-inactive'}`}>Last Name</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>

                                                    <div className="ember-view col-sm-12"><div className="form-group ">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <select name="gender" style={{ padding: '18px 10px 0' }} value={gender} className={` ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                    <option value="U">Don't Specify</option>
                                                                    <option value="M">Male</option>
                                                                    <option value="F">Female</option>
                                                                </select>
                                                                <span className={`placeholder ${gender === '' && 'placeholder-inactive'}`}>Gender</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <input name="email" value={email} className={`${email !== '' && !validateEmail(email) ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                <span className={`placeholder ${email === '' && 'placeholder-inactive'}`}>Email </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group ">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <select name="document_type" style={{ padding: '18px 10px 0' }} value={document_type} className={`ember-text-field ember-view`} onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                    <option value="1">Identity Card/ID Book</option>
                                                                    <option value="2">Passport</option>
                                                                    <option value="3">Driver License</option>
                                                                    <option value="4">Firearms License</option>
                                                                    <option value="5">Other</option>
                                                                </select>
                                                                <span className={`placeholder ${document_type === '' && 'placeholder-inactive'}`}>ID Type</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group ">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <input name="idnumber" value={idnumber} className={`ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                <span className={`placeholder ${idnumber === '' && 'placeholder-inactive'}`}>ID Card Number</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group ">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <input type="text" id="datepickerBD" name="birth_date" onChange={(e) => { this.onDateChangeBD(e) }} autoComplete="off" className={`ember-text-field ember-view`} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} readOnly />
                                                                <span className={`placeholder ${birth_date === '' && 'placeholder-inactive'}`}>Date of Birth</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group ">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <input name="address" value={address} className={`ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
                                                                <span className={`placeholder ${address === '' && 'placeholder-inactive'}`}>Address</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    </div>
                                                    <div className="error-box">
                                                        <span></span>
                                                    </div>
                                                    <button onClick={this.updateInfo.bind(this)} className="sb-account-btn btn-primary submit-join-now " type="submit" >
                                                        {updatingInfo ?
                                                            <div className="no-results-container sb-spinner">
                                                                <span className="btn-preloader sb-preloader"></span>
                                                            </div>
                                                            : 'Submit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="sb-login-form-container sign-in" >
                            <div >

                                <div className="liquid-container ember-view">
                                    <div className="liquid-child ember-view">
                                        <div data-step="sign-in" className="sb-login-step active ember-view">
                                            <div className="sb-login-form-wrapper">
                                                <div className={`form ${formType !== 2 ? 'animated fadeOut' : 'fadeIn animated'}`} id="first-form">
                                                    <div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper  show-password-switcher">
                                                                <div className="field-icons-container ember-view">
                                                                    <div className="password-visibility-block" onClick={this.toggleShow}>
                                                                        <span className={`password-visibility icon ${showPass ? 'icon-sb-hide' : 'icon-sb-show'}`}></span>
                                                                    </div>

                                                                </div>
                                                                <input name="old_password" value={old_password} required className="ember-text-field ember-view" type={showPass ? "text" : "password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange} />
                                                                <span className="placeholder placeholder-inactive"> Old Password</span>

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
                                                                <input name="password" value={password} required className="ember-text-field ember-view" type={showPass ? "text" : "password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange} />
                                                                <span className="placeholder placeholder-inactive"> New Password</span>

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
                                                                <input name="c_password" value={c_password} required className="ember-text-field ember-view" type={showPass ? "text" : "password"} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" onChange={this.onInputChange} />
                                                                <span className="placeholder placeholder-inactive">Confirm New Password</span>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="error-box">
                                                        <span></span>
                                                    </div>
                                                    <button onClick={this.changePass.bind(this)} className="sb-account-btn btn-primary submit-join-now " type="submit" >
                                                        {changingpass ?
                                                            <div className="no-results-container sb-spinner">
                                                                <span className="btn-preloader sb-preloader"></span>
                                                            </div>
                                                            : 'Submit'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </div>
        )
    }
}