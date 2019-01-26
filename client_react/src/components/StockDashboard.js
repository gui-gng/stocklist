import React from 'react';
import { connect } from 'react-redux';
import  {searchStock}  from '../selectors/stocks';
import StockDisplay from './StockDisplay';


export class StockDashboard extends React.Component {
  
  componentDidMount(){
    console.log("componentDidMount:" + this.props.symbolSearch);
    console.log(this.props);
    searchStock(this.props.symbolSearch, this.props.dispatch);
  }
  showState = () => {
    //loadStock(this.props.symbolSearch);
    console.log(this.props.stock);
  }

  render() {
    return (
      <div>
        <StockDisplay {...this.props.stock} />
      </div>
    );
  }
};

const mapStateToProps = (state, props) => ({
    stock:  state.stock,
    symbolSearch:props.match.params.symbol//loadStock(props.match.params.symbol) //{symbol: props.match.params.symbol}
});


export default connect(mapStateToProps)(StockDashboard);
