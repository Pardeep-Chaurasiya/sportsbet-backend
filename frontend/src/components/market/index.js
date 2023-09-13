import React from 'react'
import SelectableEventBtn from '../selectableEventBtn'
export default class Market extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        hideEvents: props.marketIndex <5 ?false:true
      }
    }
    render() {
      const {
        props: { market, activeGame, addEventToSelection, betSelections,region, sport,competition, oddType },
        state: { hideEvents }
      } = this
      var marketDataArr = [], cashout = 0, marketId,display_key, expressId
      Object.keys(market.data).forEach((event, key) => {
        marketDataArr.push(market.data[event])
        cashout = market.data[event].cashout
        marketId = market.data[event].group_id
        expressId = market.data[event].express_id
        display_key = market.data[event].display_key
      })
      return (
          <div className="event">
            <div className={`event-header ${hideEvents ? 'closed' : ''}`} data-title={activeGame ? market.name.replace(/Team 1/gi, activeGame.team1_name).replace(/Team 2/gi, activeGame.team2_name) : ''} onClick={() => { this.setState(prevState => ({ hideEvents: !prevState.hideEvents })) }}>
              {
                activeGame ?
                  <ul className="market-icons">
                    {void 0 !== expressId &&<li className="link-icon-market" title="Events from different groups can be combined in combined bets">{expressId}</li>}
                    {cashout===1 && <li className="cashout-icon-market" title="Cash-out available" ></li>}
                  </ul>
                  : null
              }
            </div>
            {/* {(marketId === 128 || (marketId===130 && (display_key==="HANDICAP" || void 0 ===display_key))) && <div className="handicap-header" style={{display:hideEvents && 'none'}}>
              <div className="handicap-title">{display_key=== "HANDICAP3WAY"? '1':activeGame.team1_name}</div>
              {
               display_key=== "HANDICAP3WAY" && <div className="handicap-title">Tie: 2</div>
              }
              <div className="handicap-title">{display_key=== "HANDICAP3WAY"? '2':activeGame.team2_name}</div>
              </div>} */}
            <div className={`event-data`} style={{ display: hideEvents ? 'none' : 'block' }}>
              {
                marketDataArr.map((event,key) => {
                  var eventArr = []
                  if (null !== event && event.hasOwnProperty('event')) {
                    Object.keys(event.event).forEach((singleEvent, id) => {
                      if (null !== event.event[singleEvent]) eventArr.push(event.event[singleEvent])
                    })
                  } 
                  eventArr.sort((a, b) => {
  
                    if (a.order > b.order)
                      return 1
                    if (b.order > a.order)
                      return -1
                    return 0
                  }) 
                  return (
                    <div {...{ className: `event-item-col-${event.col_count||'3'}` }} key={event.id+''+key}>
                      {
                        activeGame ?
                          eventArr.map(
                            (eventData, index) => {
                              var evtmarket = { ...event }
                              delete evtmarket.event
                              return (
                                <SelectableEventBtn key={index} betSelections={betSelections} sport={{id:sport.id,name:sport.name,alias:sport.alias}} region={{id:region.id,name:region.name,alias:region.alias}} competition={{id:competition.id, name:competition.name}}  market_type={event.market_type} game={activeGame} display_key={display_key} groupId={marketId} market={evtmarket} data={eventData} eventLen={eventArr.length} event_col={event.col_count} addEventToSelection={addEventToSelection}
                                  oddType={oddType} />
                              )
                            }
                          )
                          : null
                          }
                    </div>
                  )
                })
              }
            </div>
          </div>
          
      )
    }
  }