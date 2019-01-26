import React from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import  {searchStocks}  from '../selectors/stocks';
import ListSearchStocks from './ListSearchStocks';

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  //NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form, 
  Input } from 'reactstrap';

  class Header extends React.Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false,
        textSearch: props.textSearch
      };
    }
    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }

    onChange = (e) => {
      const textSearch = e.target.value;
      console.log(this.props.stocks);
      console.log("onChange search: " + textSearch);
      searchStocks(textSearch,this.props.dispatch);
    }

    render() {
      return (
      <div>
        <Navbar color="light" light expand="md" className="justify-content-center">
        <NavLink className="removeLinkDefault" to="/"><h1 className="brandLink">ST</h1></NavLink>
          <div className="navbar-collapse collapse justify-content-between align-items-center w-100">
            <div className="navbar-nav mx-auto text-center">
              <Form className="searchForm">
                <Input 
                  onChange={this.onChange} 
                  placeholder="Search" 
                  value={this.state.textSearch} 
                  bsSize="lg" 
                />
              </Form>
              <ListSearchStocks results={this.props} />
            </div>
          </div>
          <NavbarToggler onClick={this.toggle} />
          
        </Navbar>
      </div>
)}}

const mapStateToProps = (state, props) => ({
  stocks:  state.stocks,
  textSearch: state.textSearch
});

export default connect(mapStateToProps)(Header);
