// src/components/Dashboard.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Profile from './Profile';

const Dashboard = () => {
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);

  const handleProfileHover = () => {
    setProfileDropdownVisible(true);
  };

  const handleProfileLeave = () => {
    setProfileDropdownVisible(false);
  };

  return (
    <div style={styles.container}>
      <Sidebar />
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.searchContainer}>
            <input type="text" placeholder="Search" style={styles.searchInput} />
            <div style={styles.searchIcon}>🔍</div>
          </div>
          <div 
            style={styles.profileContainer} 
            onMouseEnter={handleProfileHover} 
            onMouseLeave={handleProfileLeave}
          >
            <div style={styles.notification}>🔔</div>
            <div style={styles.profile}>TA</div>
            {profileDropdownVisible && (
              <div style={styles.profileDropdown}>
                <div style={styles.dropdownItem}>Profile</div>
                <div style={styles.dropdownItem}>Devices</div>
                <div style={styles.dropdownItem}>Logout</div>
              </div>
            )}
          </div>
        </div>
        <Profile />
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  },
  searchContainer: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: '4px',
    padding: '5px 10px',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
  },
  searchIcon: {
    marginLeft: '10px',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
  },
  notification: {
    marginRight: '10px',
  },
  profile: {
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '50%',
    padding: '10px',
    textAlign: 'center',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  profileDropdown: {
    position: 'absolute',
    top: '50px',
    right: '0',
    backgroundColor: 'white',
    color: '#0b3251',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 1,
  },
  dropdownItem: {
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default Dashboard;
