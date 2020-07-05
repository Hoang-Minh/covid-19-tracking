import React from "react";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import CountUp from "react-countup";

const CardTemplate = ({ title, type, lastUpdate }) => {
  if (!type) {
    return null;
  }

  return (
    <Grid item component={Card}>
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
          {new Date(lastUpdate).toDateString()}
        </Typography>
        <Typography variant="body2">
          Number of active cases of Covid 19
        </Typography>
      </CardContent>
    </Grid>
  );
};

export default CardTemplate;
