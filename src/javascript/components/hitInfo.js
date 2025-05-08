import createElement from '../helpers/domHelper';

export default function hitInfo(fighter, fighterClass, damage) {
    const allClasses = `hit ${fighterClass.map(hitClass => `hit__${hitClass}`).join(' ')}`;

    const actionId = fighterClass.includes('block') ? `block__${fighterClass[1]}` : 'hit';
    const info = createElement({ tagName: 'div', className: allClasses, attributes: { id: actionId } });
    const infoContainer = createElement({ tagName: 'div', className: 'hit__container' });

    function setInfoText() {
        let infoText = '';

        switch (fighterClass[0]) {
            case 'block':
                infoText = ' is blocking ';
                break;
            case 'critical':
                infoText = 'critical hit with damage ';
                break;
            default:
                infoText = ' attack with damage ';
                break;
        }
        return infoText;
    }
    infoContainer.textContent = setInfoText();

    /*fighterClass.includes('block')
        ? ' is blocking '
        : fighterClass.includes('critical')
        ? 'critical hit with damage '
        : ' attack with damage ';*/
    const infoFighter = createElement({ tagName: 'span', className: 'hit__fighter' });
    infoFighter.textContent = fighter.name;

    // Set damage only for hit info or critical hit, exclude block info
    if (!fighterClass.includes('block')) {
        const infoDamage = createElement({ tagName: 'span', className: 'hit__damage' });
        infoDamage.textContent = Math.round(damage);
        infoContainer.append(infoDamage);
    }

    infoContainer.prepend(infoFighter);
    info.append(infoContainer);
    return info;
}
