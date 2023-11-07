import { useEffect, useReducer } from "react";
import "./App.css";

const fetchReducer = (state, action) => {
  switch (action.type) {
    case "pending": {
      return { status: "pending", data: null, error: null };
    }
    case "resolved": {
      console.log("resolved", action);
      return { status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      return { status: "rejected", data: null, error: action.error };
    }
    default: {
      throw new Error("This shouldn't be possible");
    }
  }
};

const useFetch = (asyncCallback, initialState, dependenciesArr) => {
  const [state, dispatch] = useReducer(fetchReducer, {
    status: initialState ? "pending" : "idle",
    data: null,
    error: null,
  });

  useEffect(() => {
    const promise = asyncCallback();

    if (!promise) {
      return;
    }
    dispatch({ type: "pending" });
    promise
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        return dispatch({ type: "resolved", data });
      })
      .catch((error) => {
        return dispatch({ type: "rejected", error });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependenciesArr);

  return state;
};

const fetchUrl = "https://swapi.dev/api/people/1";

const cb = () => {
  return fetch(fetchUrl);
};

function App() {
  const state = useFetch(cb, { status: "idle", data: null, error: null }, [
    fetchUrl,
  ]);

  const { status, data } = state;

  useEffect(() => {
    console.log(state);
  }, [state]);

  console.log(status);

  switch (status) {
    case "idle": {
      return <>idle</>;
    }
    case "pending": {
      return <>pending</>;
    }
    case "resolved": {
      return <>{data.name}</>;
    }
    case "rejected": {
      return <>rejected</>;
    }
    default: {
      return <>shoudnt happend</>;
    }
  }
}

export default App;
