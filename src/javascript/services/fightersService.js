import callApi from '../helpers/apiHelper';

class FighterService {
    #endpoint = 'fighters.json';

    async getFighters() {
        try {
            const apiResult = await callApi(this.#endpoint);
            return apiResult;
        } catch (error) {
            throw error;
        }
    }

    async getFighterDetails(id) {
        // todo: implement this method
        // endpoint - `details/fighter/${id}.json`;
        try {
            const endpoint = `details/fighter/${id}.json`;
            const details = await callApi(endpoint);
            return details;
        } catch (err) {
            throw err;
        }
    }
}

const fighterService = new FighterService();

export default fighterService;
