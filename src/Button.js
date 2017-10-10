import React, { Component } from 'react';
const Box = x =>
  ({
    map: f => Box(f(x)),
    fold: f => f(x),
    inspect: () => `Box(${x})`
  });

const fpCharCode = str =>
  Box(str)
  .map(s => s.trim())
  .map(s => parseInt(s))
  .map(i => i + 1)
  .map(i => String.fromCharCode(i))
  .fold(c => console.log(c))

class Button extends Component {
  handleClick = () => {
    fpCharCode(`${this.props.i}`)
  }
  render() {
    return(
      <button
        onClick={ this.handleClick }
      >
        { `Button ${this.props.i}` }
      </button>
    )
  }
}

export default Button;