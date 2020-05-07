import React from 'react';
import Autosuggest from 'react-autosuggest';
import './VendorField.css';

const getSuggestions = (value, vendors) => {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  return inputLength === 0 ? [] : vendors.filter(v =>
    v.name.toLowerCase().slice(0, inputLength) === inputValue
  );
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => (
  <div>
    {suggestion.name}
  </div>
);

export default function VendorField(props) {
  const [value, setValue] = React.useState(props.value);
  const [suggestions, setSuggestions] = React.useState([]);
  const { vendors, onVendorChanged } = props;
  
  const onChange = (_, { newValue }) => {
    setValue(newValue)
    onVendorChanged(newValue);
  };

    const inputProps = {
      value: value,
      onChange: onChange
    };

  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value, vendors));
    };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
    );
}