// Pokedex.tsx
import React, {useEffect, useState} from "react";
import type {Ability, Pokemon, PokemonType} from "../types/types.ts";
import PokedexScreen from "./PokedexScreen/PokedexScreen.tsx";

import "./pokecord.css";

function Pokedex() {
    const [showAnimation, setShowAnimation] = useState(true);
    const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
    useEffect(() => {
        //fetch available pokemons
        const getAvailablePokeData = async () => {
            const apiUrl = 'https://pokeapi.co/api/v2';
            const limit:number = 20;
            const offset:number = 0;
            const url: string = `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`;
            try {

                const response = await fetch(url);
                if (!response.ok) {
                throw new Error('Network response was not ok');
                }
                const data= await response.json();

                const pokemonList: {
                    name: string;
                    url: string;
                    id: number;
                    type: string[];
                }[] = data.results;

                const updatedPokemonList = await Promise.all(
                    pokemonList.map(async (pokemon) => {
                        const res = await fetch(pokemon.url);
                        if(!response.ok){
                            throw new Error(`Network response was not ok for${pokemon.name}`);
                        }
                        const pokemonData = await res.json();
                        const types = pokemonData.types.map(({ type }: PokemonType) => type.name);
                        const abilities = pokemonData.abilities.map(({ ability }: Ability) => ability.name);

                        const { sprites } = pokemonData;
                        const image = sprites.front_shiny;
                        return {...pokemon, types, abilities, image};

                    })
                );

                setAvailablePokemons(updatedPokemonList);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }

        }
        getAvailablePokeData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowAnimation(false), 6000); // Adjust duration
        return () => clearTimeout(timer);
    }, []);

    return(
        <>
            <div className="cover top"></div>
            <div className="cover bottom">
                <div className="middle"></div>
            </div>
            <header></header>

            <section className="blobs">
                <a href="/server" target="_blank"><img src="/src/assets/Pika3.png" alt=""/></a>
                <a href="https://audicy.xyz" target="_blank"></a>
                <a href="https://verbo.chat" target="_blank"></a>
                <a href="https://translomatic.botcat.dev" target="_blank"></a>
            </section>

            <section className="lights">
                <div></div>
                <div></div>
            </section>

            <section className="main">
                <div className="maintext">
                    {showAnimation ? <div className="animation"></div> : <PokedexScreen pokemons={availablePokemons} />}
                </div>
                <section className="decoration">
                    <div className="buttons">
                        <a data-home="Home" href="/public"><i className="ti ti-home-2"></i></a>
                        <a data-calculator="Calculator" href="javascript:void(0)"><i
                            className="ti ti-calculator"></i></a>
                        <a data-logout="Logout" href="javascript:void(0)" className="logout disableLogout"><i
                            className="ti ti-power"></i></a>
                    </div>
                    <div className="vents">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                </section>
            </section>

            <footer>
                <div className="screen">
                    <p><strong className="time">Thu Jan 22 2026</strong><br/><span className="goto"></span></p>
                </div>
                <nav>
                    <div>
                        <a data-add="Add" href="/add" target="_blank"><i className="ti ti-plus"></i></a>
                        <a data-terms="Terms" href="javascript:void(0)"><i className="ti ti-notes"></i></a>
                    </div>
                    <div>
                        <a data-shop="Shop" href="javascript:void(0)"><i className="ti ti-shopping-cart"></i></a>
                        <a data-guide="Guide" href="https://guide.pokecord.org"><i className="ti ti-code"></i></a>
                    </div>
                </nav>
            </footer>
            <noscript>Please Enable Javascript To Use The Pokedex!</noscript>
            <script src="utilities/jquery-3.6.3.min.js"></script>
            <script src="js/index.js"></script>
        </>
    )
        ;
}

export default Pokedex;