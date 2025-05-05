import createElement from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
    const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
    const fighterElement = createElement({
        tagName: 'div',
        className: `fighter-preview___root ${positionClassName}`
    });

    // todo: show fighter info (image, name, health, etc.)
    if (!fighter) return fighterElement;

    const imgElement = createFighterImage(fighter);

    const infoElement = createElement({ tagName: 'div', className: 'fighter-preview___info' });

    const nameElement = createElement({ tagName: 'p' });
    nameElement.innerHTML = `Name: <span class="fighter-preview__details">${fighter.name}</span>`;

    const healthElement = createElement({ tagName: 'p' });
    healthElement.innerHTML = `Health: <span class="fighter-preview__details">${fighter.health}</span>`;

    const attackElement = createElement({ tagName: 'p' });
    attackElement.innerHTML = `Attack: <span class="fighter-preview__details">${fighter.attack}</span>`;

    const defenseElement = createElement({ tagName: 'p' });
    defenseElement.innerHTML = `Defense: <span class="fighter-preview__details">${fighter.defense}</span>`;

    infoElement.append(nameElement, healthElement, attackElement, defenseElement);
    fighterElement.append(imgElement, infoElement);

    return fighterElement;
}

export function createFighterImage(fighter) {
    const { source, name } = fighter;
    const attributes = {
        src: source,
        title: name,
        alt: name
    };
    const imgElement = createElement({
        tagName: 'img',
        className: 'fighter-preview___img',
        attributes
    });

    return imgElement;
}
