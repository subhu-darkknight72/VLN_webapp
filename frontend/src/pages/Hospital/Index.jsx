import React from "react";
import { Link } from "react-router-dom";

import Base from "../../components/hospital/base";
import FooterComponent from "../../components/footerComponent";

import Button from 'react-bootstrap/Button';

const HospitalIndex = () => {
    return (
        <div className='px-6 py-6'>
            <Base />
            <h1 className="flex justify-center mb-6 text-3xl">Welcome to the hospital</h1>
            <div className="flex justify-center">
                <Button className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" href="/hospital/perform-action">Enter the Hospital</Button>
            </div>

            <div className="flex justify-center mt-6">
                <img src="https://github.com/subhu-darkknight72/VLN_WebApp_backend/blob/main/static/hospital/hospitalImage.png?raw=true" alt="Hospital" className="w-1/2 h-auto zoom-img transition-transform duration-500 ease-in-out hover:scale-125" />
            </div>
            <FooterComponent />
        </div>
    );
}

export default HospitalIndex;