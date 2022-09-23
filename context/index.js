import { useReducer, createContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

// initial state
const initialState = {
  user: null
};


// create context
const Context = createContext();

// root reducer
const rootReducer = (state, action) => {
  switch(action.type) {
    case "LOGIN":
      return {...state, user: action.payload};
    case "LOGOUT":
      return {...state, user: null}
    default:
        return state;
  }
}

// context prodvier
const Provider = ({children}) => {
  const router = useRouter();
  const [state, dispatch] = useReducer(rootReducer, initialState);

  useEffect(() => {
    dispatch({
      type: 'LOGIN',
      payload: JSON.parse(window.localStorage.getItem('user'))
    })
  }, []);

  axios.interceptors.response.use(
    function(response) {
      return response;
    },

    function(error) {
      let res = error.response;
      console.log('error', error)
      if (res.status === 401 && res.config) {
        return new Promise((resolve, reject) => {
          axios
            .get('/api/auth/logout')
            .then(data => {
              console.log('/401 -> Log out');
              dispatch({ type: 'LOGOUT' });
              window.localStorage.removeItem('user');
              router.push('/signin');
            })
            .catch(err => {
              console.log('axios interceptors error', err);
              reject(err);
            })
        })
      }
      return Promise.reject(error);
    }
  )

  return (
    <Context.Provider value={{state, dispatch}}>
      {children}
    </Context.Provider>
  )
}

export { Context, Provider }
