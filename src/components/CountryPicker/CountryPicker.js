import React, { useState, useEffect } from "react";
import { NativeSelect, FormControl } from "@material-ui/core";
import { fetchCountries } from "../../api";
import styles from "./CountryPicker.module.css";

const CountryPicker = ({ handleCountryChanged }) => {
  const [fetchedCountries, setFetchedCountries] = useState([]);

  useEffect(() => {
    const fetchApi = async () => {
      setFetchedCountries(await fetchCountries());
    };

    fetchApi();
  }, [setFetchedCountries]);

  const renderedCountries = (countries) => {
    return countries.map((country) => (
      <option key={country} value={country}>
        {country}
      </option>
    ));
  };

  return (
    <FormControl className={styles.formControl}>
      <NativeSelect
        defaultValue=""
        onChange={(e) => handleCountryChanged(e.target.value)}
      >
        <option value="">Global</option>
        {renderedCountries(fetchedCountries)}
      </NativeSelect>
    </FormControl>
  );
};

export default CountryPicker;
