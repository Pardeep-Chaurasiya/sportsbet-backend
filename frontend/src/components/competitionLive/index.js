import React,{useState,useEffect} from 'react'
import Competition from '../competition'
import {Transition, Spring} from 'react-spring/renderprops'
import { stringReplacer } from '../../common';
export const CompetitionLive=(pProps)=>{
    const [opened,isOpen] = useState(pProps.cIndex < 4? true:false), [ignoreActiveRegion, ignoreRegion] = useState(pProps.cIndex <4?true:false),[hover, setHover] = useState(false);
      useEffect(()=>{if(pProps.competitionRegion.id === pProps.region.id  && !ignoreActiveRegion && !opened){isOpen(!opened)}},[pProps.competitionRegion])
      let  eventsName = []
      for(let game in pProps.cProps.competition.game){
        if(pProps.cProps.competition.game[game] &&pProps.cProps.competition.game[game].hasOwnProperty('market')){
          if (Object.keys(pProps.cProps.competition.game[game].market).length > 0) {
            if(pProps.cProps.competition.game[game].market[Object.keys(pProps.cProps.competition.game[game].market)[0]]!==null){
             for (const ev in pProps.cProps.competition.game[game].market[Object.keys(pProps.cProps.competition.game[game].market)[0]].event) {
   
               eventsName.push(pProps.cProps.competition.game[game].market[Object.keys(pProps.cProps.competition.game[game].market)[0]].event[ev])
             }
             break
            }
           }
        }
      }
      
      eventsName.sort((a, b) => {
        if (a.order > b.order)
          return 1
        if (b.order > a.order)
          return -1
        return 0
      })
    return(
        <li >
        <div {...{ className: `region-header ${!ignoreActiveRegion && pProps.competitionRegion.id === pProps.region.id ? 'select' : (ignoreActiveRegion && opened) ? 'select' : ''}`, onClick: () => {isOpen(!opened);ignoreRegion(!ignoreActiveRegion) },style:{height:'35px',background: "#ededf2"} }} >
          <span className="col-sm-6 region-text">
          <span {...{ className: `total-games text` }}>
            <span {...{ className: `icon-icon-arrow-down icon icon-show ${(!ignoreActiveRegion && pProps.competitionRegion.id == pProps.region.id) ? "icon-up" : (ignoreActiveRegion && opened) ? 'icon-up' : ""}` }}>
            </span>
            </span>
          <span {...{ className: `region-icon flag-icon flag-${pProps.region.alias ? pProps.region.alias.replace(/\s/g, '').replace(/'/g, '').toLowerCase() : ''}` }}></span>
          <span className="col-sm-9 region-name">{pProps.cProps.competition.name} </span>
          </span>
          <span className="events col-sm-6">
          {eventsName.map((en, enk) => {
            return (
              <span key={enk} className={en.name.toLowerCase()}>{stringReplacer(en.type, [/P/g], [''])}</span>
            )
          })}

        </span>
        </div>
           {
          ((!ignoreActiveRegion && pProps.competitionRegion.id == pProps.region.id) ||(ignoreActiveRegion && opened)) && <div className="region-competition" style={{display:'block',height:'auto'}}>
         <ul className="competition-list"  style={{height:'auto'}}>
             <Competition {...pProps.cProps} eventTypeLen={eventsName}/>     
             </ul>
           </div>
           }
      </li>
    )
}