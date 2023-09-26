import React, { useState } from 'react';
import axios from 'axios';
import './PincodeLookup.css'; 

function PincodeLookup() {
  // Define state variables
  const [pincode, setPincode] = useState(''); // For user input of pincode
  const [pincodeDetails, setPincodeDetails] = useState(null); // For storing pincode details
  const [error, setError] = useState(null); // For handling errors during API requests

  // Event handler for input change
  const handlePincodeChange = (event) => {
    setPincode(event.target.value);
    setPincodeDetails(null); // Reset pincode details when pincode changes
  };

  // Function to fetch pincode details from the API
  const handleLookup = async () => {
    try {
      const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
      const data = response.data;

      // Check if the API response indicates success
      if (data[0].Status === 'Success') {
        const pincodeData = data[0].PostOffice[0];
        // Update pincodeDetails with retrieved data
        setPincodeDetails({
          city: pincodeData.Block,
          district: pincodeData.District,
          state: pincodeData.State,
          postal: pincodeData.Pincode,
        });
        setError(null); // Reset error state
      } else {
        setError('Pincode not found'); // Set error message for invalid pincode
        setPincodeDetails(null);
      }
    } catch (error) {
      console.error('Error fetching pincode details:', error);
      setError('An error occurred. Please try again later.'); // Set error message for network error
      setPincodeDetails(null);
    }
  };

  // Render the component
  return (
    <div className="PincodeLookup">
      <h1>Pincode Reverse Lookup</h1>
      <input
        type="text"
        placeholder="Enter Pincode"
        value={pincode}
        onChange={handlePincodeChange}
      />
      <button onClick={handleLookup}>Lookup</button>
      {error && <p className="error">{error}</p>}
      {pincodeDetails && !error && (
        <div>
          <p>City: {pincodeDetails.city}</p>
          <p>District: {pincodeDetails.district}</p>
          <p>State: {pincodeDetails.state}</p>
          <p>Postal Code: {pincodeDetails.postal}</p>
        </div>
      )}
    </div>
  );
}

export default PincodeLookup;

