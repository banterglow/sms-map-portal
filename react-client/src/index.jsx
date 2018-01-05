import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Forms from './components/forms.jsx';
import Maps from './components/map.jsx';
import Route from './components/routes.jsx';
import Directions from './components/directions.jsx';
import path from 'path';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      origin: 'Hack Reactor SF',
      dest: 'Facebook HQ',
      routeSteps: [],
      startAddress: '944 Market Street, 8th floor, San Francisco, CA 94102, United States',
      endAddress: '1 Hacker Way, Menlo Park, CA 94025, USA',
      distance: "30.6 mi",
      duration: "40 mins",
      savedRoutes: [],
      showAll: false,
    }
    this.newMap = this.newMap.bind(this);
    this.newDirections = this.newDirections.bind(this);
    this.newPhone = this.newPhone.bind(this);
    this.selectedRoute = this.selectedRoute.bind(this);
    this.toggleDirections = this.toggleDirections.bind(this);
  }

  componentDidMount() {
    let self = this;

    axios.get('/saved')
      .then((result) => {
        self.setState({
          savedRoutes: result.data
        })
      })
      .catch((err) => {
        console.log(err);
      })
  }

  toggleDirections() {
    this.setState({ showAll: !this.state.showAll })
  }

  newDirections(result) {
    let self = this;

    axios({
      method: 'post',
      url: '/map',
      data: JSON.stringify({ origin: result.request.origin.query, dest: result.request.destination.query }),
    })
      .then((response) => {
        console.log(response);
        if (response.data !== "Accepted") {
          self.setState({
            savedRoutes: response.data
          })
        console.log(response.data, 'successful save to DB')
        }
      })
      .catch((err) => {
        console.log(err, 'errored on save to DB')
      })
      
    let legs = result.routes[0].legs[0];
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
      dest: dest,
      showAll: false
    })
  }

  selectedRoute(origin, dest) {
    this.setState({
      origin: origin,
      dest: dest,
      showAll: false
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
        <h2 className="col-md-2">SMS Portal</h2>
        <div className="col-md-10"><Forms callbackDirections={this.newMap} callbackPhone={this.newPhone}/></div>
      </navbar>
      <div className="main row">
        <div className="col-md-2 routes">
          <div className="route-header"><h4>Saved Routes</h4></div>
          {this.state.savedRoutes.map((route) => {
            return <Route key={route.id} route={route} callback={this.selectedRoute}/>
          })}
        </div>
        <div className="col-md-7 map"><Maps origin={this.state.origin} dest={this.state.dest} callback={this.newDirections} /></div>
        <div className="col-md-3 directions">
          <div className="direction-header">
            <strong>{this.state.startAddress}</strong> <br/> to <br/> <strong>{this.state.endAddress}</strong> 
            <br/>
            Distance: {this.state.distance + '   '} 
            Duration: {this.state.duration}
          </div>
          {this.state.showAll ? this.state.routeSteps.map( (step) => {
          return <Directions key={step.encoded_lat_lngs} step={step}/>
          }) : 
            this.state.routeSteps.slice(0, 5).map((step) => {
            return <Directions key={step.encoded_lat_lngs} step={step} />
            
            }) }
          {this.state.showAll ? '' : 
            <div className="show-all" onClick={this.toggleDirections}> Show All </div>}
        </div>
      </div>
    </div>)
  }
}

ReactDOM.render(<App />, document.getElementById('app'));