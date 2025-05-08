import createElement from '../helpers/domHelper';

export default function hitInfo(fighter, fighterClass, damage = null) {
    const allClasses = `hit ${fighterClass.map(hitClass => `hit__${hitClass}`).join(' ')}`;

    const info = createElement({ tagName: 'div', className: allClasses, attributes: { id: 'hit' } });
    const infoContainer = createElement({ tagName: 'div', className: 'hit__container' });

    infoContainer.textContent = fighterClass.includes('block') ? ' is blocking ' : ' attack with damage ';
    const infoFighter = createElement({ tagName: 'span', className: 'hit__fighter' });
    infoFighter.textContent = fighter.name;

    if (damage) {
        const infoDamage = createElement({ tagName: 'span', className: 'hit__damage' });
        infoDamage.textContent = Math.round(damage);
        infoContainer.append(infoDamage);
    }

    infoContainer.prepend(infoFighter);

    info.append(infoContainer);
    return info;
}
