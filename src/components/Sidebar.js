// src/components/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [logoDropdownVisible, setLogoDropdownVisible] = useState(false);

  const handleLogoClick = () => {
    setLogoDropdownVisible(!logoDropdownVisible);
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo} onClick={handleLogoClick}>
        LOGO
        {logoDropdownVisible && (
          <div style={styles.logoDropdown}>
            <div style={styles.dropdownItem}>Logo 1</div>
            <div style={styles.dropdownItem}>Logo 2</div>
            <div style={styles.dropdownItem}>Logo 3</div>
          </div>
        )}
      </div>
      <ul style={styles.menu}>
        <li style={styles.menuItem}>
          <Link to="/home" style={styles.link}>Home</Link>
        </li>
        <li style={styles.menuItem}>
          <Link to="/health" style={styles.link}>Health</Link>
        </li>
        <li style={styles.menuItem}>
          <Link to="/documents" style={styles.link}>Documents</Link>
        </li>
      </ul>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#0b3251',
    padding: '20px',
    color: 'white',
  },
  logo: {
    fontSize: '24px',
    marginBottom: '20px',
    cursor: 'pointer',
    position: 'relative',
  },
  logoDropdown: {
    position: 'absolute',
    top: '40px',
    left: '0',
    backgroundColor: 'white',
    color: '#0b3251',
    width: '100px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  dropdownItem: {
    padding: '10px',
    cursor: 'pointer',
  },
  menu: {
    listStyleType: 'none',
    padding: 0,
  },
  menuItem: {
    padding: '10px 0',
    cursor: 'pointer',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
};

export default Sidebar;
