import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StaffPage from './components/Staff';
import UserPage from './components/User';
import NotFound from './components/NotFound';
import StaffDogList from './components/Staff/DogList';

import DogForm from './components/Staff/DogForm';
import SignIn from './components/Auth/SignIn';
import DogApprovals from './components/Staff/DogApprovals';

window.alert = (message) => {
  let toast = document.getElementById("toast");
  toast.classList.add("show");
  toast.innerHTML = message;
  setTimeout(() => {
    toast.classList.remove("show");
    toast.innerHTML = '';
  }, 3000); // Hide after 3 seconds
}

function AuthGuard({ children }){
  const { isAdmin } = JSON.parse(localStorage.getItem("userDetails")) || {};
  const isAuthenticated = isAdmin;

    if (!isAuthenticated) {
      // Redirect to the sign-in page if not authenticated
      return <Navigate to="/signin" replace />;
  }

  // Render the children if authenticated
  return children;
  }


function UserAuthGuard({ children }){
  const { isAdmin, id } = JSON.parse(localStorage.getItem("userDetails")) || {};
  const isAuthenticated = !isAdmin && !!id;

    if (!isAuthenticated) {
      // Redirect to the sign-in page if not authenticated
      return <Navigate to="/signin" replace />;
  }

  // Render the children if authenticated
  return children;
  }

function App() {
  // const [count, setCount] = useState(0);


  return (
    <Routes>
      <Route path="/" element={<StaffPage />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/staff" element={<AuthGuard><StaffPage /></AuthGuard>} />
      <Route path="/staff/dogs" element={<StaffDogList />} />
      <Route path="/staff/dogs/add" element={<AuthGuard><DogForm /></AuthGuard>} />
      <Route path="/staff/dogs/edit/:dogId" element={<AuthGuard><DogForm /></AuthGuard>} />
      <Route path="/staff/approvals" element={<AuthGuard><DogApprovals /></AuthGuard>} />
      <Route path="/staff/volunteer" element={<AuthGuard><StaffPage /></AuthGuard>} />
      <Route path="/user" element={<UserAuthGuard><UserPage /></UserAuthGuard>} />
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  );
}

export default App;

