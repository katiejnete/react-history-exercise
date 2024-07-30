import React, { Component } from "react";
import JokeList from "./JokeList";
import Joke from "./Joke";

/** App component. Renders list of jokes. */

const App = () => {
  return (
    <div className="App">
      <JokeList numJokes={5} />
    </div>
  );
};

export default App;
