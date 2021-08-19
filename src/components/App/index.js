import React, { useEffect, useState } from "react";
import "./styles.css";
import Tmdb from "../Tmdb";
import MovieRow from "../MovieRow";
import FeaturedMovie from "../FeaturedMovie";
import Header from "../Header";

export default () => {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      //pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      //pegando o featured movie
      let originals = list.filter((i) => i.slug === "originals");
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, "tv");
      setFeaturedData(chosenInfo);
    };

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 15) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };

    window.addEventListener("scroll", scrollListener);

    return () => {
      window.removeEventListener("scroll", scrollListener);
    };
  }, []);

  return (
    <div className="page">
      <Header black={blackHeader} />

      {featuredData && <FeaturedMovie item={featuredData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito pela B7Web <br />
        Direitos de imagem para Netflix® <br />
        Dados pegos do site
        <a href="https://www.themoviedb.org"> The Movie Db</a>
      </footer>

      {movieList.length <= 0 && (
        <div className="loading">
          <img src="https://i.imgur.com/G1SEqRr.gif" title="Carregando" />
        </div>
      )}
    </div>
  );
};
