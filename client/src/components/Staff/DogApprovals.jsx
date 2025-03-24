import axios from "axios";
import React, { useState, useEffect } from "react";
import { BASE_URL } from "../../constants/api";

import './dogApprovals.css';

const DogApprovals = () => {
    const { id } = JSON.parse(localStorage.getItem("userDetails")) || {};
    const [approvalsList, setApprovalsList] = useState([]);

    useEffect(() => {
        if(!id) return;

        const fetchApprovalsList = async () => {
            try{
                const response = await axios.get(`${BASE_URL}approvals/${id}`);
                setApprovalsList(response.data);
            }catch(error){
                console.error("Error fetching approvals:", error);
                alert("Failed to get approval list.");
            }
        }

        fetchApprovalsList();
    }, [id])


    const handleToggle = async (index) => {
        const { dog, status, userId } = approvalsList[index];
        const { id: dogId } = dog || {};

        const newStatus = true;
        try {
            const response = await axios.patch(`${BASE_URL}approvals/${id}`, { userId, dogId, status: newStatus });
            alert("Approval status updated successfully!");
            console.log(response.data);

            approvalsList[index].status = newStatus;
            setApprovalsList([...approvalsList]);
        } catch (error) {
            console.error("Error updating approval status:", error);
            alert("Failed to update approval status.");

            approvalsList[index].status = status;
            setApprovalsList([...approvalsList]);
        }
    }

    return (
        <div className="staffPage">
            <h1>Approvals</h1>

<div style={{ width: '50%' }}>

            <table className="approvalsTable">
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Action</th>
            </tr>

            {approvalsList.map((approvalItem, index) => {
                const { dog, status  } = approvalItem;
                const { name } = dog || {};
                return (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{name}</td>
                        <td>
                            {!status ? <input 
                                type="checkbox"
                                checked={!!status}
                                onChange={() => handleToggle(index)}
                             /> : <span style={{ color: 'green' }}>Already approved</span>}
                        </td>
                    </tr>
            )})}
        </table>
        </div>

       </div>
    )
}

export default DogApprovals;