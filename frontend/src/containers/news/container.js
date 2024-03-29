
import { connect } from 'react-redux'
import component from '../../views/news'


const mapStateToProps = (state, ownProps) => {
    return {
        sportsbook: state.sportsbook,
        appState: state.appState
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        dispatch: dispatch,
        ownProps
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(component)