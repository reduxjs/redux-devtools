import React, { PropTypes, Component } from 'react';

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
         maximized: false,
         time: new Date()
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

   handleMaximizeClick() {
      const { maximized } = this.state;
      this.setState({maximized: !maximized});
   }

   render() {
      const { index, error, action, state, collapsed } = this.props;
      const { maximized, time } = this.state;
      if (!action.type) {
         return null;
      }
      const { r, g, b } = colorFromString(action.type);

      return (
         <li className="timeline-inverted">
            <a className="timeline-badge" onClick={::this.handleCollapseClick} href="javascript:;">
               <i className={"fa fa-" + (collapsed ? "ban" : "check")}></i>
            </a>
            {maximized ?
               <div className="timeline-panel" style={{whiteSpace: "nowrap", overflow: "auto"}}>
                  <div style={{display: "table", tableLayout: "fixed", width: "100%"}}>
                     <div style={{ width: "400px", display: "table-cell"}}>
                        <a className="timeline-heading" onClick={::this.handleMaximizeClick} href="javascript:;">
                          <pre className="timeline-pre">
                             <a style={{color: `rgb(${r}, ${g}, ${b})`,}}>
                                <i className="fa fa-minus-square"></i>
                                {JSON.stringify(action, null, 2)}
                             </a>
                          </pre>
                        </a>

                        <div className="timeline-body">
                          <pre className="timeline-pre">
                             {this.printState(state, error)}
                          </pre>
                        </div>
                     </div>
                  </div>
               </div> :
               <div className="timeline-panel">
                  <a class="timeline-heading" onClick={::this.handleMaximizeClick} href="javascript:;">
                     <h4 class="timeline-title" style={{color: `rgb(${r}, ${g}, ${b})`,}}>
                        <i className="fa fa-plus-square"></i>
                        {" " + action.type}
                     </h4>
                     <p>
                        <small className="text-muted">
                           <i className="fa fa-clock-o"></i>
                           {" " + getTimestring(time)}
                        </small>
                     </p>
                  </a>
               </div>
            }
         </li>
      );
      return (
         <pre style={{
        textDecoration: collapsed ? 'line-through' : 'none',
        backgroundColor: "transparent",
        border: "0px"
      }}>
        <a onClick={::this.handleActionClick}
           style={{
             opacity: collapsed ? 0.5 : 1,
             marginTop: '1em',
             display: 'block',
             paddingBottom: '1em',
             paddingTop: '1em',
             color: `rgb(${r}, ${g}, ${b})`,
             cursor: (index > 0) ? 'pointer' : 'default',
             WebkitUserSelect: 'none'
           }}>
           {JSON.stringify(action, null, 2)}
        </a>

            {!collapsed &&
            <p style={{
            textAlign: 'center',
            transform: 'rotate(180deg)',
            color: 'lightyellow',
            fontSize: "2em"
          }}>
               ⇧
            </p>
            }

            {!collapsed &&
            <div style={{
            paddingBottom: '1em',
            paddingTop: '1em',
            color: 'lightyellow'
          }}>
               {this.printState(state, error)}
            </div>
            }

            <hr style={{
          marginBottom: '2em'
        }}/>
      </pre>
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
