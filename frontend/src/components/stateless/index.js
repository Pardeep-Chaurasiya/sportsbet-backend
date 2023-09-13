import React from 'react'
import {stringReplacer} from '../../common'
export const CheckBox = (props) => {
    return (
      <label className="container">{props.text}
        <input type="checkbox" checked={props.checked} onChange={(e) => { props.onChange(e, props.id) }} />
        <span className="checkmark"></span>
      </label>
    )
  }
export class PagingDotsCustom extends React.PureComponent{

  getIndexes(count, inc) {
    const arr = [];
    for (let i = 0; i < count; i += inc) {
      arr.push(i);
    }
    return arr;
  }
  render(){

    const styles = {
      listStyles: {
        position: 'relative',
        margin: 0,
        top: -5,
        display: "inline-block",
        padding: "5px",
        backgroundColor: "rgba(0,0,0,.2)",
        borderRadius:"10px",
        WebkitTransitionDuration: ".3s",
        transitionDuration: ".3s",
      },
      listItemStyles: {
        display: "inline-block",
        width: "10px",
        height: "10px",
        margin: "0 3px",
        fontSize: "14px",
        backgroundColor: "#e2e2e2",
        borderRadius: "50%",
        cursor: "pointer",
        WebkitTransitionDuration: ".3s",
        transitionDuration: ".3s"
      }
    },{props}=this,custom={listStyles:{},listItemStyles:{}}
    if(props.style){
      Object.keys(props.style).forEach((key)=>{
        custom[key] = props.style[key]
      })
    }
    return(
  <ul style={{...styles.listStyles,...custom.listStyles}}>
    {this.getIndexes(props.slideCount, props.slidesToScroll).map(index => {
      return (
        <li style={{...styles.listItemStyles,...custom.listItemStyles,backgroundColor:props.currentSlide === index ? "#fff" : "rgba(255,255,255,.5)"}} key={index} onClick={props.goToSlide.bind(null, index)}>
        </li>
      );
    })}
  </ul>
    )
  }
}
export  class PreviousSlide extends React.PureComponent{

  render(){
    return(
      <button className="carousel-arrow left icon-icon-left" onClick={this.props.previousSlide}></button>
    )
  }
}
export class NextSlide extends React.PureComponent{

  render(){
    return(
      <button className="carousel-arrow right icon-icon-right" onClick={this.props.nextSlide} ></button>
    )
  }
}
export const BetSlipNotification = (props) => {
  return (
    <div className={`betslip-notification-message-container ${props.canNotify? 'notify-show':'notify-hide'}`} style={{...props.style}}>
      <div className={`betslip-notification-message ${props.type}`}>
        <div className="icon">
          <i className={`left-icon icon-sb-${props.type}`}></i>
        </div>
        <div className="message-wrapper">
          {
            props.message?
            <span className="message-text">{props.message}</span>
            :
            props.children
          }
        </div>
        <div className="close" onClick={() => { props.onClose()}}>
          <i className="uci-close"></i>
        </div>
      </div>
    </div>
  )
}
export const SportItem = ({onClick,activeID,s,i,is_live})=>{

  return(
    <div id={`sport-list-item-${s.id}`} onClick={(e)=>{onClick(s.id)}} className={`sport ${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()} ${activeID === s.id || (null === activeID && i === 0) ? 'active' : ''}`}>
      <div className="sport-background top"></div>
      <div className={`sport-avatar ${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])}`}></div>
      {activeID ===s.id || (null === activeID && i === 0) ? <span className="sport-name">{s.name}</span> : null}
    </div>
  )
}
export const SportsbookSportItem = ({onClick,activeID,s,i,is_live,type})=>{
  return(
    <div id={`sport-list-item-${s.id}`} onClick={(e)=>{onClick(s)}} className={`sport ${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', '']).toLowerCase()} ${activeID === s.id || (null === activeID && i === 0) ? 'active' : ''}`}>
      {void 0 !==type && type==='home' && <div className="count">{s.game}</div> }
      <div className={`sport-avatar ${stringReplacer(s.alias, [/\s/g, /\d.+?\d/g, /\(.+?\)/g], ['', '', ''])}`}></div>
      <span className="sport-name">{s.name}</span>
      <span className="sport-background"style={{opacity:activeID === s.id || (null === activeID && i === 0 )?1:0}}></span>

    </div>
  )
}

export const OddsSettings = (props) => {
  return (
    <div className="odd-settings">
      <div className="odd-settings-title">
        {props.title}
      </div>

      <div className="sb-radio-group">
        {props.custom ?
          <label>
            <input name="odds" checked={props.value === 2} type="radio" value="2" onChange={(e) => { props.onChange(e) }} />
            <i className="radio-on icon-icon-radio-button"></i>
            <i className="radio-off icon-icon-radio-button-empty"></i>
            <span>Accept odd change </span>
          </label>
          :
          props.customInput? 
          props.customInput.map((input,id)=>{
            return(
              <label key={id}>
                <input name="odds" checked={props.value.id === input.id} type="radio" value={id} onChange={(e) => { props.onChange(e) }} />
                <i className="radio-on icon-icon-radio-button"></i>
                <i className="radio-off icon-icon-radio-button-empty"></i>
                <span>{input.amount}</span>
              </label>
            )
          })
        :
          <React.Fragment>
            <label>
              <input name="odds" checked={props.value === 1} type="radio" value="1" onChange={(e) => { props.onChange(e) }} />
              <i className="radio-on icon-icon-radio-button"></i>
              <i className="radio-off icon-icon-radio-button-empty"></i>
              <span>Accept higher odds</span>
            </label>
            <label>
              <input name="odds" checked={props.value === 2} type="radio" value="2" onChange={(e) => { props.onChange(e) }} />
              <i className="radio-on icon-icon-radio-button"></i>
              <i className="radio-off icon-icon-radio-button-empty"></i>
              <span>Accept any odds </span>
            </label>
            <label>
              <input name="odds" checked={props.value === 0} type="radio" value="0" onChange={(e) => { props.onChange(e) }} />
              <i className="radio-on icon-icon-radio-button"></i>
              <i className="radio-off icon-icon-radio-button-empty"></i>
              <span>Always ask</span>
            </label>
          </React.Fragment>
        }
      </div>
    </div>
  )
}
export const OddsType = (props) => {
  return (
    <div className="odd-types">
      <div className="ember-view">
        <div className="ember-view">
          <select className="odds-type-changer" onChange={(e) => { props.onChange(e) }} value={props.value}>
            <option value="decimal">
              Decimal
    </option>
            <option value="fractional">
              Fractional
    </option>
            <option value="american">
              American
    </option>
            <option value="hongkong">
              Hongkong
    </option>
            <option value="malay">
              Malay
    </option>
            <option value="indo">
              Indo
    </option>
          </select>
        </div>
      </div>
    </div>
  )
}