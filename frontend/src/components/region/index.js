import React from 'react'
import Competition from '../competition'
import { CompetitionLive } from '../competitionLive';
import { Transition, Spring } from 'react-spring/renderprops';
export default class Region extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        opened: false,
        ignoreActiveRegion: false,
        hover: false
      };
      this.showCompetition = this.showCompetition.bind(this)
      this.toggleHover = this.toggleHover.bind(this)
    }
    showCompetition() {
  
      this.setState(prevState => ({ opened: !prevState.opened, ignoreActiveRegion: true }))
    }
    toggleHover() {
      this.setState({ hover: !this.state.hover })
  
    }
    componentDidUpdate() {
      if(this.props.competitionRegion.id === this.props.region.id && (!this.state.ignoreActiveRegion && !this.state.opened) )
      this.setState(prevState => ({ opened: !prevState.opened }))
    }
  
    render() {
      const  { multiview, region, loadGames, gameSets, currentCompetition, competitionRegion, sport, activeView, loadMarkets, competitionData, addEventToSelection, betSelections,
          activeGame, addToMultiViewGames, multiviewGames, oddType }= this.props
        , { opened, hover, ignoreActiveRegion }= this.state
  
      let competition = region.competition, regionTotalGames = 0, competitionArr = [];
      for (let compete in competition) {
        if (null !== competition[compete]) {
          regionTotalGames += Object.keys(competition[compete].game).length
          competitionArr.push(competition[compete])
        }
      }
      competitionArr.sort((a, b) => {
        if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1
        return 0
      })

      return (
  
        regionTotalGames > 0 ?
          activeView !== 'Live' ?
          <li>
            <div {...{ className: `region-header col-sm-12 ${((!ignoreActiveRegion && competitionRegion.id === region.id) || (ignoreActiveRegion && opened)) && 'select'}`, onClick: () => { this.showCompetition() } }} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
            <span className="col-sm-10 region-text">
              <span {...{ className: `region-icon flag-icon flag-${region.alias ? region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : ''}` }} style={{height: window.screen.width>1366 && '19px'}}></span>
              <span className="col-sm-10 region-name">{region.name} </span>
              <span {...{ className: `total-games text` }}> 
            </span>
            </span>
            <span className="col-sm-2 region-text">
              <span {...{ className: ` col-sm-8 text text-show` }}>{regionTotalGames}</span>
              <span {...{ className: `col-sm-2 icon-icon-arrow-down icon icon-show ${(!ignoreActiveRegion && competitionRegion.id === region.id) ? "icon-up" : (ignoreActiveRegion && opened) ? 'icon-up' : ""}` }}>
              </span>
            </span>
  
            </div>
           {((!ignoreActiveRegion && competitionRegion.id == region.id) ||(ignoreActiveRegion && opened)) &&
              <div className={`region-competition`}>
               <ul className="competition-list" style={{height:'auto'}}>
                  {
                    competitionArr.map((competition, competeID) => {
                      return (
                        <Competition key={competeID} multiview={multiview} loadMarkets={loadMarkets} region={{ id: region.id, name: region.name, alias: region.alias }} sport={{ id: sport.id, name: sport.name, alias: sport.alias }} activeView={activeView}
                          currentCompetition={currentCompetition} activeGame={activeGame} gameSets={gameSets} competitionData={competitionData} competition={competition} key={competition.id} loadGames={loadGames}
                          addEventToSelection={addEventToSelection} betSelections={betSelections} addToMultiViewGames={addToMultiViewGames} multiviewGames={multiviewGames} oddType={oddType}/>
                      )
                    })
                  }
                </ul>
              </div>
          }
          </li>
          :
          competitionArr.map((competition, competeID) => {
            return (
              <CompetitionLive key={competeID} cIndex={this.props.regIndex} region={region} competitionRegion={competitionRegion} cProps={{ multiview:multiview, loadMarkets:loadMarkets, region:{ id: region.id, name: region.name, alias: region.alias }, sport:{ id: sport.id, name: sport.name, alias: sport.alias } ,activeView:activeView,
              currentCompetition:currentCompetition, activeGame:activeGame, gameSets:gameSets, competitionData:competitionData, competition:competition ,loadGames:loadGames,
              addEventToSelection:addEventToSelection, betSelections:betSelections,addToMultiViewGames:addToMultiViewGames, multiviewGames:multiviewGames , oddType:oddType}}/>
            )
          })
          : null
  
      )
  
    }
  }