import React from "react";
import "./App.css";
import Main from "./containers/main";
export const Web3Context = React.createContext();
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      netId: null,
    };
  }
  componentDidMount() {}

  setWeb3 = (web3) => {
    this.setState({ web3 });
    console.log(this.state.web3, "web3333");
  };

  setAccounts = (accounts) => {
    this.setState({ accounts });
    console.log(this.state.accounts, "Acccccc");
  };

  setNetId = (netId) => {
    this.setState({ netId });
    console.log(this.state.netId, "netIdddd");
  };

  render() {
    return (
      <Web3Context.Provider
        value={{
          web3: this.state.web3,
          setWeb3: this.setWeb3,
          netId: this.state.netId,
          setAccounts: this.setAccounts,
          accounts: this.state.accounts,
          setNetId: this.setNetId,
        }}
      >
        <Main />
      </Web3Context.Provider>
    );
  }
}

export default App;
