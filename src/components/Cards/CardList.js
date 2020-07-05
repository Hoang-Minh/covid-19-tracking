import React from "react";
import { Grid } from "@material-ui/core";
import styles from "./Cards.module.css";
import CardTemplate from "./CardTemplate";

const CardList = ({ data: { confirmed, recovered, deaths, lastUpdate } }) => {
  return (
    <div className={styles.container}>
      <Grid container wrap="nowrap" spacing={3} justify="center">
        <CardTemplate
          className="infected"
          title="Active"
          type={confirmed}
          lastUpdate={lastUpdate}
          description="Number of active cases of Covid 19"
        ></CardTemplate>
        <CardTemplate
          className="recovered"
          title="Recovered"
          type={recovered}
          lastUpdate={lastUpdate}
          description="Number of recovered from Covid 19"
        ></CardTemplate>
        <CardTemplate
          className="deaths"
          title="Deaths"
          type={deaths}
          lastUpdate={lastUpdate}
          description="Number of deaths caused by Covid 19"
        ></CardTemplate>
      </Grid>
    </div>
  );
};

export default CardList;
