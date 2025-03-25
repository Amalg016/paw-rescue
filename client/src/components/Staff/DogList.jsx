import React, { useState, useEffect } from "react";
import Navbar from "./navbar";
import './dogList.css';
import AddButton from "../AddButton";
import { BASE_URL } from "../../constants/api";
import axios from "axios";
import { Link } from "react-router-dom";

export default function StaffDogList() {
    const [dogsList, setDogsList] = useState([]);
    const [dogsMap, setDogsMap] = useState({});

    const { isAdmin, id } = JSON.parse(localStorage.getItem("userDetails")) || {};
    const isClientUser = !isAdmin && !!id;

    useEffect(() => {

        const fetchDogs = async () => {
            try{
                const response = await axios.get(`${BASE_URL}dogs`);
                const approvalsResponse = await axios.get(`${BASE_URL}approvals/${id}`);
                const approvalsList = approvalsResponse.data;

                const dogIdMap = approvalsList.reduce((acc, item) => {
                    const { dog, status } = item;
                    const { id } = dog || {};
                    return { ...acc, [id]: { ...dog, status } }
                }, {});

                setDogsMap(dogIdMap);

                console.log(response.data);
                setDogsList(response.data);
            }catch(error){
                console.error("Error updating dog:", error);
                alert("Failed to get dog.");
            }
        }

        fetchDogs();
    }, [])


    const handleAdopt = async (currentDog, index, e) => {
        e && e.stopPropagation();

        try {
            const response = await axios.post(`${BASE_URL}approvals`, { id, dogId: currentDog.id });
            
            const newDogsMap = { ...dogsMap, [currentDog.id]: { ...currentDog, status: false } };
            setDogsMap(newDogsMap);
            alert("Dog adopted successfully!");
            console.log(response.data);
        } catch (error) {
            console.error("Error adopting dog:", error);
            alert("Failed to adopt dog");
        }
    }

    return (
        <div className="staffPage">
            <Navbar/>
            <div className="dog-list">
                <div className="dogs-container">
                    {dogsList.map((dog, index) => {
                        const dogDetails = dogsMap[dog.id] || {};
                        const { id, status: isAdopted } = dogDetails;
                        const statusText = isAdopted ? "Adopted" : "Pending status";

                        const linkURL = isAdmin ? `/staff/dogs/edit/${dog.id}` : '';

                        return (
                            <>
                    <div key={dog.id} className="dog-card">
                            <Link to={linkURL}>
                        <img 
                        src={dog.imageUrl} 
                        alt={`${dog.name} the ${dog.breed}`}
                        onError={(e) => {
                            e.target.src = 'https://placedog.net/300/200';
                        }}
                        />
                        <div className="dog-info">
                        <h2>{dog.name}</h2>
                        <p><strong>Breed:</strong> {dog.breed}</p>
                        <p><strong>Age:</strong> {dog.age} years</p>
                        <p><strong>Shelter:</strong> {dog.shelter}</p>

                        
                        </div>
                   
                    </Link>
                        {isClientUser && (!id ? <span style={{ backgroundColor: '#666' }} className="adopt-btn" onClick={(e) => handleAdopt(dog, index, e)}>Adopt</span> : <span className="adopt-btn" style={{ color: isAdopted ? 'green' : 'orange' }}>{statusText}</span>)}
                    </div>
                        </>
                    )})}
                </div>
            </div>
            {isClientUser? null : <AddButton />}
            
        </div>
    );
}