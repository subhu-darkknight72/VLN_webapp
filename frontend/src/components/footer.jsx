import React, { Component } from 'react';
import FooterComponent from './footerComponent';

class Footer extends FooterComponent {
  render() {
    return (
      <div>
        {super.render()}
        <div className="p-4">
          <h1 className="text-2xl font-semibold text-center">Footer</h1>
        </div>
      </div>
    );
  }
}

export default Footer;