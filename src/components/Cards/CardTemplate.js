import React from "react";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import CountUp from "react-countup";
import cx from "classnames";
import styles from "./Cards.module.css";

const CardTemplate = ({ className, title, type, lastUpdate, description }) => {
  if (!type) {
    return null;
  }

  return (
    <Grid
      item
      component={Card}
      className={cx(styles.card, styles[className])}
      xs={12}
      sm={3}
    >
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5">
          <CountUp
            start={0}
            end={type.value}
            duration={1}
            separator=","
          ></CountUp>
        </Typography>
        <Typography color="textSecondary">
          {new Date(lastUpdate).toLocaleDateString()}
        </Typography>
        <Typography variant="body2">{description}</Typography>
      </CardContent>
    </Grid>
  );
};

export default CardTemplate;
