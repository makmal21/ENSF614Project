// Flights.js
import React, {useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Flights.css';
import moment from 'moment'; //new library for formating date



function Flights() {

    const[flights, setFlights] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { from, to } = location.state || {}; // Make sure 'guests' is destructured here
    const [selectedFlight, setSelectedFlight] = useState(null);

    useEffect(() => {
      axios.post('http://localhost:8081/Flights', {from, to })
      .then(res => {
        console.log(res);
        setFlights(res.data);
  }).catch(err => console.log(err));

  }, [from, to]);

    // navigates to the seat-select page with the FlightID
    const handleSeatSelectClick = () => {
    if (selectedFlight) {
      navigate('/seat-select', { state: { flightId: selectedFlight } });
      } else {
      alert("Please select a flight first.");
      }
    };

    

    return (
      <div>
        <h1>Flights</h1>
        <p>Showing flights from {from || 'your departure city '} to {to || 'your destination: '} </p>

        <div className="d-flex justify-content-center align-items-center">
                <table className='w-50 table table-bordered table-striped'>
                   <thead>
                    <tr>
                    <th>FlightID</th>
                    <th>Destination</th>
                    <th>Origin</th>
                    <th>Departure Date</th>
                    <th>Price CAD$</th>
                    </tr>                    
                   </thead>
                   <tbody>
                    {
                        flights.map((data,i)=> (
                          <tr key={i} 
                          onClick={() => setSelectedFlight(data.FlightID)} 
                          className={selectedFlight === data.FlightID ? 'selected-flight' : ''}
                          style={{ cursor: 'pointer' }}> 
                                <td>{data.FlightID} </td>
                                <td>{data.Origin} </td>
                                <td>{data.Destination} </td>
                                <td>{moment(data.DepartureDate).format('YYYY-MM-DD HH:mm:ss')} </td>
                                <td>{data.Price} </td>
                                
                            </tr> 
                        ))
                    } 
                   </tbody> 
                </table>
          </div>
          <button onClick={handleSeatSelectClick} disabled={!selectedFlight}>Proceed to Seat Selection</button> 
      </div>
    );
  }

export default Flights;
