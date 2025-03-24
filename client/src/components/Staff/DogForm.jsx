import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';

import Navbar from "./navbar";
import axios from "axios";
import { BASE_URL } from "../../constants/api";


const DogForm = () => {
    const { dogId } = useParams(); // Access the dynamic parameter
    const navigate = useNavigate(); // Initialize useNavigate

    
    const [dogForm, setDogForm] = useState({
        name: "",
        age: "",
        breed: "",
        imageUrl: "",
    });

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setDogForm({
            ...dogForm,
            [name]: value,
        });
    }

    const handleAdd = async(formData) => {
        try {
            const response = await axios.post(`${BASE_URL}dogs`, formData);
            alert("Dog added successfully!");
            console.log(response.data);
            navigate("/staff/dogs"); 

        } catch (error) {
            console.error("Error adding dog:", error);
            alert("Failed to add dog.");
        }
    }

    const handleUpdate = async (formData, dogId) => {
        try {
            const response = await axios.patch(`${BASE_URL}dogs/${dogId}`, formData);
            alert("Dog updated successfully!");
            navigate("/staff/dogs"); 
            console.log(response.data);
        } catch (error) {
            console.error("Error updating dog:", error);
            alert("Failed to update dog.");
        }
    }

    const handleFormSubmit = () => {
        // take shelter from api response and save it in localstorage and read it here and append it to formData
        const { shelter } = JSON.parse(localStorage.getItem("userDetails")) // read it form localstorage
        const formData = {
            ...dogForm,
            shelter
        }

        dogId ? handleUpdate(formData, dogId) : handleAdd(formData);
    }

    useEffect(() => {
        if(!dogId) return;

        const fetchDogDetailsById = async (dogId) => {
            try{
                const response = await axios.get(`${BASE_URL}dogs/${dogId}`);
                setDogForm(response.data);
            }catch(error){
                console.error("Error updating dog:", error);
                alert("Failed to get dog.");
            }
            // call fetch to get the dog details of dogId and set it to state
        }

        fetchDogDetailsById(dogId);
    }, [dogId])

    return (
        <div className="staffPage">
            <Navbar/>
            <div className="dogForm">

                <div className="form-group">
                    <label>Dog Name</label>
                    <input type="text" name="name" placeholder="Dog name" value={dogForm.name} onChange={handleFormChange} />
                </div>

                <div className="form-group">
                <label>Age</label>
                <input type="text" name="age" placeholder="Age" value={dogForm.age} onChange={handleFormChange} />
                </div>

                <div className="form-group">
                <label>Breed</label>
                <input type="text" name="breed" placeholder="Breed" value={dogForm.breed} onChange={handleFormChange} />
                </div>

                <div className="form-group">
                <label>Image URL</label>
                <input type="text" name="imageUrl" placeholder="Image URL" value={dogForm.imageUrl} onChange={handleFormChange} />
                </div>

                <button onClick={handleFormSubmit}>{`${dogId ? 'Update' : 'Add'}`} Dog</button>
        </div>
       </div>
    )
}

export default DogForm;