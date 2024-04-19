import React, { useEffect, useState } from "react";
import axios from "axios";
import SpinnerComponent from "../../components/spinnerComponent";

import Base from "../../components/hospital/base";
import FooterComponent from "../../components/footerComponent";
import floorPlan from "../../assets/hospital/floorPlans/sampleFloorPlan.png";

// const serverURL = "https://vln-webapp.onrender.com";
const serverURL = "http://127.0.0.1:8000";

const HospitalPerformAction = () => {
    const [pastActions, setPastActions] = useState([]);
    const [recommendedAction, setRecommendedAction] = useState("");
    const [nextAction, setNextAction] = useState([]);
    const [current_location, setCurrentLocation] = useState("");
    const [current_observation, setCurrentObservation] = useState("");
    
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    const [recommendationLoading, setRecommendationLoading] = useState(true);

    useEffect(() => {
        setRecommendationLoading(true);
        axios
            .get(serverURL+"/hospital/performAction/")
            .then((response) => {
                setPastActions(response.data.past_actions);
                setNextAction(response.data.next_actions);
                setCurrentLocation(response.data.current_location);
                setCurrentObservation(response.data.current_observation);

                setOptions(response.data.next_actions);
                setSelectedOption(response.data.next_actions[0]);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
        
        axios
            .get(serverURL+"/hospital/actionRecommendation/")
            .then((response) => {
                let recommendedAction = response.data;
                console.log("Recommended Action: ", recommendedAction);
                if (recommendedAction.startsWith("> ")) {
                    recommendedAction = recommendedAction.slice(2);
                }
                setRecommendedAction(recommendedAction);
                setRecommendationLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });

        document.title = "Hospital | Perform Action"; // Set your desired page title here
    }, []);
    
    const [textInput, setTextInput] = useState('');
    const handleTextChange = (e) => {
        setTextInput(e.target.value);
        if (e.target.value === '') {
            setOptions(nextAction);
            return;
        }
        let filteredOptions = nextAction.filter((option) =>
            option.toLowerCase().includes(textInput.toLowerCase())
        );
        filteredOptions.push('-');
        setOptions(filteredOptions);
        setSelectedOption(filteredOptions[0]);
    };

    const handleSelectRecommendation = (e) => {
        if (recommendedAction === '') {
            return;
        }
        setSelectedOption(recommendedAction);
    };

    const handleChange = (e) => {
        setSelectedOption(e.target.value);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Selected option:', selectedOption);
        if (selectedOption == '-' || !options.includes(selectedOption)) {
            alert("Please select valid action");
            return;
        }
        const reqBody = {
            "action": selectedOption
        }

        axios
            .post(serverURL+"/hospital/performAction/", reqBody)
            .then((response) => {
                console.log(response);
                if (response.status === 201 || response.status === 200) {
                    const new_obv = response.data.observation;
                    const addToRecomendation = {
                        "action": selectedOption,
                        "observation": new_obv
                    }
                    let successMssg = "successfully completed the task";
                    // if the new observation is not empty, and contains the success message
                    // then alert the user that the task is completed
                    if (new_obv !== '' && new_obv.includes(successMssg)) {
                        alert("Task completed");
                    }
                    
                    axios
                        .post(serverURL+"/hospital/actionRecommendation/", addToRecomendation)
                        .then((response) => {
                            console.log(response);
                            if (response.status !== 201 || response.status !== 200) {
                                alert("Error adding to recommendation");
                            }
                        })
                        window.location.reload();
                }
                else {
                    alert("Error performing action");
                }
            })
    };
    const handleReset = (e) => {
        e.preventDefault();
        console.log('Resetting...');
        axios
            .delete(serverURL+"/hospital/reset/")
            .then((response) => {
                console.log(response);
                if (response.status === 204 || response.status === 201 || response.status === 200) {
                    axios
                        .delete(serverURL+"/hospital/actionRecommendation/")
                        .then((response) => {
                            console.log(response);
                            if (response.status !== 204 && response.status !== 201 && response.status !== 200) {
                                alert("Error deleting recommendation");
                            }
                        })
                    window.location.reload();
                }
                else {
                    alert("Error resetting");
                }
            })
    }

    return (
        <div>
            <Base />
            <div className='px-6 py-6'>
                <h1 className="mb-6 text-3xl ml-6">Actions</h1>
                <div className="flex">
                    <div className="w-3/4 p-8">
                        <table className="table-auto">
                            <thead>
                                <tr className="bg-gray-800 text-white">
                                    <th className="px-4 py-2">Action</th>
                                    <th className="px-4 py-2">Observation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pastActions.map(action => (
                                    <tr key={action.id} className="even:bg-gray-100 odd:bg-white">
                                        <td className="border px-4 py-2">{action.action}</td>
                                        <td className="border px-4 py-2">{action.observation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/4 flex justify-center">
                        <div className="w-full max-w-md p-8">
                            <img src={floorPlan} alt="Floor Plan" className="w-full h-auto zoom-img transition-transform duration-500 ease-in-out hover:scale-[2.5]" style={{ transformOrigin: 'top right' }} />
                        </div>
                    </div>
                </div>


                <div className="mt-6">
                    <p className="text-lg px-4 py-1"> <b>Current Location:</b> {current_location}</p>
                    <p className="text-lg px-4 py-1"> <b>Current Observation:</b> {current_observation}</p>
                </div>

                <div className="mx-6">
                    <form id="getNextAction" onSubmit={handleSubmit}>
                        <label> 
                            <div className="flex py-2 block mb-2 align-text-bottom">
                                <div className="mr-6 items-center">
                                    <label className="text-gray-700 text-2xl font-bold">Next Action:</label>
                                </div>
                                <div className="flex-1 flex items-center">
                                    <button type="button" className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-200">
                                        {
                                            recommendationLoading ?
                                            // <SpinnerComponent />
                                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0"
                                            >
                                                Loading...
                                            </span>
                                            :
                                            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0"
                                                onClick={handleSelectRecommendation}
                                            >
                                                {recommendedAction}
                                            </span>
                                            
                                            // <label className="flex flex-col block text-gray-400 hover:text-gray-500 hover:text-xl"
                                            //     onClick={handleSelectRecommendation}       
                                            // ></label>
                                        }
                                    </button>
                                </div>
                            </div>
                            <input 
                                type="text" 
                                className="px-4 py-2 shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                                id="searchAction" 
                                placeholder="Search..."
                                value={textInput}
                                onChange={handleTextChange}
                            />
                            <select value={selectedOption} onChange={handleChange} id="id_action" className="px-4 py-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                {options.map((action,idx) => (
                                    <option key={idx} value={action}>{action}</option>
                                ))}
                            </select>
                        </label>
                        <div className="flex items-center justify-between mt-4">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" 
                                    type="submit"
                            >
                                Submit
                            </button>
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                                type="reset"
                                onClick={handleReset}
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                <FooterComponent />
            </div>
        </div>
    );
}

export default HospitalPerformAction;