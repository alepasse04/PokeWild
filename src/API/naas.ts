/**
 *
 * Gestione delle chiamate API verso "No as a Service" (https://naas.isalman.dev).
 * Questa API fornisce messaggi "NO" casuali e divertenti, utilizzati
 * principalmente nella pagina 404 per aggiungere un tocco di umorismo.
 */

/**
 * Recupera un messaggio "NO" casuale dall'API No as a Service.
 *
 * L'API restituisce un oggetto JSON con una proprietà "reason" che contiene
 * un messaggio divertente o sarcastico. Se la chiamata fallisce, viene
 * restituito un messaggio di fallback.
 *
 * @returns Promise che risolve con il messaggio NO in inglese
 * @throws Error se la risposta HTTP non è ok (status non 2xx)
 *
 * @example
 * // Utilizzo con React Query:
 * const { data: message, isLoading, error } = useQuery({
 *   queryKey: ['noMessage'],
 *   queryFn: fetchNoMessage
 * });
 */
export const fetchNoMessage = async (): Promise<string> => {
    const res = await fetch("https://naas.isalman.dev/no");

    if (!res.ok) {
        throw new Error(`Failed to fetch NO message: ${res.status}`);
    }

    const data = await res.json();
    return data.reason || 'No message available';
};
