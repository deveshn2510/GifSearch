import {
  Typography,
  OutlinedInput,
  Box,
  Grid,
  CircularProgress,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import { useRef } from "react";
import { postSearchGIF } from "../../Utils/ApiServices";

const useStyles = makeStyles((theme) => ({
  image: {
    height: 216,
    width: 200,
    "&:hover": {
      cursor: "pointer",
    },
    border: "1px solid black",
    borderRadius: 6,
  },
}));

export default function Homepage() {
  const classes = useStyles();
  const [searchValue, setSearchValue] = useState("");
  const [totalCount, setTotalCount] = useState();
  const [data, setData] = useState();
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = () => {
    if (searchValue !== "") {
      postSearchGIF(searchValue)
        .then((res) => {
          setRecentSearches([...recentSearches, { title: searchValue }]);
          setData([...res.data]);
          setTotalCount(res?.pagination?.total_count);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  console.log(recentSearches);

  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const callbackFunction = (entries) => {
    const [entry] = entries;
    setIsVisible(entry.isIntersecting);
  };

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  };

  useEffect(() => {
    const observer = new IntersectionObserver(callbackFunction, options);
    if (containerRef.current) observer.observe(containerRef.current);

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, [containerRef, options]);

  useEffect(() => {
    if (isVisible === true) {
      postSearchGIF(searchValue, data.length - 1)
        .then((res) => {
          setData([...data, ...res.data]);
          setTotalCount(res?.pagination?.total_count);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [isVisible === true]);

  console.log(searchValue);

  return (
    <Box mt={2}>
      <Typography fontWeight={600} fontSize={16}>
        GIF SEARCH ENGINE
      </Typography>
      <Grid
        container
        mt={2}
        justifyContent="center"
        direction="row"
        alignItems="center"
        spacing={2}
      >
        <Grid item>
          <Autocomplete
            freeSolo
            sx={{ width: 300 }}
            onChange={(event, newValue) => {
              setSearchValue(newValue);
            }}
            disableClearable
            options={recentSearches.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  type: "search",
                }}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                }}
              />
            )}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>
      <Grid container justifyContent={"center"} spacing={2} mt={2}>
        {data &&
          data.map((el) => {
            return (
              <Grid item md={3} sm={6} xs={12} key={el.id}>
                <Box elevation={1}>
                  <img
                    src={el.images.original_still.url}
                    className={classes.image}
                    id={el.id}
                    onClick={() => {
                      if (
                        document.getElementById(el.id).src ===
                        el.images.original_still.url
                      ) {
                        document.getElementById(el.id).src =
                          el.images.preview_gif.url;
                      } else {
                        document.getElementById(el.id).src =
                          el.images.original_still.url;
                      }
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
      </Grid>
      {data && data.length < totalCount && (
        <Box ref={containerRef}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
}
