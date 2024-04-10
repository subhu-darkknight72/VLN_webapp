import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

class BaseComponent extends Component {
	render() {
		return (
			// <Navbar expand="lg" className="bg-body-tertiary">
			// 	<Container>
			// 		<Navbar.Brand href="/hospital">Hospital</Navbar.Brand>
			// 		<Navbar.Toggle aria-controls="basic-navbar-nav" />
			// 		<Navbar.Collapse id="basic-navbar-nav">
			// 			<Nav className="me-auto">
			// 				<Nav.Link href="/">Home</Nav.Link>
			// 			</Nav>
			// 		</Navbar.Collapse>
			// 	</Container>
			// </Navbar>
			
			<div className='mb-4'>
				<div className="flex justify-between p-6 space-x-4">
					<div className="w-1/2">
						<Link to="/hospital" className="text-xl font-semibold">Hospital</Link>
					</div>
					<div className="w-2/2 flex justify-end">
						<Link to="/" className="px-3 text-lg font-semibold hover:text-gray-500">Home</Link>
					</div>
				</div>
				<hr className="my-0 border-gray-300 flex-grow mt-1 mb-1" tyle={{ width: '100%' }} />
			</div>
		);
	}
}

export default BaseComponent;
