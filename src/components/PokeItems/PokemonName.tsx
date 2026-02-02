/**
 *
 * Componente riutilizzabile per visualizzare ID e nome di un Pokémon.
 * L'ID viene formattato con zeri iniziali (es. 001, 025, 150).
 * Se l'ID è 0, mostra un div vuoto (placeholder per slot vuoti).
 *
 * @param id - ID numerico del Pokémon (1-721)
 * @param name - Nome del Pokémon
 */
import React from "react";
import './pokemonName.css'

const PokemonName: React.FC<{ id: number; name: string }> = ({
id, name
}) => {
    if (id === 0) return <div></div>;
    return (
        <div className="pokemon-card">
                <div className="image"></div>
                <h3 className="id">{id.toString().padStart(3, '0')}</h3>
                <h3 className="name"> {name}</h3>
        </div>
    )
}

export default PokemonName;