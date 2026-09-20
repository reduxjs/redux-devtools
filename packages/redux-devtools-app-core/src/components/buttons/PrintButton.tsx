import React, { Component } from 'react';
import { Button } from '@redux-devtools/ui';
import { MdPrint } from 'react-icons/md';

export default class PrintButton extends Component {
  shouldComponentUpdate() {
    return false;
  }

  handlePrint = () => {
    const d3svg = document.getElementById('d3svg') as unknown as SVGGElement;
    if (!d3svg) {
      window.print();
      return;
    }

    const initHeight = d3svg.style.height;
    const initWidth = d3svg.style.width;
    const box = d3svg.getBBox();
    d3svg.style.height = `${box.height}`;
    d3svg.style.width = `${box.width}`;

    const g = d3svg.firstChild! as SVGGElement;
    const initTransform = g.getAttribute('transform')!;
    g.setAttribute(
      'transform',
      initTransform.replace(/.+scale\(/, 'translate(57, 10) scale('),
    );

    window.print();

    d3svg.style.height = initHeight;
    d3svg.style.width = initWidth;
    g.setAttribute('transform', initTransform);
  };

  render() {
    return (
      <Button title="Print" onClick={this.handlePrint}>
        <MdPrint />
      </Button>
    );
  }
}
