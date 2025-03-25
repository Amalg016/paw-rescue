import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // If using React Router
import './navbar.css'; // Optional styling

const Navbar = () => {
    const [ dummy, setDummy ] = useState(0);
    
    const { isAdmin, id } = JSON.parse(localStorage.getItem("userDetails")) || {};
    const isClientUser = !isAdmin && !!id;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/staff" className="navbar-logo">
          Dog Shelter
        </Link>
        
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/staff/dogs" className="nav-links">
              List Dogs
            </Link>
          </li>
          {isClientUser ? null :
            <li className="nav-item">
            <Link to="/staff/approvals" className="nav-links">
              Approvals
            </Link>
          </li>
          }
          
          {/* <li className="nav-item">
            <Link to="/staff/volunteer" className="nav-links">
              Volunteer
            </Link>
          </li> */}
          {id ? <li className="nav-item">
            <span onClick={() => {
                setDummy(prev => prev + 1);
                localStorage.removeItem("userDetails")
            }} className="nav-links">
              Logout
            </span>
          </li>
          :
          <li className="nav-item">
          <Link to="/signin" className="nav-links">
            Signin
          </Link>
        </li>
          }
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;