import React from "react";
import { Grid } from "@material-ui/core";
import styles from "./Cards.module.css";
import CardTemplate from "./CardTemplate";

const CardList = ({ data: { confirmed, recovered, deaths, lastUpdate } }) => {
  return (
    <div className={styles.container}>
      <Grid container spacing={3} justify="center">
        <CardTemplate
          title="Active"
          type={confirmed}
          lastUpdate={lastUpdate}
        ></CardTemplate>
        <CardTemplate
          title="Recovered"
          type={recovered}
          lastUpdate={lastUpdate}
        ></CardTemplate>
        <CardTemplate
          title="Deaths"
          type={deaths}
          lastUpdate={lastUpdate}
        ></CardTemplate>
      </Grid>
    </div>
  );
};

export default CardList;
