import jwt from 'jsonwebtoken'
import { UnauthenticatedError } from "../errors/index.js"

const auth = async (req, res, next ) => {

  const token = req.cookies.token
  if(!token){
    throw new UnauthenticatedError('Authentication Invalid')
  }

  // checking the headers
  //const authHeader = req.headers.authorization
  //if(!authHeader || !authHeader.startsWith('Bearer')){
  //  throw new UnauthenticatedError('Authentication Invalid (headers)')
  //}
  //const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify( token, process.env.JWT_SECRET)
    req.user = { userId: payload.userId}
  } catch(error) {
    throw new UnauthenticatedError('Authentication invalid(jwt)')
  }
  
  console.log('authenticate User!')
  next()

}

export default auth