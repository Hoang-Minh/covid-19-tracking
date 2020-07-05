import React from "react";
import styles from "./App.module.css";
import { fetchData } from "./api";
import CardList from "./components/Cards/CardList";
import Chart from "./components/Chart/Chart";

class App extends React.Component {
  state = {
    data: {},
    country: "",
  };

  async componentDidMount() {
    const data = await fetchData();
    this.setState({ data });
  }

  handleCountryChanged = async (country) => {
    const data = await fetchData(country);
    this.setState({ data, country: country });
  };

  render() {
    const { data, country } = this.state;
    return (
      <div className={styles.container}>
        <img
          className={styles.image}
          src="https://directorsblog.nih.gov/wp-content/uploads/2020/03/COVID-19-Card-3.jpg"
          alt="covid-19 update"
        ></img>
        <CardList data={data}></CardList>
        <Chart data={data} country={country}></Chart>
      </div>
    );
  }
}

export default App;
