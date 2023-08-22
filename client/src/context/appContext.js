import React, { useReducer, useContext, useEffect } from 'react'
import reducer from './reducer.js'
import { 
  DISPLAY_ALERT, 
  CLEAR_ALERT,
  REGISTER_USER_BEGIN, 
  REGISTER_USER_SUCCESS, 
  REGISTER_USER_ERROR,
  LOGIN_USER_BEGIN,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_ERROR,
  EDIT_JOB_SUCCESS,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS
} from './actions.js'
import axios from 'axios'


const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: '',
  alertType: '',
  user: null,
  userLocation: '',
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company:'',
  jobLocation: '',
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: "full-time",
  statusOptions: ['interview', 'declined', 'pending'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a']
}

const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [state, dispatch ] = useReducer(reducer, initialState)

  // axios
  const authFetch = axios.create({
    baseURL: '/api/v1',
  })

  // *** INTERCEPTORS REQUEST FROM AXIOS ****
  // authFetch.interceptors.request.use(
  //   (config) => {
  //     config.headers['Authorization'] = `Bearer ${state.token}`
  //     return config
  //   },
  //   (error) => {
  //     console.log(error.request)
  //     return Promise.reject(error)
  //   }
  // )

  // interceptors response
  authFetch.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if(error.response.status === 401){
        console.log('AUTH ERROR 401')
        logoutUser()
      } 
      return Promise.reject(error)
    }
  )

  const displayAlert = () => {
    dispatch({type: DISPLAY_ALERT})
    clearAlert()
  }

  const clearAlert = () => {
    setTimeout(()=>{
      dispatch({type: CLEAR_ALERT})
    }, 3000)
  }

  // const addUserToLocalStorage = ({ user, token, location}) => {
  //   localStorage.setItem('user', JSON.stringify(user))
  //   localStorage.setItem('token', token)
  //   localStorage.setItem('location', location)
  // }

  // const removeUserFromLocalStorage = () => {
  //   localStorage.removeItem('user')
  //   localStorage.removeItem('token')
  //   localStorage.removeItem('location')
  // }

  const registerUser = async (currentUser) => {
    dispatch({ type: REGISTER_USER_BEGIN})
    try {
      const response = await axios.post('/api/v1/auth/register', currentUser)
      const { user, location } = response.data
      dispatch({
        type: REGISTER_USER_SUCCESS,
        payload: {
          user,
          location
        }
      })
    } catch (error) {
      console.log(error.response)
      dispatch({ 
        type: REGISTER_USER_ERROR, 
        payload: { msg: error.response.data.msg} 
      })
    }
    clearAlert()
  }

  const loginUser = async (currentUser) => {
    dispatch({ type: LOGIN_USER_BEGIN})
    try {
      const { data } = await axios.post('/api/v1/auth/login', currentUser)
      
      const { user, location } = data

      dispatch({
        type: LOGIN_USER_SUCCESS,
        payload: {
          user,
          location
        }
      })
    } catch (error) {
      dispatch({ 
        type: LOGIN_USER_ERROR, 
        payload: { msg: error.response.data.msg} 
      })
    }
    clearAlert()
  }

  const toggleSidebar = ()=> {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const logoutUser = async () => {
    await authFetch.get('/auth/logout')
    dispatch({ type: LOGOUT_USER})
  }

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN })

    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser)
    
      const { user, location } = data

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location}
      })
    } catch(error) {
      console.log(error)
      if( error.response.status !== 401) {
        dispatch({
          type: UPDATE_USER_ERROR, 
          payload: {
            msg: error.response.data.msg
          }
        })
      }
    }
    clearAlert()
  } 

  const handleChange = ({ name, value }) => {
    dispatch({ type: HANDLE_CHANGE, payload: { name, value }})
  }

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES})
  }

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })

    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.post('/jobs', {
        position,
        company,
        jobLocation,
        jobType,
        status
      })
      dispatch({ type: CREATE_JOB_SUCCESS }) 
      dispatch({ type: CLEAR_VALUES })

    } catch (error) {
      if( error.response.status === 401) return
      dispatch({ 
        type: CREATE_JOB_ERROR, 
        payload: { 
          msg: error.response.data.msg
        }
      })
    }
    clearAlert()
  }


  const getJobs = async () => {
    const { search, searchStatus, searchType, sort, page } = state
    
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    
    if (search) {
      url = url + `&search=${search}`
    }
    dispatch({ type: GET_JOBS_BEGIN })
    
    try {
      const { data } = await authFetch(url)
      const { jobs, totalJobs, numOfPages } = data
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages
        }
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const setEditJob = id => {
    console.log(`set edit job: ${id}`)
    dispatch({ type: SET_EDIT_JOB, payload: { id }})
  }

  const editJob= async id => {
    dispatch({ type: EDIT_JOB_BEGIN })
    try {
      const { position, company, jobLocation, jobType, status } = state
      await authFetch.patch(`/jobs/${state.editJobId}`,{
        company,
        position,
        jobLocation,
        jobType,
        status
      })
      dispatch({ type: EDIT_JOB_SUCCESS })
      dispatch({ type: CLEAR_VALUES })
    } catch(error) {
      if(error.response.status === 401) return
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg }
      })
    }
    clearAlert()
  }

  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN})
    try {
      await authFetch.delete(`/jobs/${jobId}`)
      getJobs()
    } catch (error) {
      logoutUser()
    }
  }

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })

    try {
      const { data } = await authFetch('/jobs/stats')
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications
        }
      })

    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS})
  }

  const changePage = page => {
    dispatch({ type: CHANGE_PAGE, payload: { page }})
  }

  const getCurrentUser = async() => {
    dispatch({ type: GET_CURRENT_USER_BEGIN } )
    try {
      const { data } = await authFetch('/auth/getCurrentUser')
      const { user, location } = data 
      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { user, location }
      })
    } catch (error) {
      if(error.response.status === 401) return
      logoutUser()
    }
  }

  useEffect( () => {
    getCurrentUser()
  }, [])

  return (
    <AppContext.Provider 
      value={{
        ...state, 
        displayAlert, 
        registerUser, 
        loginUser, 
        toggleSidebar, 
        logoutUser, 
        updateUser, 
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        showStats,
        clearFilters,
        changePage
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

// HOOK para usar el context
const useAppContext = () => {
  return useContext(AppContext)
}

export { AppProvider, initialState, useAppContext }