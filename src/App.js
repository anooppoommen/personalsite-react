import React, { Component } from 'react';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import TypeWriterComponent from './TypeWriterComponent';
import CurveComponent from './CurveComponent';



class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      top:'0px',
      left:'0px',
      texts : [
        "B.Tech Student",
        "Pythonista",
        "NodeJs developer",
        "Web developer"
      ],
      loading : true
    }
  }

  resizeHandler(){
    var marginTop = (window.innerHeight/2 - (this.refs.wrapper.clientHeight/2));
    var marginLeft= (window.innerWidth/2 - (this.refs.wrapper.clientWidth/2));
    this.setState({
      top : marginTop+'px',
      left: marginLeft+'px'
    })

  }

  componentDidMount(){
    
    window.addEventListener('resize',this.resizeHandler.bind(this))
    window.addEventListener('load',this.resizeHandler.bind(this))
    setTimeout(() => this.setState({ loading: false }), 500);   
  
  }

  render() {

    let loader;

    if(this.state.loading){
      loader = (<div id="loader"><div class="loading-bar"><div class="bar"></div></div></div>)
    }

    return (
      <div className="center">
        <div id="logo"></div>
        <CurveComponent />
        <div ref="wrapper" id="wrapper" style={{marginTop : this.state.top,marginLeft:this.state.left}} className="holder">
          <span className="line" >Hi, I'm</span>
          <span className="glitch"><strong> Anoop P Oommen</strong> </span>
          <TypeWriterComponent texts={this.state.texts} />
          <div id="contact-holder">
            <a href="https://github.com/anooppoommen/" className="profile-logo" title="My github profile" > <FontAwesomeIcon icon={["fab","github"]} size="2x" /> </a>
            <a href="https://www.linkedin.com/in/anoop-p-oommen-7a8a1686/" className="profile-logo" title="My linkedin profile" > <FontAwesomeIcon icon={["fab","linkedin"]} size="2x" /> </a>
            <a href="mailto:anp.oommen@gmail.com" className="profile-logo"  title="Mail me "> <FontAwesomeIcon icon="envelope" size="2x" /> </a>
          </div>
        </div>
        {loader}
        <div id="footer">
          <div id="ftext"><strong>created by Anoop P Oommen</strong></div>
        </div>
      </div>
    );
  }
}

export default App;
