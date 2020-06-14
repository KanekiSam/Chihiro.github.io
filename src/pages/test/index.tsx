import React from 'react';

class Test extends React.Component {
  // state = { count: 0 };
  // componentWillMount() {
  //   this.setState({ count: {count:this.state.count + 1} });
  //   console.log(this.state.count);
  //   this.setState({ count: {count:this.state.count + 1} });
  //   console.log(this.state.count);
  //   setTimeout(() => {
  //     this.setState({ count: {count:this.state.count + 1} });
  //     console.log(this.state.count);
  //     this.setState({ count: {count:this.state.count + 1} });
  //     console.log(this.state.count);
  //   }, 0);
  // }
  // render() {
  //   return <div style={{ fontSize: 100 }}>{this.state.count}</div>;
  // }
  constructor() {
    super(...arguments);

    this.onClick = this.onClick.bind(this);
    this.onClickLater = this.onClickLater.bind(this);

    this.state = {
      count: 0,
    };
  }
  increment(state, props) {
    return { count: state.count + 1 };
  }
  onClick() {
    this.setState(this.increment.bind(this));
    this.setState(this.increment.bind(this));
    this.setState(this.increment.bind(this));
    // this.setState({ count: this.state.count + 1 });
    // this.setState({ count: this.state.count + 1 });
    // this.setState({ count: this.state.count + 1 });
    // this.setState({ count: this.state.count + 1 });
    this.setState(this.increment.bind(this));
    this.setState(this.increment.bind(this));
    this.setState(this.increment.bind(this));
  }

  onClickLater() {
    setTimeout(() => {
      this.onClick();
    });
  }

  componentDidMount() {
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    this.setState({ count: this.state.count + 1 });
    console.log('addEventListener');
    document.querySelector('#btn-raw').addEventListener('click', this.onClick);
  }
  render() {
    console.log('#enter render');
    // tslint:disable-next-line:no-console
    console.log(this.state.count);
    return (
      <div>
        <div>
          {this.state.count}
          <button onClick={this.onClick}>Increment</button>
          <button id="btn-raw">Increment Raw</button>
          <button onClick={this.onClickLater}>Increment Later</button>
        </div>
      </div>
    );
  }
}
export default Test;
