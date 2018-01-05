import React from 'react';

class Routes extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="route-step">
        <strong>{this.props.route.origin}</strong> to <strong>{this.props.route.dest}</strong>
      </div>
    )
  }
}

export default Routes;