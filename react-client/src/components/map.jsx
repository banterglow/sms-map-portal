import React from 'react';
import API_KEY from '../../config.js'


class Maps extends React.Component {
  constructor(props) {
    super(props);
    this.buildMap = this.buildMap.bind(this);
    this.directionsDisplay = new google.maps.DirectionsRenderer();
    this.map;
    this.directionsService = new google.maps.DirectionsService();
  }

  componentDidMount() {
    this.buildMap();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.origin !== this.props.origin || prevProps.dest !== this.props.dest) {
      console.log('map built')
      this.buildMap();
    }
  }


  buildMap() {
    this.map = new google.maps.Map(document.getElementById('map'));
    this.directionsDisplay.setMap(this.map);
    this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));
    let directionsDisplay = this.directionsDisplay;
    var request = {
      origin: this.props.origin,
      destination: this.props.dest,
      travelMode: 'DRIVING'
    };
    let self = this;
    this.directionsService.route(request, function (response, status) {
      if (status == 'OK') {
        directionsDisplay.setDirections(response);
        self.props.callback(response);
      } else if (status === 'NOT_FOUND') {
        alert('Origin or destination not found, please try again. Yo. ')
      }
    });
  }
  
  render() {
    return (
    <div id="map">
    </div>
    )
  }
}

export default Maps;