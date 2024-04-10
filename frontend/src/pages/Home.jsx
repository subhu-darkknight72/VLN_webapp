import React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

import Base from "../components/hospital/base";
import FooterComponent from "../components/footerComponent";

import Button from 'react-bootstrap/Button';

const Home = () => {
    useEffect(() => {
        document.title = "VLN | Environments"; // Set your desired page title here
      }, []);
    return (
        <div>
            <div className='mb-4'>
				<div className="flex justify-between p-6 space-x-4">
					<div className="w-1/2">
						<Link to="/" className="text-xl font-semibold">Environments</Link>
					</div>
				</div>
				<hr className="my-0 border-gray-300 flex-grow mt-1 mb-1" tyle={{ width: '100%' }} />
			</div>

            <div className='px-6 py-6'>
                <div className="flex items-center justify-center">
                    <div className="w-48 text-sm font-medium bg-gray-700 border-gray-600 text-white rounded-lg">
                        <a href="#" aria-current="true" className="block w-full px-4 py-2 text-black bg-white border-b border-gray-600 rounded-t-lg cursor-pointer">
                            Choose one:
                        </a>
                        <Link to="/hospital" className="block w-full px-4 py-2 border-b border-gray-600 cursor-pointer hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-white">
                            Hospital
                        </Link>
                        <Link to="#" className="block w-full px-4 py-2 border-b border-gray-600 cursor-pointer hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:text-white">
                            Others
                        </Link>
                    </div>
                </div>
                <FooterComponent />
            </div>
        </div>
    );
}

export default Home;