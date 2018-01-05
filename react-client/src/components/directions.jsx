import React from 'react';

class Directions extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div className="direction-step">
        <div>{this.props.step.instructions.replace(/<..>|<.>|<d.*$/g, '')}</div>
        <div><em>{this.props.step.distance.text} {this.props.step.duration.text}</em></div>
      </div>
    )
  }
}

export default Directions;