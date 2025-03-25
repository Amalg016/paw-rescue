import Navbar from "./Staff/navbar";
import './Staff.css';

export default function StaffPage() {

    const { isAdmin, id } = JSON.parse(localStorage.getItem("userDetails")) || {};
    const isClientUser = !isAdmin && !!id;

    return (
        
        <div className="staffPage">
            <Navbar/>
            {isClientUser? <h1>Welcome User</h1> : <h1>Welcome Staff</h1>}
        </div>
    );
}