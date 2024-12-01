import React, { createContext, useState, useContext } from 'react';

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState('user1');

  const changeUser = (stringUser) => {
    setCurrentUser(stringUser);
  };

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, changeUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  return useContext(UserContext);
};
