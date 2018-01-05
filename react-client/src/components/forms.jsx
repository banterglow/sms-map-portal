import React from 'react';

class Forms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      origin: '',
      dest: '',
      phone: ''
    }
    this.submitMap = this.submitMap.bind(this);
    this.submitPhone = this.submitPhone.bind(this);
    this.changeOrigin = this.changeOrigin.bind(this);
    this.changeDest = this.changeDest.bind(this);
    this.changePhone = this.changePhone.bind(this);
  }

  changeOrigin(e) {
    this.setState({
      origin: e.target.value
    });
  }

  changeDest(e) {
    this.setState({
      dest: e.target.value
    });
  }

  changePhone(e) {
    this.setState({
      phone: e.target.value
    });
  }

  submitMap(e) {
    e.preventDefault();
    this.props.callbackDirections(this.state.origin, this.state.dest);
    this.setState({
      origin: '',
      dest: ''
    })
  }

  submitPhone(e) {
    e.preventDefault();
    this.props.callbackPhone(this.state.phone);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-9">
          <form ref="form" onSubmit={this.submitMap}>
            <input type="text" placeholder="origin" value={this.state.origin} onChange={this.changeOrigin} required/>
            <input type="text" placeholder="destination" value={this.state.dest} onChange={this.changeDest} required/>
            <button type="submit"> Submit </button>
          </form>
        </div>
        <div className="col-md-3">
          <form ref="form" onSubmit={this.submitPhone}>
            <input type="type" placeholder="send to phone" value={this.state.phone} onChange={this.changePhone} required/>
            <button type="submit"> Submit </button>
          </form>
        </div>
      </div>
    )
  }
}

export default Forms;