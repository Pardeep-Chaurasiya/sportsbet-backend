import {connect} from 'react-redux'
import component from '../../components/drawer-menu'

const mapStateToProps  = (state, ownProps)=>{
 return {
  show_drawer: state.sb_modal.show_drawer,
  appState:state.appState
 }
}

const mpaDispatchToProps=(dispatch,ownProps)=>{
  return {
    dispatch:dispatch,
    ownProps
  }
}
export default connect(mapStateToProps,mpaDispatchToProps)(component)