import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Base from "../../components/hospital/base";
import FooterComponent from "../../components/footerComponent";
import floorPlan from "../../assets/hospital/floorPlans/sampleFloorPlan.png";

import Form from 'react-bootstrap/Form';

const HospitalPerformAction = () => {
    const [pastActions, setPastActions] = useState([]);
    const [nextAction, setNextAction] = useState([]);
    const [current_location, setCurrentLocation] = useState("");
    const [current_observation, setCurrentObservation] = useState("");
    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/hospital/performAction/")
            .then((response) => {
                setPastActions(response.data.past_actions);
                setNextAction(response.data.next_actions);
                setCurrentLocation(response.data.current_location);
                setCurrentObservation(response.data.current_observation);
            })
            .catch((error) => {
                console.error("Error fetching data: ", error);
            });
    }, []);
    console.log("pastActions", pastActions);
    console.log("nextAction", nextAction);
    console.log("current_location", current_location);
    console.log("current_observation", current_observation);

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
                                    <tr className="even:bg-gray-100 odd:bg-white">
                                        <td className="border px-4 py-2">{action.action}</td>
                                        <td className="border px-4 py-2">{action.observation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="w-1/4 flex justify-center items-center">
                        <div className="w-full max-w-md p-8">
                            <img src={floorPlan} alt="Floor Plan" className="w-full h-auto zoom-img transition-transform duration-500 ease-in-out hover:scale-[2.5]" style={{ transformOrigin: 'top right' }} />
                        </div>
                    </div>
                </div>


                <div className="mt-6">
                    <p className="text-lg px-4 py-1"> <b>Current Location:</b> {current_location}</p>
                    <p className="text-lg px-4 py-1"> <b>Current Observation:</b> {current_observation}</p>
                </div>

                                
                {/* <form id="getNextAction" action="." method="post" enctype="multipart/form-data">
                    {% csrf_token %}
                    <div class="mb-4">
                        <label for="id_action" class="px-4 py-2 block text-gray-700 text-2xl font-bold mb-2">Next Action:</label>
                        <input type="text" class="px-4 py-2 shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="searchAction" placeholder="Search...">
                            <select name="action" id="id_action" class="px-4 py-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                {% for action in nextAction.action_space %}
                                <option value="{{ action }}">{{ action }}</option>
                                {% endfor %}
                            </select>
                    </div>

                    <div class="flex items-center justify-between">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" type="submit">
                            Submit
                        </button>
                        <button
                            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" type="reset"
                            onclick="location.href='{% url 'hospitalReset' %}'"
                        >
                            Reset
                        </button>
                    </div>
                </form> */}
                {/* <script>
            // Get the search input element
                    var input = document.getElementById("searchAction");

                    // Get the dropdown element
                    var select = document.getElementById("id_action");

                    // Add event listener for input change
                    input.addEventListener("input", function() {
                // Get the search query
                var query = input.value.toLowerCase();
                    var regex = new RegExp(query, 'i');

                    // Get all options in the dropdown
                    var options = select.getElementsByTagName("option");

                    // Loop through each option
                    for (var i = 0; i < options.length; i++) {
                    var option = options[i];
                    var text = option.text.toLowerCase();
                    // Check if the option's text matches the search query using regex
                    if (text=="-" || text.includes(query) || query === '') {
                        // If it does, show the option
                        console.log(text, "searching for", query);
                    option.removeAttribute('hidden')
                    } else {
                        // Otherwise, hide the option
                        option.setAttribute('hidden', 'hidden');
                    }
                }

                    // Set the default option to the first visible option
                    var defaultOption = select.querySelector('option:not([hidden])');
                    if (defaultOption) {
                        defaultOption.selected = true;
                }
            });
                </script> */}
                <FooterComponent />
            </div>
        </div>
    );
}

export default HospitalPerformAction;