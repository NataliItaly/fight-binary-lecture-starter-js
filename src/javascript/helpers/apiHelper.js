import { fightersDetails, fighters } from './mockData';
// https://api.github.com/repos/binary-studio-academy/stage-2-es6-for-everyone/contents/resources/api/
// my token:
// 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
const BASE_API_URL = 'https://api.github.com/repos/NataliItaly/fight-binary-lecture-starter-js/contents/resources/api/';
const SECURITY_HEADERS = {
    headers: {
        authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`

        /*
         * For the development, you shouldn't use the remote data source, but set useMockAPI=true.
         * To test the application against the real dataset set useMockAPI=false.
         * But to test the application you don't need to extend the GitHub REST API rate limit to 5000 requests with the token
         */
        // authorization: 'token %github_token%'
    }
};

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
    const options = { method, ...SECURITY_HEADERS };

    return useMockAPI
        ? fakeCallApi(endpoint)
        : fetch(url, options)
              .then(response => (response.ok ? response.json() : Promise.reject(Error('Failed to load data'))))
              .then(result => JSON.parse(atob(result.content)))
              .catch(error => {
                  throw error;
              });
}
