import createFighters from './components/fightersView';
import fighterService from './services/fightersService';
import Root from '../constants/root';

class App {
    static rootElement = Root;

    static loadingElement = document.getElementById('loading-backdrop');

    static async startApplication() {
        try {
            App.loadingElement.style.visibility = 'visible';

            const fighters = await fighterService.getFighters();
            const fightersElement = createFighters(fighters);

            App.rootElement.appendChild(fightersElement);
        } catch (error) {
            console.warn(error);
            App.rootElement.innerText = 'Failed to load data';
        } finally {
            App.loadingElement.style.visibility = 'hidden';
        }
    }
}

export default App;
