/**
 *
 * Componente riutilizzabile per visualizzare lo sprite di un Pokémon.
 * Gestisce il caso in cui l'immagine non sia disponibile mostrando un div vuoto.
 *
 * @param image - URL dello sprite del Pokémon
 */
import React from 'react';
import './imgPokemon.css'

const ImgPokemon: React.FC<{ image: string }> = ({
                                                     image
                                                 }) => {
    if (!image) return <div></div>;
    return (
        <div className="pokemon-img">
            <img src={image} alt="" />
        </div>
    );
};

export default ImgPokemon;