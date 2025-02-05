import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

/** List of jokes. */

const JokeList = ({ numJokes }) => {
  const [jokes, setJokes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  /* at mount, retrieve jokes from API */

  useEffect(
    function getJokesAtMount() {
      async function getJokes() {
        try {
          // load jokes one at a time, adding not-yet-seen jokes
          let storedJokes = [];
          let seenJokes = new Set();

          while (jokes.length < numJokes) {
            let res = await axios.get("https://icanhazdadjoke.com", {
              headers: { Accept: "application/json" },
            });
            let { ...joke } = res.data;

            if (!seenJokes.has(joke.id)) {
              seenJokes.add(joke.id);
              jokes.push({ ...joke, votes: 0 });
            } else {
              console.log("duplicate found!");
            }
          }

          setJokes(jokes);
          setIsLoading(false);
        } catch (err) {
          console.error(err);
        }
      }

      getJokes();
    },
    [jokes]
  );

  /* empty joke list, set to loading state, and then call getJokes */

  const generateNewJokes = () => {
    setIsLoading(true);
    setJokes([]);
  };

  /* change vote for this id by delta (+1 or -1) */

  const vote = (id, delta) => {
    setJokes((jokes) =>
      jokes.map((j) => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    );
  };

  let sortedJokes = [...jokes].sort((a, b) => b.votes - a.votes);

  //   /* render: either loading spinner or list of sorted jokes. */

  return (
    <>
      {isLoading && (
        <div className="loading">
          <i className="fas fa-4x fa-spinner fa-spin" />
        </div>
      )}
      {!isLoading && (
        <div className="JokeList">
          <button className="JokeList-getmore" onClick={generateNewJokes}>
            Get New Jokes
          </button>

          {sortedJokes.map((j) => (
            <Joke
              text={j.joke}
              key={j.id}
              id={j.id}
              votes={j.votes}
              vote={vote}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default JokeList;
