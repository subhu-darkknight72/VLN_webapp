import React, { Component } from 'react';
import { Link } from "react-router-dom";

class FooterComponent extends Component {
    render() {
        return (
            <footer className="bg-gray-800 rounded-lg shadow m-4">
                <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
                    <span className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                        {/* <a href="http://cse.iitkgp.ac.in/~subhajyoti.halder/" class="hover:underline me-4 md:me-6" target="_blank">Subhajyoti Halder</a> */}
                        <Link to="http://cse.iitkgp.ac.in/~subhajyoti.halder/" className="hover:underline me-4 md:me-6" target="_blank">Subhajyoti Halder</Link>
                    </span>
                </div>
            </footer>
        );
    }
}

export default FooterComponent;
