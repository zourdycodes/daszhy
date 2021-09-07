import React, { useState, useEffect, useCallback } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

export const GithubContext = React.createContext();

export const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);

  // request loading
  const [request, setRequest] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // error handling
  const [error, setError] = useState({ show: false, msg: "" });

  // search github user
  const searchGithubUser = async (user) => {
    toggleError();
    setIsLoading(true);

    const response = await axios(`${rootUrl}/users/${user}`);

    if (response) {
      setGithubUser(response.data);
    } else {
      toggleError(true, "there is no user with that username!");
    }

    checkRequest();
    setIsLoading(false);
  };

  // check rate
  const checkRequest = useCallback(async () => {
    await axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining, limit },
        } = data;

        console.log(remaining);

        setRequest({ remaining, limit });

        if (remaining === 0) {
          // throw an error
          toggleError(true, "sorry, you have exceeded your hourly rate limit!");
        }
      })
      .catch((err) => {
        throw new Error(err);
      });
  }, []);

  function toggleError(show, msg) {
    setError({ show, msg });
  }

  // fetch data
  useEffect(() => {
    checkRequest();
  }, [checkRequest]);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        request,
        error,
        searchGithubUser,
        isLoading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};
