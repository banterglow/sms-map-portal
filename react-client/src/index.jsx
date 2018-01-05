import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Forms from './components/forms.jsx';
import Maps from './components/map.jsx';
import Routes from './components/routes.jsx';
import Directions from './components/directions.jsx';
import path from 'path';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      origin: 'Hack Reactor SF',
      dest: 'Facebook HQ',
      routeSteps: null,
      startAddress: '944 Market Street, 8th floor, San Francisco, CA 94102, United States',
      endAddress: '1 Hacker Way, Menlo Park, CA 94025, USA',
      distance: "30.6 mi",
      duration: "40 mins",
      savedRoutes: null,
    }
    this.newMap = this.newMap.bind(this);
    this.newDirections = this.newDirections.bind(this);
    this.newPhone = this.newPhone.bind(this);
  }

  componentDidMount() {
    let self = this;
    $.ajax({
      url: '/saved',
      type: 'GET',
      success: (result) => {
        self.setState({
          savedRoutes: result
        })
      },
      error: (err) => {
        console.log(err, 'errored load saved routes')
      }
    })
  }

  newDirections(legs) {
    this.setState({
      routeSteps: legs.steps,
      startAddress: legs.start_address,
      endAddress: legs.end_address,
      distance: legs.distance.text,
      duration: legs.duration.text,
    });
  }

  newMap(origin, dest) {
    this.setState({
      origin: origin,
      dest: dest
    })
    let self = this;
    $.ajax({
      url: '/map',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ origin: origin, dest: dest }),
      success: (result) => {
        self.setState({
          savedRoutes: result
        })
        console.log(result, 'successful save to DB')
      },
      error: (err) => {
        console.log(err, 'errored save to DB')
      }
    })
  }

  newPhone(number) {
    let self = this;
    $.ajax({
      url: '/directions',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ phoneNumber: number, startAddress:self.state.startAddress, endAddress:self.state.endAddress }),
      success: (result) => {
        console.log(result, 'successful newDIR')
      },
      error: (err) => {
        console.log(err, 'errored newDIR')
      }
    })
  }

  render() {
    return (<div>
      <navbar className="row navbar">
        <h2 className="col-md-3">SMS Portal</h2>
        <div className="col-md-9 forms"><Forms callbackDirections={this.newMap} callbackPhone={this.newPhone}/></div>
      </navbar>
      <div className="main row">
        <div className="col-md-2 routes">
          {this.state.savedRoutes ? this.state.savedRoutes.map((route) => {
            return <Routes key={route.id} route={route}/>
          }): ''}
        </div>
        <div className="col-md-7 map"><Maps origin={this.state.origin} dest={this.state.dest} callback={this.newDirections} /></div>
        <div className="col-md-3 directions">
          <strong>{this.state.startAddress}</strong> to <strong>{this.state.endAddress}</strong> 
          <br/>
          Distance: {this.state.distance} 
          <br/>
          Duration: {this.state.duration}
            {this.state.routeSteps ? this.state.routeSteps.map( (step) => {
            return <Directions key={step.encoded_lat_lngs} step={step}/>
            }): ''
            }
        </div>
      </div>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));