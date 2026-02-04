/**
 *
 * Componente principale dell'applicazione Pokédex.
 * Gestisce lo stato globale della vista, la lista dei Pokémon,
 * la navigazione tra le sotto-viste e la riproduzione audio.
 *
 * Funzionalità:
 * - Carica tutti i 721 Pokémon dall'API all'avvio
 * - Mostra un'animazione di apertura iniziale
 * - Permette di navigare tra PokedexScreen (lista) e PokedexDetails (dettagli)
 * - Supporta navigazione da tastiera (frecce su/giù)
 * - Integra musica di sottofondo con toggle play/pause
 */
import {useEffect, useState, useRef} from "react";
import {useNavigate} from 'react-router-dom'
import type {Pokemon} from "../../types/pokemons.ts";
import { fetchPokemons } from "../../API/pokeApi.ts";
import PokedexScreen from "../SubWiews/PokedexScreen/PokedexScreen.tsx";
import PokedexDetails from "../SubWiews/PokedexDetails/PokedexDetails.tsx";
import BattleScreen from "../SubWiews/BattleScreen/BattleScreen.tsx";
import PokemonSong from "../../assets/souds/PokemonSong.mp3";
import Pika3 from "../../assets/icons/Pika3.png";

import "./pokedex.css";
import '../../styles/tabler-icons.min.css'

/** Tipo per le viste disponibili nel Pokédex */
type View = 'screen' | 'details' | 'battle';

function Pokedex() {
    const navigate = useNavigate();
    const [showAnimation, setShowAnimation] = useState(true);
    const [availablePokemons, setAvailablePokemons] = useState<Pokemon[]>([]);
    const [current, setCurrent] = useState(4); // Index of the current Pokemon
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentView, setCurrentView] = useState<View>('screen');
    const [selectedMoveIndex, setSelectedMoveIndex] = useState(0);
    const [confirmAction, setConfirmAction] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    useEffect(() => {
        //fetch available pokemons
        const fetchData = async () => {
            fetchPokemons(setAvailablePokemons);
        };
        fetchData();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowAnimation(false), 6000); // Adjust duration
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        audioRef.current = new Audio(PokemonSong);
        audioRef.current.loop = true;
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    const toggleMusic = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (currentView === 'battle') {
                // Battle mode controls
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedMoveIndex(prev => prev > 1 ? prev - 2 : prev);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedMoveIndex(prev => prev < 2 ? prev + 2 : prev);
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    setSelectedMoveIndex(prev => prev % 2 === 1 ? prev - 1 : prev);
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    setSelectedMoveIndex(prev => prev % 2 === 0 ? prev + 1 : prev);
                } else if (e.key === 'Enter' || e.key === 'a' || e.key === 'A') {
                    e.preventDefault();
                    setConfirmAction(true);
                } else if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
                    e.preventDefault();
                    setCurrentView('screen');
                    setSelectedMoveIndex(0);
                }
            } else {
                // Normal Pokedex controls
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setCurrent(prev => prev - 1 < 0 ? availablePokemons.length - 1 : prev - 1);
                } else if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setCurrent(prev => prev + 1 >= availablePokemons.length ? 0 : prev + 1);
                } else if (e.key === 'Enter' || e.key === 'a' || e.key === 'A') {
                    e.preventDefault();
                    if (currentView === 'screen') {
                        setCurrentView('battle');
                    }
                } else if (e.key === 'Escape' || e.key === 'b' || e.key === 'B') {
                    e.preventDefault();
                    setCurrentView('screen');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [availablePokemons.length, currentView]);

    return(
        <>
            <div className="cover top"></div>
            <div className="cover bottom">
                <div className="middle"></div>
            </div>
            <header></header>

            <section className="blobs">
                <a onClick={() => setCurrentView('screen')}><img src={Pika3} alt="Pikachu"/></a>
                <a href="https://github.com/hotheadhacker/no-as-a-service" target="_blank"></a>
                <a href="https://pokeapi.co/docs/v2" target="_blank"></a>
                <a href="https://pokecord.org/" target="_blank"></a>
            </section>

            <section className="lights">
                <div></div>
                <div></div>
            </section>

            <div className="container">
                <section className="main">
                    <div className="maintext">
                        {
                            showAnimation ? <div className="animation"></div> :
                            currentView === 'screen'
                                ? <PokedexScreen pokemons={availablePokemons} current={current} setCurrent={setCurrent} />
                                : currentView === 'details'
                                ? <PokedexDetails pokemons={availablePokemons} current={current} setCurrent={setCurrent} />
                                : currentView === 'battle' && availablePokemons[current]
                                ? <BattleScreen
                                    playerPokemon={availablePokemons[current]}
                                    onBattleEnd={(_won) => {
                                        setCurrentView('screen');
                                        setSelectedMoveIndex(0);
                                    }}
                                    selectedMoveIndex={selectedMoveIndex}
                                    onConfirm={confirmAction}
                                    resetConfirm={() => setConfirmAction(false)}
                                  />
                                : <PokedexScreen pokemons={availablePokemons} current={current} setCurrent={setCurrent} />
                        }
                    </div>
                    <section className="decoration">
                        <div className="buttons">
                            <a onClick={() => navigate('/')}><i className="ti ti-error-404-off"></i></a>
                            <a onClick={() => setCurrentView('screen')}><i
                                className="ti ti-home-2"></i></a>
                            <a onClick={() => setCurrentView('details')} className="search"><i
                                className="ti ti-search"></i></a>
                            <a onClick={() => setCurrentView('battle')} className="battle"><i
                                className="ti ti-swords"></i></a>
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
                        <button className={`ti ${isPlaying ? 'ti-player-pause' : 'ti-music'}`} onClick={toggleMusic}></button>
                        <button className="use" onClick={() => setCurrentView('details')}>use</button>
                    </div>
                    <div className="infoBox">
                        <p><strong>Info:</strong>
                            <br/>
                            Utilizzare il D-pad per navigare il pokedex (o le freccie direzionali)</p>
                    </div>
                </div>

            </div>

            <footer>
                <nav>
                    <div>
                        <a onClick={(e) => {
                            e.preventDefault();
                            if (currentView === 'battle') {
                                setSelectedMoveIndex(prev => prev % 2 === 1 ? prev - 1 : prev);
                            }
                        }}><i className="ti ti-minus"></i></a>
                        <a onClick={(e) => {
                            e.preventDefault();
                            if (currentView === 'battle') {
                                setSelectedMoveIndex(prev => prev % 2 === 0 ? prev + 1 : prev);
                            }
                        }}><i className="ti ti-minus"></i></a>
                    </div>
                    <div>
                        <a onClick={(e) => {
                            e.preventDefault();
                            if (currentView === 'battle') {
                                setSelectedMoveIndex(prev => prev > 1 ? prev - 2 : prev);
                            } else {
                                setCurrent(current - 1 < 0 ? availablePokemons.length - 1 : current - 1);
                            }
                        }}><i className="ti ti-minus-vertical"></i></a>
                        <a onClick={(e) => {
                            e.preventDefault();
                            if (currentView === 'battle') {
                                setSelectedMoveIndex(prev => prev < 2 ? prev + 2 : prev);
                            } else {
                                setCurrent(current + 1 >= availablePokemons.length ? 0 : current + 1);
                            }
                        }}><i className="ti ti-minus-vertical"></i></a>
                    </div>
                </nav>
                <div className="footer-buttons">
                    <button onClick={() => {
                        if (currentView === 'screen') {
                            setCurrentView('battle');
                        } else if (currentView === 'battle') {
                            setConfirmAction(true);
                        } else {
                            setCurrentView('details');
                        }
                    }}>A</button>
                    <button onClick={() => {
                        if (currentView === 'battle') {
                            setCurrentView('screen');
                            setSelectedMoveIndex(0);
                        } else {
                            setCurrentView('screen');
                        }
                    }}>B</button>
                </div>
            </footer>
            <noscript>Please Enable Javascript To Use The Pokedex!</noscript>
        </>
    )
        ;
}

export default Pokedex;