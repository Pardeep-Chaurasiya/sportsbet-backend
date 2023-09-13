
import {connect} from 'react-redux'
import component from '../../components/bethistory'

const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        profile: state.profile,
        appState: state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return{
        dispatch:dispatch,
        ownProps
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(component)