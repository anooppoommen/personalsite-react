import React, { Component } from 'react';
import  CursorComponent  from './CursorComponent';

class TypeWriterComponent extends Component{
    
    constructor(props){
        super(props);
        this.state = {
            step : "forward",
            lastUpdateTime : Date.now(),
            currentTextIndex : 0,
            displayTextLen : 0,
            texts : props.texts,
        }
    }
    

    componentDidMount(){
        this.timer = setInterval(this.typeWriterUpdate.bind(this),20)
    }

    typeWriterUpdate(){
        var t = Date.now()
        switch(this.state.step){
            case 'forward' :
                            if(this.state.displayTextLen >= this.state.texts[this.state.currentTextIndex].length){
                                this.setState({step : "init"});
                            }
                            else if(t - this.state.lastUpdateTime > 40 ){
                                var nextDisplayLength = this.state.displayTextLen + 1
                                this.setState({ displayTextLen : nextDisplayLength ,lastUpdateTime : t});
                            } 
                            break;
            case 'backward':
                            if(this.state.displayTextLen === 0){
                                var nextTextIndex = ( this.state.currentTextIndex + 1 ) % this.state.texts.length
                                this.setState({ step : "forward", currentTextIndex : nextTextIndex });
                            }else if( t - this.state.lastUpdateTime > 20 ){
                                var nextDisplayTextLength = this.state.displayTextLen - 1;
                                this.setState({ displayTextLen : nextDisplayTextLength ,lastUpdateTime : t});
                            }
                            break;
            case 'init' :
                        if(t - this.state.lastUpdateTime > 5000 ){
                            this.setState({ step : 'backward'});
                        }
                        break;
            default : 
                        console.log("");
        }
    }

    render(){
        var displayText = this.state.texts[this.state.currentTextIndex].substring(0,this.state.displayTextLen);
        return (
            <div>
                <span className="text"><strong> {displayText }</strong></span>
                <CursorComponent />
            </div>

        );
    }
}

export default TypeWriterComponent