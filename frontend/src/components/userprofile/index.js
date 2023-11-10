import React from 'react'

import 'jquery-ui/ui/widgets/datepicker'
import moment from 'moment-timezone'
import { onFormInputFocus, onFormInputFocusLost, makeToast, getCookie } from '../../common'
import { allActionDucer } from '../../actionCreator'
import { PROFILE, MODAL } from '../../actionReducers'
import { validateEmail, validateFullname, validateUsername } from '../../utils/index'
import { NewAPI } from '../../services/api'
const $api = NewAPI.getInstance()
export default class UserProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            formType: 1,
            showPass: false,
            username: this.props.profile.userData?.UserProfile?.nickname,
            password: '',
            old_password: '',
            image: this.props.profile?.userData?.UserProfile?.avatar,
            c_password: '',
            uid: getCookie('id'),
            AuthToken: localStorage.getItem('authToken'),
            email: this.props.profile.userData?.email,
            firstname: this.props.profile.userData?.firstName,
            lastname: this.props.profile.userData?.lastName,
            phoneNumber: this.props.profile.userData?.mobilenumber,
            idnumber: this.props.profile?.userData?.UserProfile?.idnumber,
            gender: this.props.profile?.userData?.UserProfile?.gender,
            birth_date: this.props.profile?.userData?.UserProfile?.dob,
            address: this.props.profile?.userData?.UserProfile?.address,
            document_type: this.props.profile?.userData?.UserProfile?.document_type,
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
            AvatarImage: ""
        }
        console.log(this.state, "statetstae");
        $api.setToken(this.state.AuthToken)
        this.onInputChange = this.onInputChange.bind(this)
        this.toggleShow = this.toggleShow.bind(this)
        this.changePass = this.changePass.bind(this)
    }
    // componentDidMount() {
    //     $("#datepickerBD").datepicker({
    //         maxDate: new Date(moment().subtract(18, 'years')), onSelect: function () { onSelect('datepickerBD') }, changeMonth: true,
    //         changeYear: true
    //     });
    //     $("#datepickerBD").datepicker("option", "dateFormat", "yy/mm/dd");
    //     $("#datepickerBD").datepicker("setDate", new Date(this.state.birth_date));
    //     this.setState({ birth_date: moment($("#datepickerBD").val()).format('YYYY/MM/DD') })
    // }
    changeForm(type) {
        type !== this.props.formType && this.props.changeForm(type)
    }
    toggleShow() {
        !this.state.changingpass && this.setState(prevState => ({ showPass: !prevState.showPass }));
    }
    // onDateChangeBD(e) {
    //     e.persist()
    //     let val = e.target.value
    //     $("#datepickerBD").val(moment(val).format('DD/MM/YYYY'));
    //     this.setState({ birth_date: moment(val).format('DD/MM/YYYY') })
    // }
    onInputChange(e) {
        let $el = e.target, newState = {}
        newState[$el.name] = $el.value
        newState[$el.name + 'Empty'] = false
        if (!this.state.formEdited) newState['formEdited'] = true
        this.setState(newState)
    }
    updateInfo() {
        this.setState({ updatingInfo: true })
        const { username, formEdited, birth_date, document_type, idnumber, address, gender, firstname, lastname } = this.state
        let p = { avatar: this.state.image, idnumber: idnumber || '', address: address, gender: gender, nickname: username, firstName: firstname, lastName: lastname, document_type: document_type, dob: birth_date }
        if (birth_date !== '') p['birth_date'] = moment(birth_date).unix(); else p['birth_date'] = 0
        const formData = new FormData()
        formData.append('avatar', this.state.image);
        formData.append('idnumber', idnumber || '');
        formData.append('address', address);
        formData.append('gender', gender);
        formData.append('nickname', username);
        formData.append('firstName', firstname);
        formData.append('lastName', lastname);
        formData.append('document_type', document_type);
        formData.append('dob', birth_date !== '' ? moment(birth_date).unix() : 0);
        console.log([...formData], "formdata");


        if (formEdited || this.state.AvatarImage) $api.updateProfile(formData, this.onEditSucess.bind(this))
        else {
            this.setState({ updatingInfo: false })
            makeToast('Noting to Update!', 5000)
        }
    }
    //  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNjk1NDQ1MzExLCJleHAiOjE2OTU0NTI1MTF9.74n6JCqfpvRi85tcDcm4lLeLiob_PVU8jTfqYY4CYhI
    changePass() {
        this.setState({ changingpass: true })
        const { password, old_password, c_password } = this.state
        $api.changePassword({ c_password: c_password, old_pass: old_password, password: password }, this.onPasswordChanged.bind(this))
    }
    onPasswordChanged({ data, status }) {
        if (status === 200) {

            makeToast(data.message, 5000)
            this.props.dispatchLogout(1)
            this.props.dispatch(allActionDucer(MODAL, { modalOpen: false, type: 0 }))
        }

        this.setState({ changingpass: false, formEdited: false })
        makeToast(data.message, 5000)


    }
    onEditSucess({ data, status }) {

        if (status === 200) {

            const { username, phoneNumber, birth_date, document_type, idnumber, uid, email, address, gender } = this.state
            this.props.dispatch(allActionDucer(PROFILE, { birth_date: birth_date !== '' ? moment(birth_date).unix() : 0, mobile: phoneNumber, uid: uid, idnumber: idnumber, address: address, email: email, gender: gender, nickname: username, document_type: document_type, image: this.state.image }))
        }
        this.setState({ edited: data.msg, updatingInfo: false, formEdited: false })
        console.log(data, 'update');
        makeToast(data.message, 5000)
    }
    render() {

        const { showPass, password, phoneNumber, email, username, c_password,
            usernameEmpty,
            firstnameEmpty, lastnameEmpty,
            idnumber, birth_date, gender, address, document_type, old_password, lastname, firstname } = this.state, { backToMenuModal, formType } = this.props
        return (
            <div className="section-content col-sm-12">
                <div className="filter">
                    <div className="header">
                        <div onClick={() => { backToMenuModal() }} className="icon-icon-arrow-left back-btn"></div>
                        <div className="title" style={{ padding: '15px' }}>My Profile</div>

                    </div>
                    <div className="sorter">
                        <div className={formType === 1 ? 'active' : ''} onClick={() => { this.changeForm(1) }}> <span>Edit Profile </span>
                        </div>
                        <div className={formType === 2 ? 'active' : ''} onClick={() => { this.changeForm(2) }}><span>Change Password</span>
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

                                                                {/* <input
                                                                    name="image"

                                                                    type="file"
                                                                    accept='image/'
                                                                    autoComplete="off"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        this.setState({ image: file })
                                                                    }}
                                                                    onFocus={(e) => onFormInputFocus(e)}
                                                                    onBlur={(e) => onFormInputFocusLost(e)}
                                                                />
                                                                <span className={`placeholder ${image === '' && 'placeholder-inactive'}`}>Upload Image</span> */}
                                                                <input
                                                                    name="image"
                                                                    type="file"
                                                                    accept="image/*"
                                                                    autoComplete="off"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        this.setState({ image: file })
                                                                        this.setState({ AvatarImage: file.name });


                                                                    }}
                                                                    onFocus={(e) => onFormInputFocus(e)}
                                                                    onBlur={(e) => onFormInputFocusLost(e)}
                                                                    id="file-input" // Added an ID for easier JavaScript targeting
                                                                    style={{ display: 'none' }} // Hide the default file input

                                                                />
                                                                <label htmlFor="file-input" className="file-input-label">
                                                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24%", border: "0.1px solid grey", borderRadius: "2px", cursor: "pointer" }}>
                                                                            <img src={this.state.image} alt="Icon" className="image-icon" />
                                                                            <span className={`file-input-text ${this.state.image === '' && 'placeholder-inactive'}`}>
                                                                                Change Avatar
                                                                            </span>
                                                                        </div>

                                                                    </div>
                                                                </label>

                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <input value={phoneNumber} className={`ember-text-field ember-view`} type="text" readOnly />
                                                                <span className={`placeholder ${phoneNumber === '' && 'placeholder-inactive'}`}>Phone Number</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>

                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">

                                                                <input name="username" value={username} className={`${(username !== '' && !validateUsername(username)) || usernameEmpty ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" />
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
                                                                    <option value="Don't Specify" >Don't Specify</option>
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                </select>
                                                                <span className={`placeholder ${gender === '' && 'placeholder-inactive'}`}>Gender</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group required">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <input name="email" value={email} className={`${email !== '' && !validateEmail(email) ? 'error animated pulse' : ''} ember-text-field ember-view`} type="text" onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off" readOnly />
                                                                <span className={`placeholder ${email === '' && 'placeholder-inactive'}`}>Email </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    </div>
                                                    <div className="ember-view col-sm-12"><div className="form-group ">
                                                        <div className="form-element empty">
                                                            <div className="input-wrapper ">
                                                                <select name="document_type" style={{ padding: '18px 10px 0' }} value={document_type} className={`ember-text-field ember-view`} onChange={(e) => this.onInputChange(e)} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} autoComplete="off">
                                                                    <option value="Identity Card/ID Book">Identity Card/ID Book</option>
                                                                    <option value="Passport">Passport</option>
                                                                    <option value="Driver License">Driver License</option>
                                                                    <option value="Firearms License">Firearms License</option>
                                                                    <option value="Other">Other</option>
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
                                                                <input type="date" id="datepickerBD" value={birth_date} name="birth_date" onChange={(e) => { this.setState({ birth_date: e.target.value }) }} autoComplete="off" className={`ember-text-field ember-view`} onFocus={(e) => onFormInputFocus(e)} onBlur={(e) => onFormInputFocusLost(e)} />
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


                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div >
                        :
                        <div className="sb-login-form-container sign-in">
                            <div style={{ width: "100%" }}>

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

                                                        Submit
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