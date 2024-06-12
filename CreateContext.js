import React, { createContext, useState, useContext } from 'react';

// Create the context
const SelectedTagsContext = createContext();

// Create a custom hook to access the context
export const useSelectedTagsContext = () => {
  return useContext(SelectedTagsContext);
};

// Create a provider component
export const SelectedTagsProvider = ({ children }) => {
  const [selectedTags, setSelectedTags] = useState({});

  return (
    <SelectedTagsContext.Provider value={{ selectedTags, setSelectedTags }}>
      {children}
    </SelectedTagsContext.Provider>
  );
};

export { SelectedTagsContext };
