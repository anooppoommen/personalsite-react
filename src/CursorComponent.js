import React,{Component} from 'react'
import './CursorComponent.css';

class CursorComponent extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            visibility : "",
            lastUpdateTime : Date.now()
        }
    }

    componentDidMount(){
        this.timer = setInterval(this.timerEvent.bind(this),100);
    }

    componentWillUnmount(){
        clearInterval(this.timer);
    }

    timerEvent(){
        var t = Date.now();
        var q = 600;

        if( t - this.state.lastUpdateTime < q){
            return;
        }

        var styleChange = "" === this.state.visibility ? "hidden" : ""; 
        
        this.setState({lastUpdateTime : Date.now(), visibility : styleChange });
    }

    render(){
        return (
            <div id="cursor" style={{ visibility: this.state.visibility }} className="cursor"></div>
        );
    }
}

export default CursorComponent