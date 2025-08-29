import '../styles/homePageStyle.css'

const Home = () => {
  const userData = JSON.parse(localStorage.getItem('userData')) || {};

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    window.location.href = '/auth/login';
  };

  return (
    <div className='home-page'>
      <header className="home-header">
        <p>Welcome to</p> 
        <h1>Unstop</h1>
      </header>

      <main className="profile-card">
        <img className='profile-img' src='/ProfileImage.jpg' alt="Profile" width={120} height={120} />
        <div className="profile-details">
          <h3>{userData.firstName} {userData.lastName}</h3>
          <p>{userData.email}</p>
          <p>{userData.gender}</p>
        </div>

        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </main>
    </div>
  )
}

export default Home