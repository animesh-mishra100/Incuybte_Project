// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const Navbar = () => {
//   const { isAuthenticated, user, logoutUser } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logoutUser();
//     navigate('/login');
//   };

//   const navStyle = {
//     background: '#333',
//     color: '#fff',
//     padding: '1rem',
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   };

//   const linkStyle = {
//     color: 'white',
//     textDecoration: 'none',
//     margin: '0 0.5rem',
//   };

//   return (
//     <nav style={navStyle}>
//       <h1>
//         <Link to="/" style={linkStyle}>
//           Sweet Shop
//         </Link>
//       </h1>
//       <ul style={{ display: 'flex', listStyle: 'none' }}>
//         {isAuthenticated ? (
//           <>
//             <li>
//               <span style={{ marginRight: '1rem' }}>Welcome, {user.email}!</span>
//             </li>
//             {user.role === 'admin' && (
//               <li>
//                 <Link to="/admin" style={linkStyle}>Admin Panel</Link>
//               </li>
//             )}
//             <li>
//               <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1rem' }}>
//                 Logout
//               </button>
//             </li>
//           </>
//         ) : (
//           <>
//             <li>
//               <Link to="/login" style={linkStyle}>
//                 Login
//               </Link>
//             </li>
//             <li>
//               <Link to="/register" style={linkStyle}>
//                 Register
//               </Link>
//             </li>
//           </>
//         )}
//       </ul>
//     </nav>
//   );
// };

// export default Navbar;

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css'; // <-- 1. Import the new CSS file

const Navbar = () => {
  const { isAuthenticated, user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // 2. Use CSS classes instead of inline styles
  return (
    <nav className="navbar"> 
      <div className="navbar-container">
        <h1>
          <Link to="/" className="navbar-logo">
            🍬 Sweet Shop
          </Link>
        </h1>
        <ul className="navbar-menu">
          {isAuthenticated ? (
            <>
              <li className="navbar-item">
                <span className="navbar-welcome">
                  Welcome, {user.email}!
                </span>
              </li>
              {user.role === 'admin' && (
                <li className="navbar-item">
                  <Link to="/admin" className="navbar-link">
                    Admin Panel
                  </Link>
                </li>
              )}
              <li className="navbar-item">
                <button onClick={handleLogout} className="navbar-link btn-logout">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link">
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;