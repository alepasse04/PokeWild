/**
 *
 * Vista dettagli che mostra le informazioni complete di un Pokémon.
 *
 * Funzionalità:
 * - Mostra lo sprite del Pokémon selezionato
 * - Visualizza ID, nome, tipi e abilità
 * - Recupera la descrizione dall'API usando React Query
 * - Permette di salvare il Pokemon come preferito (chiamata POST)
 * - Gestisce stati di loading ed errore per la descrizione
 *
 * @param pokemons - Array di tutti i Pokémon disponibili
 * @param current - Indice del Pokémon attualmente selezionato
 * @param setCurrent - Funzione per aggiornare l'indice corrente
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import type {PokemonProps} from "../../../types/pokemons.ts";
import { getPokemonDescription, saveFavoritePokemon } from "../../../API/pokeApi.ts";
import PokemonName from "../../../components/PokeItems/PokemonName.tsx";
import ImgPokemon from "../../../components/PokeItems/ImgPokemon.tsx";
import "./pokedexDetails.css"

const PokedexDetails: React.FC<PokemonProps & { current: number; setCurrent: (index: number) => void }> = ({
    pokemons,
    current,
}) => {

    const navigate = useNavigate();
    const curr = pokemons[current];
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    // GET - Recupera descrizione Pokemon
    const { data: details, isLoading, error } = useQuery({
        queryKey: ['pokemonDetails', curr?.id],
        queryFn: () => getPokemonDescription(curr!.id),
        enabled: !!curr && !!curr.id,
    });

    // POST - Salva Pokemon come preferito
    const saveMutation = useMutation({
        mutationFn: () => saveFavoritePokemon(curr.id, curr.name),
        onSuccess: (data) => {
            setSaveMessage(`${curr.name} salvato come preferito! (ID: ${data.id})`);
            setTimeout(() => setSaveMessage(null), 3000);
        },
        onError: (error: Error) => {
            setSaveMessage(`Errore: ${error.message}`);
            setTimeout(() => setSaveMessage(null), 3000);
        }
    });

    if (!curr) {
        return <div>Loading...</div>;
    }

    return (
        <>
        <div className="info">
                <div className='info-sprite'>
                    {curr && <ImgPokemon image={curr.image} />}
                </div>

                <div className="details">
                    <div className="name" onClick={() => navigate('/pokedex/list')}>
                        <PokemonName id={curr.id} name={curr.name} />
                    </div>
                    <div className="types">
                        <strong>Type:</strong> {curr.types.join(', ')}
                    </div>
                    <br/>
                    <div className="abilities">
                        <strong>Abilities:<br/></strong> {curr.abilities.join(', ')}
                    </div>
                </div>
        </div>
        <div className="description">
            <strong>Description:</strong>
            <br/>
            {isLoading ? 'Loading description...' : error ? 'Error loading description' : details?.description}
        </div>
        <div className="favorite-section">
            <button
                className="favorite-btn"
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
            >
                {saveMutation.isPending ? 'Saving...' : 'Add to Favorites'}
            </button>
            {saveMessage && <p className="save-message">{saveMessage}</p>}
        </div>
        </>
    )
}

export default PokedexDetails;