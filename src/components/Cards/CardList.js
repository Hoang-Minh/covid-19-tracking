import React from "react";
import { Grid } from "@material-ui/core";
import styles from "./Cards.module.css";
import CardTemplate from "./CardTemplate";

const CardList = ({ data: { confirmed, recovered, deaths, lastUpdate } }) => {
  const dataArray = [
    {
      className: "infected",
      title: "Active",
      type: confirmed,
      lastUpdate,
      description: "Number of active cases of Covid 19",
    },
    {
      className: "recovered",
      title: "Recovered",
      type: recovered,
      lastUpdate,
      description: "Number of recovered from Covid 19",
    },
    {
      className: "deaths",
      title: "Deaths",
      type: deaths,
      lastUpdate,
      description: "Number of deaths caused by Covid 19",
    },
  ];

  const renderContent = () => {
    return dataArray.map((each) => (
      <CardTemplate
        className={each.className}
        title={each.title}
        type={each.type}
        lastUpdate={each.lastUpdate}
        description={each.description}
      ></CardTemplate>
    ));
  };

  return (
    <div className={styles.container}>
      <Grid container spacing={3} justify="center">
        {renderContent()}
      </Grid>
    </div>
  );
};

export default CardList;
