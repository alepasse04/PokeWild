/**
 *
 * Pagina 404 con un tocco di umorismo.
 * Recupera un messaggio "NO" casuale dall'API "No as a Service"
 * e lo mostra all'utente insieme a pulsanti per navigare o ricaricare.
 *
 * Funzionalità:
 * - Mostra un messaggio NO casuale e divertente
 * - Pulsante per navigare al Pokédex
 * - Pulsante per ricaricare un nuovo messaggio
 * - Gestisce stati di loading ed errore
 */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {useNavigate} from "react-router-dom";
import { fetchNoMessage } from "../../API/naas.ts";
import './PageNotFound.css';

export default function PageNotFound() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: noMessage, error, isLoading } = useQuery({
        queryKey: ['Page not found'],
        queryFn: fetchNoMessage,
    });

    const reloadMessage = () => {
        queryClient.invalidateQueries({ queryKey: ['Page not found'] });
    };

    return (
        <div className="page-not-found">
            <h1 className="title">404</h1>
            <br/>
            <p className="message">
                {isLoading ? 'Loading a funny NO message...' : error ? `Oops! ${error.message}` : `${noMessage}`}
            </p>
            <br/>
            <div className="buttons">
                <button
                    className="btn-primary"
                    onClick={() => navigate("/pokedex")}
                >
                    Go to Pokedex
                </button>
                <button
                    className="btn-secondary"
                    onClick={reloadMessage}
                >
                    Reload Message
                </button>
            </div>
        </div>
    )
}
