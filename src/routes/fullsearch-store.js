import { writable } from 'svelte/store';
import log from '$lib/logger';

const initialState = {
    groupedResults: {
        Documentos: [],
        PersonasEsclavizadas: [],
        PersonasNoEsclavizadas: [],
        Corporaciones: [],
        Lugares: [],
    },
    totalResults: 0,
    currentPage: 1,
    totalPages: 0,
    nextPage: null,
    previousPage: null,
    isLoading: false,
    error: null,
    currentSort: '' // Add this line
};

export const searchResultsStore = writable(initialState);

const endpoint = 'http://localhost:81/mdb/api/search/';

export async function initializeSearch(query, filter, sort = '') {
    await fetchResults(null, query, filter, sort);
}

export async function fetchResults(pageUrl = null, searchQuery, filter = 'all', sort = '') {
    log.info(`Fetching results: query=${searchQuery}, filter=${filter}, sort=${sort}`);
    searchResultsStore.update(store => ({ ...store, isLoading: true, error: null }));
    try {
        let url;
        if (pageUrl) {
            const urlObj = new URL(pageUrl, endpoint);
            urlObj.searchParams.set('q', searchQuery);
            urlObj.searchParams.set('filter', filter);
            urlObj.searchParams.set('sort', sort);
            url = urlObj.toString();
        } else {
            url = `${endpoint}?q=${encodeURIComponent(searchQuery)}&filter=${filter}&sort=${sort}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch search results');
        }
        const data = await response.json();

        const groupedResults = {
            Documentos: [],
            PersonasEsclavizadas: [],
            PersonasNoEsclavizadas: [],
            Corporaciones: [],
            Lugares: [],
        };

        data.results.forEach(result => {
            if (result.documento_id) {
                groupedResults.Documentos.push(result);
            } else if (result.persona_id && result.polymorphic_ctype === 29) {
                groupedResults.PersonasEsclavizadas.push(result);
            } else if (result.persona_id && result.polymorphic_ctype === 30) {
                groupedResults.PersonasNoEsclavizadas.push(result);
            } else if (result.corporacion_id) {
                groupedResults.Corporaciones.push(result);
            } else if (result.persona_x_lugares) {
                groupedResults.Lugares.push(result);
            }
        });

        const currentPage = parseInt(new URLSearchParams(pageUrl ? pageUrl.split('?')[1] : '').get('page') || 1);

        log.debug(`Fetched ${data.results.length} results`);

        searchResultsStore.set({
            groupedResults,
            totalResults: data.count,
            currentPage,
            totalPages: Math.ceil(data.count / 20), 
            nextPage: data.next ? new URL(data.next, endpoint).pathname + new URL(data.next, endpoint).search : null,
            previousPage: data.previous ? new URL(data.previous, endpoint).pathname + new URL(data.previous, endpoint).search : null,
            isLoading: false,
            error: null,
            currentSort: sort // Add this line
        });

        log.info(`Search completed: ${data.count} total results`);
    } catch (err) {
        log.error(`Error fetching results: ${err.message}`);
        searchResultsStore.update(store => ({ ...store, error: err.message, isLoading: false }));
    }
}