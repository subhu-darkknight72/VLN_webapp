import React, { Component } from 'react';
import BaseComponent from './baseComponent';

class Base extends BaseComponent {
  render() {
    return (
      <div>
        {super.render()}
        {/* <div className="p-4">
          <h1 className="text-2xl font-semibold text-center">Hospital Management System</h1>
        </div> */}
      </div>
    );
  }
}

export default Base;