import React, { PropTypes, Component } from 'react';

const preStyle = {
   backgroundColor: "transparent",
   color: "white",
   border: 0,
   margin: 0,
   padding: 0
};
const liStyle = {
   marginBottom: "20px",
   position: "relative"
};
const wrap1Style = {
   whiteSpace: "nowrap",
   overflow: "auto"
};
const wrap2Style = {
   display: "table",
   tableLayout: "fixed",
   width: "100%"
};
const wrap3Style = {
   width: "800px",
   display: "table-cell"
};

function hsvToRgb(h, s, v) {
   const i = Math.floor(h);
   const f = h - i;
   const p = v * (1 - s);
   const q = v * (1 - f * s);
   const t = v * (1 - (1 - f) * s);
   const mod = i % 6;
   const r = [v, q, p, p, t, v][mod];
   const g = [t, v, v, q, p, p][mod];
   const b = [p, p, t, v, v, q][mod];

   return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
   };
}

function colorFromString(token) {
   const splitToken = token.split('');
   const finalToken = splitToken.concat(splitToken.reverse());

   const number = finalToken.reduce(
         (sum, char) => sum + char.charCodeAt(0),
         0
      ) * Math.abs(Math.sin(token.length));

   const h = Math.round((number * (180 / Math.PI) * token.length) % 360);
   const s = number % 100 / 100;
   const v = 1;

   return hsvToRgb(h, s, v);
}

export default class LogMonitorEntry extends Component {
   constructor(props) {
      super(props);
      this.state = {
         maximizedAction: false,
         maximizedState: false
      }
   }

   static propTypes = {
      index: PropTypes.number.isRequired,
      state: PropTypes.object.isRequired,
      action: PropTypes.object.isRequired,
      select: PropTypes.func.isRequired,
      error: PropTypes.string,
      onActionClick: PropTypes.func.isRequired,
      collapsed: PropTypes.bool
   };

   printState(state, error) {
      let errorText = error;
      if (!errorText) {
         try {
            return JSON.stringify(this.props.select(state), null, 2);
         } catch (err) {
            errorText = 'Error selecting state.';
         }
      }

      return (
         <span style={{
        fontStyle: 'italic'
      }}>
        ({errorText})
      </span>
      );
   }

   handleCollapseClick() {
      const { index, onActionClick } = this.props;
      if (index > 0) {
         onActionClick(index);
      }
   }

   render() {
      const { index, error, action, state, collapsed } = this.props;
      const { maximizedAction, maximizedState } = this.state;
      if (!action.type) {
         return null;
      }
      const { r, g, b } = colorFromString(action.type);
      const colorStyle = {color: `rgb(${r}, ${g}, ${b})`};

      // Heading
      let headingComponent = !maximizedAction ? (
         <h4 style={{color: `rgb(${r}, ${g}, ${b})`,}}>
            <i className="fa fa-plus-square"></i>
            {" " + action.type}
         </h4>
      ) : (
         <pre style={preStyle}>
           <a style={colorStyle}>
              <i className="fa fa-minus-square"></i>
              {JSON.stringify(action, null, 2)}
           </a>
        </pre>
      );

      // State
      let stateComponent = !maximizedState ? (
         <h4 style={{color: "white"}}>
            <i className="fa fa-plus-square"></i>
            {" State: object {...}"}
         </h4>
      ) : (
         <pre style={preStyle}>
            <i className="fa fa-minus-square"></i>
            {this.printState(state, error)}
         </pre>
      );

      return (
         <li style={liStyle}>
            <div style={wrap1Style}>
               <div style={wrap2Style}>
                  <div style={wrap3Style}>
                     <a onClick={::this.handleCollapseClick} href="javascript:;">
                        <i className={"fa fa-" + (collapsed ? "ban" : "check")}></i>
                        {!collapsed ? " Enabled" : " Disabled"}
                     </a>
                     <a onClick={()=>this.setState({maximizedAction: !maximizedAction})} href="javascript:;">
                        {headingComponent}
                     </a>
                     <a onClick={()=>this.setState({maximizedState: !maximizedState})} href="javascript:;">
                        {stateComponent}
                     </a>
                  </div>
               </div>
            </div>
         </li>
      );
   }
}
function getTimestring(d) {
   var x = document.getElementById("demo");
   var h = addZero(d.getHours(), 2);
   var m = addZero(d.getMinutes(), 2);
   var s = addZero(d.getSeconds(), 2);
   var ms = addZero(d.getMilliseconds(), 3);
   return h + ":" + m + ":" + s + ":" + ms;
}
function addZero(x, n) {
   if (x.toString().length < n) {
      x = "0" + x;
   }
   return x;
}
