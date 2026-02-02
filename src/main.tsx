/**
 *
 * Entry point dell'applicazione PokeWild.
 *
 * Configura:
 * - React StrictMode per identificare potenziali problemi
 * - QueryClientProvider per React Query (gestione stato server)
 * - BrowserRouter per il routing client-side
 *
 * Routes:
 * - /pokedex/* → Componente Pokedex (app principale)
 * - /* → PageNotFound (pagina 404 con messaggio divertente)
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import './index.css'
import Pokedex from './Pages/Pokedex/Pokedex.tsx'
import PageNotFound from "./Pages/PageNotFound/PageNotFound.tsx";

/** Client React Query per caching e gestione delle chiamate API */
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
          <Routes>
              <Route path="/pokedex/*" element={<Pokedex />} />
              <Route path="/*" element={<PageNotFound />} />
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
