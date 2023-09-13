import React, {useState,useEffect } from 'react';

function AccountMenuOption({onExpand,children,type,id,title,icon='',tabType}) {
 const [isExpanded,expand]=useState(type===id ?true:false)
 useEffect(()=>expand(type===id ?true:false),[type])
  return <div className="menu-option">
      <div className={`menu-link-item ${type ===id && 'active'}`} onClick={()=>{(onExpand instanceof Function) &&onExpand(id)} }>
        <div className="col-sm-1"><span className={`profile-icon ${icon}`}></span></div>
        <div className="col-sm-11">{title}</div>
      </div>
      {<div className="menu-items-container" style={React.Children.count(children)?{padding:isExpanded &&'5px',minHeight:isExpanded &&'40px'}:{}}>
          {isExpanded && children}
      </div>}
  </div>;
}

export default AccountMenuOption;