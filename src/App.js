import React, { useState, useEffect, useMemo } from "react";
import { gameData } from "./data/games";

const GameList = () => {
  /* 
    instruction: set up the following states
    - games: array of games. use gameData as initial value
    - perPage: number of games per page
    - currentPage: current page number
    - totalPages: total number of pages
    - searchTerm: search term for title search
    - sort: sort by title or rating
  */
  const [games, setGames] = useState(gameData);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("");
  const [perPage, setPerPage] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");

  const genres = useMemo(() => {
    let options = [];
    // instruction: get all genres from gameData
    gameData.forEach((game) => {
      game.genres.forEach((genre) => {
        // to make sure the genre wasn't already in the options
        if (!options.includes(genre)) {
          options.push(genre);
        }
      });
    });
    return options;
  }, [gameData]);

  useEffect(() => {
    let newGames = [...gameData];

    // instruction: do title search using the searchTerm state
    if (searchTerm !== "") {
      newGames = newGames.filter((g) =>
        g.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    // instruction: do genre filter using the selectedGenre state
    if (selectedGenre !== "") {
      newGames = newGames.filter((g) => g.genres.includes(selectedGenre));
    }
    // instruction: retrieve total pages
    const total = Math.ceil(newGames.length / perPage);
    // instruction: set totalPages state
    const pages = [];
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
    setTotalPages(pages);
    // instruction: sort by title or rating
    switch (sort) {
      case "title":
        newGames = newGames.sort((a, b) => {
          return a.title.localeCompare(b.title);
        });
        break;
      case "rating":
        newGames = newGames.sort((a, b) => {
          return a.rating - b.rating;
        });
        break;
      default:
        break;
    }
    // instruction: do pagination using the currentPage and perPage states
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;

    newGames = newGames.slice(start, end);

    // instruction: set games state with newGames variable
    setGames(newGames);
  }, [gameData, selectedGenre, sort, perPage, currentPage, searchTerm]);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-6">
          <input
            type="text"
            placeholder="Search"
            // instruction: assign searchTerm state to value
            value={searchTerm}
            onChange={(e) => {
              // instruction: set searchTerm state
              setSearchTerm(e.target.value);
              // instruction: reset current page back to 1
            }}
          />
        </div>
        <div className="col-6 text-end mb-3">
          <select
            className="me-1 mb-1"
            // instruction: assign sort state to value
            value={sort}
            onChange={(e) => {
              // instruction: set sort state
              setSort(e.target.value);
              // instruction: reset current page back to 1
              setCurrentPage(1);
            }}
          >
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
          </select>

          <select
            className="me-1 mb-1"
            // instruction: assign selectedGenre state to value
            value={selectedGenre}
            onChange={(e) => {
              // instruction: set selectedGenre state
              setSelectedGenre(e.target.value);
              // instruction: reset current page back to 1
              setCurrentPage(1);
            }}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => {
              return (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              );
            })}
          </select>
          <select
            className="me-1 mb-1"
            // instruction: assign perPage state to value
            value={perPage}
            onChange={(e) => {
              // instruction: set perPage state
              setPerPage(parseInt(e.target.value));
              // instruction: reset current page back to 1
              setCurrentPage(1);
            }}
          >
            <option value={6}>6 per page</option>
            <option value={10}>10 per page</option>
            <option value={gameData.length}>All</option>
          </select>
        </div>
      </div>
      {/* 
        instruction: 
        - display the games here
        - responsive layout: 1 column for mobile, 2 columns for tablet, 3 columns for desktop
      */}
      <div className="row">
        {games.map((game) => {
          return (
            <div className="col-lg-4 col-md-6 col-xs-12" key={game.title}>
              <div className="card">
                <div className="card-body mx-auto">
                  <img
                    src={"/images/" + game.image}
                    alt={game.title}
                    width="300px"
                  />
                  <h4 className="card-title">{game.title}</h4>
                  <p className="card-text">Genre: {game.genres.join(", ")}</p>
                  <p className="card-text">Rating: {game.rating}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2">
        {/* instruction: display pagination buttons here */}
        <span
          style={{
            marginRight: "10px",
          }}
        >
          Page {currentPage} of {totalPages.length}
        </span>
        {totalPages.map((page) => {
          return (
            <button
              key={page}
              onClick={() => {
                setCurrentPage(page);
              }}
            >
              {page}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default GameList;
