import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import Base from "../../components/hospital/base";
import FooterComponent from "../../components/footerComponent";
import hospitalImage from "../../assets/hospital/hospitalImage.png";

import Button from 'react-bootstrap/Button';

// const serverURL = "https://vln-webapp.onrender.com";
const serverURL = "http://127.0.0.1:8000";

const HospitalIndex = () => {
    const [taskList, setTaskList] = useState([]);
    const [taskOptions, setTaskOptions] = useState([]);
    const [task, setTask] = useState("");
    const [textInput, setTextInput] = useState("");

    useEffect(() => {
        document.title = "VLN | Hospital"; // Set your desired page title here
        axios
            .get(serverURL+"/hospital/task/")
            .then((response) => {
                setTask(response.data.recent);
                setTaskList(response.data.all);

                setTaskOptions(response.data.all);
            })
            .catch((error) => {
                console.log(error);
            });

      }, []);
    
    const handleTextChange = (e) => {
        setTextInput(e.target.value);
        if (e.target.value === '') {
            setTaskOptions(taskList);
            alert('Please enter a non-empty task');
            return;
        }

        setTask(textInput);
        let filteredOptions = taskOptions.filter((option) =>
            option.toLowerCase().includes(textInput.toLowerCase())
        );
        setTaskOptions(filteredOptions);
    };

    const handleChange = (e) => {
        // setSelectedOption(e.target.value);
        setTask(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task === '') {
            alert('Please select a task');
            return;
        }

        const payload = {
            task: task,
        }
        axios
            .post(serverURL+"/hospital/task/", payload)
            .then((response) => {
                console.log(response);
                console.log("Task entered")
                if (response.status !== 204 && response.status !== 201 && response.status !== 200) {
                    alert("Error entering task");
                    return;
                }
                axios
                .delete(serverURL+"/hospital/reset/")
                .then((response) => {
                    console.log(response);
                    console.log("Hospital reset")
                    if (response.status !== 204 && response.status !== 201 && response.status !== 200) {
                        alert("Error resetting hospital");
                        return;
                    }
                    
                    axios
                    .delete(serverURL+"/hospital/actionRecommendation/")
                    .then((response) => {
                        console.log(response);
                        console.log("Recommendation deleted")
                        if (response.status !== 204 && response.status !== 201 && response.status !== 200) {
                            alert("Error deleting recommendation");
                            return;
                        }
                        window.location.href = "/hospital/perform-action";
                    })
                })
            })
            .catch((error) => {
                console.log(error);
            });

        return;
    };

    const handleReset = (e) => {
        e.preventDefault();
        console.log('Resetting...');
        axios
            .delete(serverURL+"/hospital/task/")
            .then((response) => {
                console.log(response);
                if (response.status !== 204 && response.status !== 201 && response.status !== 200) {
                    alert("Error reseting task");
                    return;
                }
                window.location.reload();
            })
            .catch((error) => {
                console.log(error);
            });
        return;
    }

    return (
        <div>
            <Base />
            <div className='px-6 py-6'>
                <h1 className="flex justify-center mb-6 text-3xl">Welcome to the hospital</h1>
                <input 
                    type="text" 
                    className="px-4 py-2 shadow appearance-none border-2 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" 
                    id="searchAction" 
                    placeholder={task}
                    value={textInput}
                    onChange={handleTextChange}
                />
                <select value={task} onChange={handleChange} id="id_action" className="px-4 py-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                    {taskList.map((task,idx) => (
                        <option key={idx} value={task}>{task}</option>
                    ))}
                </select>

                <div className="flex justify-center mt-6 items-center">
                    <Button 
                        className="bg-emerald-500 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" 
                        onClick={handleSubmit}
                    >
                        Enter the Hospital
                    </Button>
                    <button
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-6 rounded ml-2 focus:outline-none focus:shadow-outline"
                        type="reset"
                        onClick={handleReset}
                    >
                        Reset
                    </button>
                </div>

                <div className="flex justify-center mt-6">
                    <img src={hospitalImage} alt="Hospital" className="w-1/2 h-auto zoom-img transition-transform duration-500 ease-in-out hover:scale-125" />
                </div>
                <FooterComponent />
            </div>
        </div>
    );
}

export default HospitalIndex;