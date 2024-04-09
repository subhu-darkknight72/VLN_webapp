import React from "react";
import { Link } from "react-router-dom";

import Base from "../components/hospital/base";
import FooterComponent from "../components/footerComponent";

import Button from 'react-bootstrap/Button';

const Home = () => {
    return (
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
    );
}

export default Home;