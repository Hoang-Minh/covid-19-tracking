import React from "react";
import { Card, CardContent, Typography, Grid } from "@material-ui/core";
import CountUp from "react-countup";

const CardTemplate = ({
  data: { confirmed, recovered, deaths, lastUpdate },
}) => {
  return (
    <Grid item component={Card}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          Infected
        </Typography>
        <Typography variant="h5">
          <CountUp
            start={0}
            end={confirmed.value}
            duration={2.5}
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
