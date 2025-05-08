import createElement from '../../helpers/domHelper';
import Root from '../../../constants/root';

function hideModal() {
    const modal = document.getElementsByClassName('modal-layer')[0];
    modal?.remove();
}

function createHeader(title, onClose) {
    const headerElement = createElement({ tagName: 'div', className: 'modal-header' });
    const titleElement = createElement({ tagName: 'p', className: 'modal-title' });
    const closeButton = createElement({ tagName: 'div', className: 'close-btn' });

    titleElement.textContent = title;
    closeButton.textContent = '×';

    const close = () => {
        hideModal();
        onClose();
    };
    closeButton.addEventListener('click', close);
    headerElement.append(titleElement, closeButton);

    return headerElement;
}

function createModal({ title, bodyElement, onClose }) {
    const layer = createElement({ tagName: 'div', className: 'modal-layer' });
    const modalContainer = createElement({ tagName: 'div', className: 'modal-root' });
    const header = createHeader(title, onClose);

    modalContainer.append(header, bodyElement);
    layer.append(modalContainer);

    return layer;
}

export default function showModal({ title, bodyElement, onClose }) {
    const modal = createModal({ title, bodyElement, onClose });
    Root.append(modal);
}
