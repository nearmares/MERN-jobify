import React, { useState } from 'react'
import { FormRow, Alert } from '../../components'
import Wrapper from '../../assets/wrappers/DashboardFormPage'
import { useAppContext } from '../../context/appContext'

function Profile() {

  const { user, showAlert, displayAlert, updateUser, isLoading } = useAppContext()

  const [ name, setName ] = useState(user?.name)
  const [ email, setEmail ] = useState(user?.email)
  const [ lastName, setLastName ] = useState(user?.lastName)
  const [ location, setLocation ]= useState(user?.location)

  const handleSubmit = e => {
    e.preventDefault()

    if(!name || !email || !lastName || !location){
      displayAlert()
      return
    }
    updateUser({ name, lastName, email, location})
  }

  return (
    <Wrapper>
      <form className='form' onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert/>}
        <div className="form-center">
          <FormRow 
            type='text' 
            name='name' 
            value={name} 
            handleChange={ e => setName(e.target.value)}
          />
          <FormRow 
            type='text' 
            labelText='Last Name'
            name='lastName' 
            value={lastName} 
            handleChange={ e => setLastName(e.target.value)}
          />
          <FormRow 
            type='text' 
            name='email' 
            value={email} 
            handleChange={ e => setEmail(e.target.value)}
          />
          <FormRow 
            type='text'
            name='location' 
            value={location} 
            handleChange={ e => setLocation(e.target.value)}
          />
          <button className="btn btn-block" disabled={isLoading} type='submit'>
            {isLoading ? 'Please wait...' : 'save changes'}
          </button>
        </div>
      </form>
    </Wrapper>
  )
}

export default Profile