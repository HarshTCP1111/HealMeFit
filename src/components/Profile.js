// src/components/Profile.js
import React, { useState } from 'react';

const Profile = () => {
    const [Address, setAddress] = useState('');
    const [Name, setName] = useState('');
    const [Lastname, setLastname] = useState('');
    const [Email, setEmail] = useState('');
    const [Phone, setPhone] = useState('');
    const [DOB, setDOB] = useState('');
  return (
    <div style={styles.profile}>
      <h2>Tyler Adams</h2>
      <button style={styles.editButton}>Edit photo</button>
      <div style={styles.personalInfo}>
        <h3>Personal Info</h3>
        <div style={styles.inputGroup}>
          <label>First Name</label>
          <input type="Name" required value={Name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label>Last Name</label>
          <input type="Lastname" required value={Lastname} onChange={(e) => setLastname(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label>Date of Birth</label>
          <input type="DOB" required value={DOB} onChange={(e) => setDOB(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label>Email</label>
          <input type="Email" required value={Email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label>Phone</label>
          <input type="Phone" required value={Phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div style={styles.inputGroup}>
          <label>Address</label>
          <input type="Address" required value={Address} onChange={(e) => setAddress(e.target.value)} />
        </div>
      </div>
      <div style={styles.companyInfo}>
        <h3>Company Related Info</h3>
        <div style={styles.inputGroup}>
          <label>Driver N°</label>
          <input type="text" />
        </div>
        <div style={styles.inputGroup}>
          <label>Truck N°</label>
          <input type="text" />
        </div>
        <div style={styles.inputGroup}>
          <label>License Plate</label>
          <input type="text" />
        </div>
        <div style={styles.inputGroup}>
          <label>Insurance N°</label>
          <input type="text" />
        </div>
      </div>
      <button style={styles.saveButton}>Save changes</button>
    </div>
  );
};

const styles = {
  profile: {
    padding: '20px',
  },
  editButton: {
    marginBottom: '20px',
  },
  personalInfo: {
    marginBottom: '20px',
  },
  inputGroup: {
    marginBottom: '10px',
  },
  companyInfo: {
    marginBottom: '20px',
  },
  saveButton: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    cursor: 'pointer',
  },
};

export default Profile;
