import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'
// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

const URL = 'http://localhost:9009/api/order'

const initialValues = {fullName: '', size: '', toppings: []}
const initialErrors = {fullName: '', size: '', toppings: []}
// 👇 Here you will create your schema.
const schema = yup.object().shape({
  fullName: yup
    .string()
    .trim()
    .min(3, validationErrors.fullNameTooShort)
    .max(20, validationErrors.fullNameTooLong)
    .required(),
  size: yup
    .string()
    .oneOf(['S', 'M', 'L',], validationErrors.sizeIncorrect)
    .required(),
  toppings: yup
    .array()
});



// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]


export default function Form() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState(initialErrors);
  const [enabled, setEnabled] = useState(false)
  const [success, setSuccess] = useState(false)
  const [failure, setFailure] = useState(false)


  

  const handleNameChange = (evt) => {
    const {value, id, type} = evt.target
    setValues({...values, [id]: value})
    yup
    .reach(schema, id)
    .validate(value)
    .then(() => {
      setErrors({ ...errors, [id]: "" });
    })
    .catch((err) => {
      setErrors({ ...errors, [id]: err.errors[0] });
    });
    document.getElementById('fullName').value = '';
    document.getElementById('size').value = '';
  }


  const handleCheck = (evt) => {
    const value = evt.target.name;
    if(values.toppings.includes(value)){
      return
    } else {
      setValues({...values, toppings: [...values.toppings, value]})
    }
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    axios
      .post("http://localhost:9009/api/order", values)
      .then((res) => {
        setSuccess(res.data.message);
        setValues(initialValues);
        setErrors(initialErrors)
      })
      .catch((err) => {
        setFailure(err.response.data.message);
      });
  };


  useEffect(() => {
    schema.isValid(values).then(isValid => {
      setEnabled(isValid)
    })
  }, [values])



  return (
    
      <form onSubmit={handleSubmit}>
        <h2>Order Your Pizza</h2>
        {success && <div className='success'>{success}</div>}
        {failure && <div className='failure'>{failure}</div>}
        <div className="input-group">
          <div>
            <label htmlFor="fullName">Full Name</label><br />
            <input placeholder="Type full name" id="fullName" type="text" value={values.fullName} onChange={handleNameChange}/>
          </div>
          {errors.fullName && <span className='error'>{errors.fullName}</span>}
        </div>

        <div className="input-group">
            <label htmlFor="size">Size</label>
            <select id="size" onChange={handleNameChange}>
              <option value="">----Choose Size----</option>
              {/* Fill out the missing options */}
              <option value="S">Small</option>
              <option value="M">Medium</option>
              <option value="L">Large</option>
            </select>
            {errors.size && <span className='error'>{errors.size}</span>}
        </div>

        <div className="input-group">
          {/* 👇 Maybe you could generate the checkboxes dynamically */}
      {toppings.map(topping => (
        <label key={topping.topping_id}>
          <input name={topping.topping_id} type='checkbox' onChange={handleCheck} />
          {topping.text}
        </label>
      ))}

        </div>
        {/* 👇 Make sure the submit stays disabled until the form validates! */}
        <input disabled={!enabled} type="submit" />
      </form>
  )
  
}
