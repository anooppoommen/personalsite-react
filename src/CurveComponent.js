import React , {Component } from 'react'
import './CurveComponent.css';
class util{
    static radians(t){
        return t/180 * Math.PI 
    }
    static map(t,i,e,s,o){
        return s+ (o-s) *((t-i) / (e-i))
    }
}

class h{
    constructor(t,i){
        this.x = t;
        this.y = i;
    }
}

class curve{
    constructor(t,i,e,sb,o,n){
        this.isComplete = !1
        this.pointsA = [new h(0,0)]
        this.pointsB = [new h(0,0)]
        this.scaleX = o
        this.scaleY = n
        this.aX = t
        this.bX = e
        this.aY = i
        this.bY = sb
        this.aPhi = 0
        this.bPhi = 0
        this.opacity = .15
        this.isCleared = !1
        this.o = {
            life : 50,
            pointCount:40
        }
    }

    update(t,i){
        this.isCleared && (this.isCleared = !1);
        var e, n, h, a;
        e = util.map(t, 0, this.o.pointCount, 0, 1)
        n = util.map(i, 0, this.o.pointCount, 0, 1)
        h = this.calcCurve(e)
        a = this.calcCurve(n)
        this.pointsA.push(h)
        this.pointsB.push(a)
        this.isComplete = this.checkCompletion(e, n)
            
    }

    render(t, i, e) {
        if (this.opacity < 0)
            this.opacity = 0
        this.plotCurve(this.pointsA, t, i, e)
        this.plotCurve(this.pointsB, t, i, e)
    }

    fade(t, i, e) {
        if (!this.isCleared) {
            if (this.opacity <= 0)
                return void this.clear();
            this.opacity -= .008
            this.render(t, i, e)
        }
    }

    calcCurve(t) {
        var i, e, o;
        i = Math.sin(t * this.aX + util.radians(this.aPhi)) * Math.cos(t * this.bX)
        e = Math.sin(t * this.aY + util.radians(this.bPhi)) * Math.cos(t * this.bY)
        o = new h(i,e)
        return o;
    }

    plotCurve(t, e, s, o) {
        var x1,y1,i;
        if (!(t.length < 4)) {
            var n = .9 * s
            , h = .9 * o
            , a = s / 2
            , r = o / 2;
            for (n *= this.scaleX,
                h *= this.scaleY,
                e.beginPath(),
                x1 = t[0].x * n + a,
                y1 = t[0].y * h + r,
                e.moveTo(x1, y1),
                i = 1; i < t.length - 1; i++) {
                    x1 = t[i].x * n + a
                    y1 = t[i].y * h + r;
                    var c = (t[i].x + t[i + 1].x) / 2 * n + a
                    , d = (t[i].y + t[i + 1].y) / 2 * h + r;
                    e.quadraticCurveTo(x1, y1, c, d)
            }
            e.strokeStyle = "rgba(0, 0,0, " + this.opacity + ")"
            e.lineWidth = 2
            e.lineCap = "round"
            e.stroke()
        }
    }

    checkCompletion(t) {
        var i = Math.abs(Math.sin(t) * Math.cos(t));
        return .001 > i && 0 !== t ? !0 : !1
    }

    clear(){
        this.isCleared = !0
        this.pointsA = [new h(0,0)]
        this.pointsB = [new h(0,0)]
        this.opacity = .15
    }

}

class CurveComponent extends Component{

    constructor(props){
        super(props);
        this.state = {
            curves : [
                new curve(5,4,5,4,1,.9), 
                new curve(1,3,3,1,.6,.6), 
                new curve(3,7,3,1,.6,.52), 
                new curve(1,4,1,4,.8,1)
            ],
            curveIndex : 0,
            tick : 0,
            speed : .15,
            countA : 0,
            countB : 0,
            width : null,
            height : null,
            isPlaying : !1,
            top : "0px",
            left:"0px"
        }
        
        this.requestId = void 0
        this.$win = window
        this.canvas = null
        this.ctx = null
    }

    resizeHandler(){
        var marginTop = (window.innerHeight/2 - (this.canvas.height/2));
        var marginLeft= (window.innerWidth/2 - (this.canvas.width/2));
        this.setState({
            top : marginTop+'px',
            left: marginLeft+'px'
        })
    }

    start(){
        this.setState({ isPlaying : true})
    }

    stop(){
        this.setState({ isPlaying : false})
        cancelAnimationFrame(this.requestId)
        this.setState({requestId : void 0})
    }

    resize(t,i){
        var e = t || window.innerWidth
        , s = i || window.innerHeight
        , o = 400
        , n = 400
        , h = .75
        , a = .95;
        
        var newHeight,newWidth;
        // eslint-disable-next-line
        s > e ? e * a >= o ? (newHeight = o,newWidth = o) : 
        (newWidth = e * a,newHeight = e * a) : 
        s * h >= n ? (newHeight = n,newWidth = n) : 
        (newWidth = s * h,newHeight = s * h)

        this.setState({
            height : newHeight,
            width : newWidth
        })

    }

    timerEvent(){
        this.ctx.clearRect(0, 0, this.state.width, this.state.height);
        this.resize()
        var t = this.state.curves[this.state.curveIndex]
        var i = 0 === this.state.curveIndex ? this.state.curves[this.state.curves.length - 1] : this.state.curves[this.state.curveIndex - 1 ];
        
        t.render(this.ctx,this.state.width,this.state.height)
        t.update(this.state.countA,this.state.countB)
        i.fade(this.ctx,this.state.width,this.state.height)

        if(t.isComplete){
            var newCurveIndex = (this.state.curveIndex === this.state.curves.length - 1) ? 0 : (this.state.curveIndex + 1)
            this.setState({
                countA : 0,
                countB : 0,
                curveIndex : newCurveIndex
            });
        }

        this.setState({
            tick : this.state.tick + 1,
            countA : this.state.speed + this.state.countA,
            countB : this.state.countB - this.state.speed
        });
        
        this.requestId = requestAnimationFrame(this.timerEvent.bind(this))
        
    }

    componentDidMount(){
        this.canvas = this.refs.canvas;
        this.ctx = this.canvas.getContext('2d')
        this.resize()
        this.start()
        this.timerEvent()
        window.addEventListener('resize',this.resizeHandler.bind(this))
        window.addEventListener('load',this.resizeHandler.bind(this))
        
    }

    render(){
        return (
            <canvas ref="canvas" id="canvas" style={{marginTop : this.state.top,marginLeft:this.state.left}} height={this.state.height} width={this.state.width} ></canvas>
        )
    }
}

export default CurveComponent