import React from 'react'
import { oddConvert, stringReplacer } from '../../common'
export default class SelectableEventBtn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isSelected: false
    }
    this.priceBtn = null;
    this.timeoutId = null
    this.eventData = { price: null, initialPrice: null }
    this.addEvent = this.addEvent.bind(this)
    this.eventClasses = { 1: 'col-sm-4', 2: 'col-sm-6', 3: 'col-sm-4', 4: 'col-sm-12', 5: 'col-sm-5', 6: 'col-sm-2' }
  }

  componentDidUpdate() {
    if (this.eventData.price !== this.props.data.price &&
      this.eventData.initialPrice !== this.props.data.initialPrice) {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(function () {
        if (undefined !== this.priceBtn && null !== this.priceBtn) {
          this.priceBtn.classList.remove('coeficiente-change-up');
          this.priceBtn.classList.remove('coeficiente-change-down');
        }
      }.bind(this), 10000);
      this.eventData.price = this.props.data.price
      this.eventData.initialPrice = this.props.data.initialPrice
    }
  }
  componentWillUnmount() {
    clearTimeout(this.timeoutId)
  }
  addEvent(e, game, market, data, c, s, r) {
    e.stopPropagation()
    if (!game.is_blocked) this.props.addEventToSelection(game, market, data, { competition: c, sport: s, region: r })
  }
  getEventClassName(marketcol, eventLen, name = '') {
    let classID = 3
    if (void 0 !== marketcol) {
      if (marketcol === 3 && eventLen > 3) {
        classID = 4
      }
      else if (marketcol === 2 && eventLen === 2) {
        classID = 2
      }
      else if (eventLen === 1) {
        classID = 4
      }

    } else {
      this.props.showType === 'home' ? eventLen > 2 ? name === 'Draw' ? classID = 6 : classID = 5 : classID = eventLen : classID = eventLen
    }
    return this.eventClasses[classID]
  }
  render() {
    const {
      props: { data, eventLen, showType, display_key, groupId, sport, competition, region,
        event_col, market, game, betSelections, oddType }
    } = this
    return (
      <div ref={(el) => { this.priceBtn = el }}
        title={`${stringReplacer(data.name === 'Nul' ? data.type : data.name, [/Team 1/gi, /Team 2/gi, /W1/gi, /W2/gi, /P1/gi, /P2/gi], [game.team1_name, game.team2_name, game.team1_name, game.team2_name])} ${data.hasOwnProperty('base') ? `(${data.base})` : ''}`}
        onClick={(e) => this.addEvent(e, game, market, data, competition, sport, region)} {...{ className: ` ${betSelections[market.id] && betSelections[market.id].eventId == data.id ? 'selected-event' : ''} single-event ${data.initialPrice ? (data.initialPrice > data.price) ? 'coeficiente-change-down' : (data.initialPrice < data.price) ? 'coeficiente-change-up' : '' : ''} ${game.is_blocked === 1 && 'blocked'} ${(void 0 === display_key && eventLen > 3) ? 'col-sm-12' : this.getEventClassName(event_col, eventLen, data.name)}` }}>
        <div className="event-name " data-title={`${stringReplacer(data.name === 'Nul' ? data.type : data.name, [/Team 1/gi, /Team 2/gi, /W1/gi, /W2/gi, /Draw/gi, /P1/gi, /P2/gi], [game.team1_name, game.team2_name, showType === 'home' ? game.team1_name : 1, showType === 'home' ? game.team2_name : 2, 'X', game.team1_name, game.team2_name])} ${data.hasOwnProperty('base') ? `(${data.base})` : ''}`}></div>
        <div className={`event-price `} style={{ display: 'flex', position: 'relative', justifyContent: 'flex-end' }}>{oddConvert({
          main: {
            decimalFormatRemove3Digit: 0,
            notLockedOddMinValue: null,
            roundDecimalCoefficients: 3,
            showCustomNameForFractionalFormat: null,
            specialOddFormat: null,
            useLadderForFractionalFormat: 0
          }, env: { oddFormat: null }
        }, { mathCuttingFunction: () => { } })(data.price, oddType)} <i className="blocked-icon" style={{ display: game.is_blocked ? 'block' : 'none' }}></i></div>

      </div>
    )
  }
}