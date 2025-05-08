import showModal from './modal';
import createElement from '../../helpers/domHelper';
import App from '../../app';

export default function showWinnerModal(fighter) {
    // Remove previous hit info container
    const hitInfoContainer = document.getElementById('hit');
    hitInfoContainer?.remove();

    const title = 'Game is Over!';
    const bodyElement = createElement({ tagName: 'div', className: 'modal-body' });

    const winnerTitle = createElement({ tagName: 'p', className: 'modal-winner' });
    winnerTitle.textContent = 'Winner is';

    const winnerName = createElement({ tagName: 'span', className: 'modal-winner-name' });
    winnerName.textContent = fighter.name;
    winnerTitle.append(winnerName);

    const winnerImg = createElement({
        tagName: 'img',
        className: 'modal-img',
        attributes: { src: fighter.source, alt: fighter.name }
    });

    bodyElement.append(winnerTitle, winnerImg);

    showModal({
        title,
        bodyElement,
        onClose: () => {
            const root = document.getElementById('root');
            const arena = document.querySelector('.arena___root');
            arena?.remove();
            App.startApplication();
        }
    });
}
