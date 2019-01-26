import React from 'react';
import { NavLink } from 'react-router-dom';
import { ListGroup, ListGroupItem } from 'reactstrap';

const ListSearchStocks = (props) => {
  if(props.results.stocks.length > 0){
    const options = props.results.stocks.map(r => (
      <NavLink className="text-left text-secondary removeLinkDefault listSearchStocks_item_link" key={r.symbol} to= {"/stock/" + r.symbol.replace(".","_")}>
        <ListGroupItem className="listSearchStocks_item bg-transparent">{r.symbol} - {r.name}</ListGroupItem>
      </NavLink>
    ))
    return <ListGroup className="listSearchStocks">{options}</ListGroup>
  } else {
    return null;
  }
}
  
  export default ListSearchStocks