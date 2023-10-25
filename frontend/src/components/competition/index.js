import React from 'react'
import CompetitionEventGame from '../competitionEventGame'
import { withRouter } from 'react-router-dom'
class Competition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
    };
    this.selectCompetition = this.selectCompetition.bind(this)
    this.openGameToView = this.openGameToView.bind(this)
  }

  selectCompetition() {
    this.setState(prevState => ({ isSelected: !prevState.isSelected }))
  }
  openGameToView(competition, region, sport, game = null) {
    let state = { sport: sport, region: region, competition: competition }
    game !== null && (state.game = game)
    this.props.history.push(`/sports/${this.props.activeView.toLowerCase()}/${sport.alias}/${region.name}/${competition.id}${null !== game ? '/' + game.id : ''}`, state)
  }
  render() {
    const { multiview, competition, gameSets, region, sport, currentCompetition, activeView, addEventToSelection, betSelections, activeGame,
      addToMultiViewGames, multiviewGames, oddType
    } = this.props
    let dontshowCompetion = 0;
    multiviewGames.map((g) => {
      if (competition.game[g]) {
        dontshowCompetion += 1
      }
      return g
    })
    return (
      activeView !== "Live" ?
        <li className={`competition-block ${currentCompetition ? currentCompetition === competition.id ? 'active' : '' : ''}`} onClick={() => this.openGameToView(competition, region, sport)}>
          <div className="header match-league"><span className='match-league-title-text'>{competition.name}</span></div>
        </li>
        :
        dontshowCompetion !== Object.keys(competition.game).length ?
          <li className={`competition-block live ${currentCompetition ? currentCompetition === competition.id ? 'select' : '' : ''}`}>
            {activeView !== "Live" && <div className="header match-league"><span className='match-league-title-text'>{competition.name}</span></div>}
            <div className="events">
              <CompetitionEventGame eventTypeLen={this.props.eventTypeLen} multiview={multiview} activeGame={activeGame} games={competition.game} gameSets={gameSets} loadMarkets={this.openGameToView} sport={sport} region={region} competition={competition}
                addEventToSelection={addEventToSelection} betSelections={betSelections} addToMultiViewGames={addToMultiViewGames} multiviewGames={multiviewGames} oddType={oddType} activeView={activeView} />
            </div>
          </li>
          : null
    )
  }
}
export default withRouter(Competition)