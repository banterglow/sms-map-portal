import React from 'react';

class Route extends React.Component {
  constructor(props) {
    super(props);
    this.routeSelected = this.routeSelected.bind(this);
  }

  routeSelected() {
    this.props.callback(this.props.route.origin, this.props.route.dest);
  }


  render() {
    return (
      <div className="route-step" >
        <div className="route-name" onClick={this.routeSelected}><strong>{this.props.route.origin}</strong><br/> to <br/><strong>{this.props.route.dest}</strong></div>
      </div>
    )
  }
}

export default Route;