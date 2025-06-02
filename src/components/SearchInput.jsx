import React from "react";

const SearchInput = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Escribe el nombre de un Pokémon..."
      value={value}
      onChange={(event) => onChange(event.target.value.trim())}
      className="search-input"
      autoFocus
    />
  );
};

export default SearchInput;
