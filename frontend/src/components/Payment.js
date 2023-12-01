import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import {useNavigate, useLocation} from 'react-router-dom'
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row'; // Import Row
import Col from 'react-bootstrap/Col'; // Import Col
import PaymentValidation from './PaymentValidation';
import axios from 'axios';

function Payment() {
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  const navigate = useNavigate();
  const [errors, setErrors] = useState("");
  const location = useLocation()
  const {selectedSeat} = location.state || {};

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  let price = 0.0;

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors(PaymentValidation(paymentDetails))
    console.log(selectedSeat)
    if(errors.cardNumber === "" && errors.cardholderName === "" && errors.expiryMonth === "" && errors.expiryYear === "" && errors.cvv === ""){
      console.log("made it")
      axios.post('http://localhost:8081/price', {selectedSeat})
      .then(res => {
          console.log(res.data.price)
          price = res.data.price;
      })
      .catch(err => console.log(err));
      axios.post('http://localhost:8081/pay', [paymentDetails,price])
      .then(res => {
          
      })
      .catch(err => console.log(err));
  }
  };

  return (
    <div>
      <h2>Payment Details</h2>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='p-3 bg-white w-25'>
          <p>Total: <b>$INSERT PRICE FROM BACKEND HERE</b></p>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Card Number"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                required
              />
              {errors.cardNumber && <span className='text-danger'> {errors.cardNumber}</span>}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Cardholder Name"
                name="cardholderName"
                value={paymentDetails.cardholderName}
                onChange={handleInputChange}
                required
              />
              {errors.cardholderName && <span className='text-danger'> {errors.cardholderName}</span>}
            </Form.Group>


            <Row>
              {/* Expiry Month */}
              <Form.Group as={Col} xs={5} controlId="formExpiryMonth">
                <Form.Label>Expiry Month</Form.Label>
                <Form.Select
                  name="expiryMonth"
                  value={paymentDetails.expiryMonth}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Month</option>
                  {/* Month options */}
                  {[...Array(12).keys()].map((month) => (
                    <option key={month + 1} value={month + 1}>
                      {month + 1}
                    </option>
                  ))}
                </Form.Select>
                {errors.expiryMonth && <span className='text-danger'> {errors.expiryMonth}</span>}
              </Form.Group>

              {/* Expiry Year */}
              <Form.Group as={Col} md={5} controlId="formExpiryYear">
                <Form.Label>Expiry Year</Form.Label>
                <Form.Select
                  name="expiryYear"
                  value={paymentDetails.expiryYear}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Year</option>
                  {/* Year options */}
                  {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i+1).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </Form.Select>
                {errors.expiryYear && <span className='text-danger'> {errors.expiryYear}</span>}
              </Form.Group>
            </Row>


            <Form.Group className="mb-3">
              <p></p>
              <Form.Label>CVV</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter CVV"
                name="cvv"
                value={paymentDetails.cvv}
                onChange={handleInputChange}
                required
              />
              {errors.cvv && <span className='text-danger'> {errors.cvv}</span>}
            </Form.Group>

            <Button variant="success" type="submit">
              Submit Payment
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
