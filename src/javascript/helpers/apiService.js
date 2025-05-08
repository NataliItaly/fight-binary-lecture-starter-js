// src/api/apiService.js
import { fighters, fightersDetails } from './mockData.js';

const BASE_API_URL = 'https://api.github.com/repos/NataliItaly/fight-binary-lecture-starter-js/contents/resources/api/';

const useMockAPI = import.meta.env.VITE_USE_MOCK_API === 'true';

function getFighterById(endpoint) {
    const start = endpoint.lastIndexOf('/');
    const end = endpoint.lastIndexOf('.json');
    const id = endpoint.substring(start + 1, end);
    return fightersDetails.find(it => it._id === id);
}

async function fakeCallApi(endpoint) {
    const response = endpoint === 'fighters.json' ? fighters : getFighterById(endpoint);
    return new Promise((resolve, reject) => {
        setTimeout(() => (response ? resolve(response) : reject(Error('Failed to load data'))), 500);
    });
}

export default async function callApi(endpoint, method = 'GET') {
    const url = BASE_API_URL + endpoint;
    const options = {
        method,
        headers: {
            authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`
        }
    };

    return useMockAPI
        ? fakeCallApi(endpoint)
        : fetch(url, options)
              .then(response => (response.ok ? response.json() : Promise.reject(Error('Failed to load data'))))
              .then(result => JSON.parse(atob(result.content)))
              .catch(error => {
                  throw error;
              });
}
