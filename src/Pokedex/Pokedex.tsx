// Pokedex.tsx
import {useEffect, useState} from "react";
import type {Ability, Pokemon, PokemonType} from "../types/types.ts";
import PokedexScreen from "./PokedexScreen/PokedexScreen.tsx";

import "./pokecord.css";
import './tabler-icons.min.css'

function Pokedex() {
    const [showAnimation, setShowAnimation] = useState(true);
    const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
    const [current, setCurrent] = useState(4); // Index of the current Pokemon
    useEffect(() => {
        //fetch available pokemons
        const getAvailablePokeData = async () => {
            const apiUrl = 'https://pokeapi.co/api/v2';
            const batchSize = 100;
            const totalPokemons = 721;
            const batches = [];
            for (let i = 0; i < totalPokemons; i += batchSize) {
                const limit = Math.min(batchSize, totalPokemons - i);
                const offset = i;
                batches.push({ limit, offset });
            }
            try {
                const allResults = await Promise.all(batches.map(async ({ limit, offset }) => {
                    const url = `${apiUrl}/pokemon?limit=${limit}&offset=${offset}`;
                    const response = await fetch(url);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    return data.results;
                }));
                const pokemonList = allResults.flat();

                const updatedPokemonList = await Promise.all(
                    pokemonList.map(async (pokemon) => {
                        const res = await fetch(pokemon.url);
                        if(!res.ok){
                            throw new Error(`Network response was not ok for ${pokemon.name}`);
                        }
                        const pokemonData = await res.json();

                        const types = pokemonData.types.map(({ type }: PokemonType) => type.name);

                        const abilities = pokemonData.abilities.map(({ ability }: Ability) => ability.name);
                        const { sprites } = pokemonData;
                        const image = sprites.front_default;

                        const id = pokemonData.id;

                        return {...pokemon, id, types, abilities, image};

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

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setCurrent(prev => prev - 1 < 0 ? availablePokemons.length - 1 : prev - 1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                setCurrent(prev => prev + 1 >= availablePokemons.length ? 0 : prev + 1);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [availablePokemons.length]);

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

            <div className="container">
                <section className="main">
                    <div className="maintext">
                        {
                            showAnimation ? <div className="animation"></div> : <PokedexScreen pokemons={availablePokemons} current={current} setCurrent={setCurrent} />
                        }
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
                <div className="right-screen">
                    <div className="screen">
                        <p><strong className="time">{new Date().toDateString()}</strong><br/><span className="goto"></span></p>
                    </div>
                    <div className="screen-buttons">
                        <button></button>
                        <button></button>
                    </div>
                </div>

            </div>




            <footer>
                <nav>
                    <div>
                        <a data-add="Add" href="" target="_blank"><i className="ti ti-minus"></i></a>
                        <a data-terms="Terms" href=""><i className="ti ti-minus"></i></a>
                    </div>
                    <div>
                        <a data-shop="Shop" href="" onClick={(e) => { e.preventDefault(); setCurrent(current - 1 < 0 ? availablePokemons.length - 1 : current - 1); }}><i className="ti ti-minus-vertical"></i></a>
                        <a data-guide="Guide" href="" onClick={(e) => { e.preventDefault(); setCurrent(current + 1 >= availablePokemons.length ? 0 : current + 1); }}><i className="ti ti-minus-vertical"></i></a>
                    </div>
                </nav>
                <div className="footer-buttons">
                    <button>A</button>
                    <button>B</button>
                </div>
            </footer>
            <noscript>Please Enable Javascript To Use The Pokedex!</noscript>
            <script src="utilities/jquery-3.6.3.min.js"></script>
            <script src="js/index.js"></script>
        </>
    )
        ;
}

export default Pokedex;