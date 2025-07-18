import {
  getDecodedToken,
  getUserId,
  getUserRoleType,
} from "../services/jwtService";

import "../styles/HomePage.scss"

export default function HomePage() {
  const user = getDecodedToken();
  //const role = getUserRoleType();
  //const id = getUserId();
  console.log(user);
  
  const username = user?.username || "Guest";

  return (
    <div className="home-container">
      
      <div className="welcome-container" >
      <h1 className="heading">Welcome, {username}!</h1>
      </div>
      <img className="home-photo"
        src="/public/homepageimage.jpeg"
        alt="Welcome"
      />
    
      
    </div>
  );
}

