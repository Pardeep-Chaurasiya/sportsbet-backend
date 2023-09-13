import React from 'react'

export const BetVirtualKeyboard =(props)=>{
    return(
        <div className="bet-keyboard">
            <div class="sb-input-inner-label" tabIndex="0" onFocus={props.onFocus} onBlur={props.onFocusLost} id={'selection-'+props.id}>
                <div class="virtual-keyboard-input open" >
                        <span class="opacity-text">0</span>
                </div>
            </div>
            <div className="VirtualKey">
            <div class="button-group-row">
            <div class="button-group">
                <button id="but-1"  onClick={()=>props.onSetStake('1')}>1</button>
                <button id="but-2" onClick={()=>props.onSetStake('2')}>2</button>
            </div>
            <div class="button-group">
                <button id="but-3"  onClick={()=>props.onSetStake('3')}>3</button>
                <button id="but-4" onClick={()=>props.onSetStake('4')}>4</button>

            </div>
            <div class="button-group">
                <button id="but-5" onClick={()=>props.onSetStake('5')}>5</button>
                <button id="but-6" onClick={()=>props.onSetStake('6')}>6</button>
            </div>
            <div class="button-group button-flex">
                <button id="but-7" onClick={()=>props.onSetStake('7')}>7</button>
                <button id="but-8" onClick={()=>props.onSetStake('8')}>8</button>
                <button id="but-9" onClick={()=>props.onSetStake('9')}>9</button>
            </div>
        </div>
        <div class="button-group-row">
            <button id="but-0"  class="button-flex" onClick={()=>props.onSetStake('0')}>0</button>
            <button id="but-." class="dot">.</button>
            <button class="clear-but"><span class="icon-backspace"></span></button>
            <button class="doneButton" id={'bet-done-'+props.id} onClick={props.onFocusLost}>DONE</button>
        </div>
        </div>
        </div>
    )
}