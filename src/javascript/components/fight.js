import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        const playerOne = {
            ...firstFighter,
            currentHealth: firstFighter.health,
            isBlocking: false,
            lastCriticalTime: new Set()
        };
        const playerTwo = {
            ...secondFighter,
            currentHealth: secondFighter.health,
            isBlocking: false,
            lastCriticalTime: new Set()
        };

        const CRIT_COOLDOWN = 10000;
        const healthBar1 = document.getElementById('left-fighter-indicator');
        const healthBar2 = document.getElementById('right-fighter-indicator');
        console.log('playerOne ', playerOne);
        console.log('playerTwo ', playerTwo);

        function updateHealthBar(healthBar, currentHealth, maxHealth) {
            healthBar.style.width = `${Math.max((currentHealth / maxHealth) * 100, 0)}%`;
        }

        function endFight(winner) {
            document.removeEventListener('keydown', keyDownHandle);
            document.removeEventListener('keyup', keyUpHandle);
            resolve(winner);
        }

        function keyDownHandle(event) {
            const keyCode = event.code;
            console.log(keyCode);
            // Додаємо клавіші до списку
            if (Object.values(controls.PlayerOneCriticalHitCombination).includes(keyCode)) {
                playerOne.pressedKeys.add(keyCode);
            }
            if (Object.values(controls.PlayerTwoCriticalHitCombination).includes(keyCode)) {
                playerTwo.pressedKeys.add(keyCode);
            }

            // Блок
            if (keyCode === controls.PlayerOneBlock) playerOne.isBlocking = true;
            if (keyCode === controls.PlayerTwoBlock) playerTwo.isBlocking = true;

            // Атака
            if (keyCode === controls.PlayerOneAttack) {
                if (!playerTwo.isBlocking) {
                    const damage = getDamage(playerOne, playerTwo);
                    playerTwo.currentHealth -= damage;
                    updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                }
            }

            if (keyCode === controls.PlayerTwoAttack) {
                if (!playerOne.isBlocking) {
                    const damage = getDamage(playerTwo, playerOne);
                    playerOne.currentHealth -= damage;
                    updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                }
            }
            if (playerOne.currentHealth <= 0) endFight(secondFighter);
            if (playerTwo.currentHealth <= 0) endFight(firstFighter);
        }

        function keyUpHandle(event) {
            const keyCode = event.code;
            console.log(keyCode);

            //playerOne.pressedKeys.delete(keyCode);
            //playerTwo.pressedKeys.delete(keyCode);

            if (keyCode === controls.PlayerOneBlock) {
                playerOne.isBlocking = false;
                console.log('controls.PlayerOneBlock from keyUpHandle', controls.PlayerOneBlock);
            }
            if (keyCode === controls.PlayerTwoBlock) {
                playerTwo.isBlocking = false;
                console.log('controls.PlayerTwoBlock from keyUpHandle', controls.PlayerTwoBlock);
            }
        }

        function arraysEqual(a, b) {
            return a.length === b.length && a.every((val, i) => val === b[i]);
        }

        document.addEventListener('keydown', keyDownHandle);
        document.addEventListener('keyup', keyUpHandle);
    });
}

export function getDamage(attacker, defender) {
    const hitPower = getHitPower(attacker);
    const blockPower = defender.isBlocking ? getBlockPower(defender) : 0;
    const damage = hitPower - blockPower;
    return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
    const criticalHitChance = Math.random() + 1; // від 1.0 до 2.0
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1; // від 1.0 до 2.0
    return fighter.defense * dodgeChance;
}
