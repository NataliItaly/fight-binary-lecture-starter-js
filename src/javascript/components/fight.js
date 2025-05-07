import controls from '../../constants/controls';

export async function fight(firstFighter, secondFighter) {
    return new Promise(resolve => {
        // resolve the promise with the winner when fight is over
        const playerOne = {
            ...firstFighter,
            currentHealth: firstFighter.health,
            isBlocking: false,
            lastCriticalTime: 0,
            pressedKeys: new Set()
        };
        const playerTwo = {
            ...secondFighter,
            currentHealth: secondFighter.health,
            isBlocking: false,
            lastCriticalTime: 0,
            pressedKeys: new Set()
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

        function isCriticalHit(comboKeys, pressedKeys) {
            return comboKeys.every(key => pressedKeys.has(key));
        }

        function keyDownHandle(event) {
            const keyCode = event.code;
            console.log(keyCode);

            // Add keyCodes to the list:
            playerOne.pressedKeys.add(keyCode);
            playerTwo.pressedKeys.add(keyCode);

            // Block
            if (keyCode === controls.PlayerOneBlock) playerOne.isBlocking = true;
            if (keyCode === controls.PlayerTwoBlock) playerTwo.isBlocking = true;

            // Critical hit player 1
            if (isCriticalHit(controls.PlayerOneCriticalHitCombination, playerOne.pressedKeys)) {
                const now = Date.now();
                if (now - playerOne.lastCriticalTime > CRIT_COOLDOWN) {
                    const damage = playerOne.attack * 2;
                    playerTwo.currentHealth -= damage;
                    updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                    playerOne.lastCriticalTime = now;
                }
            }

            // Critical hit player 2
            if (isCriticalHit(controls.PlayerTwoCriticalHitCombination, playerTwo.pressedKeys)) {
                const now = Date.now();
                if (now - playerTwo.lastCriticalTime > CRIT_COOLDOWN) {
                    const damage = playerTwo.attack * 2;
                    playerOne.currentHealth -= damage;
                    updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                    playerTwo.lastCriticalTime = now;
                }
            }

            // Attack Player 1
            if (keyCode === controls.PlayerOneAttack) {
                if (!playerTwo.isBlocking) {
                    const damage = getDamage(playerOne, playerTwo);
                    playerTwo.currentHealth -= damage;
                    updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                }
            }

            // Attack Player 2
            if (keyCode === controls.PlayerTwoAttack) {
                if (!playerOne.isBlocking) {
                    const damage = getDamage(playerTwo, playerOne);
                    playerOne.currentHealth -= damage;
                    updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                }
            }

            // Is it end fight condition
            if (playerOne.currentHealth <= 0) endFight(secondFighter);
            if (playerTwo.currentHealth <= 0) endFight(firstFighter);
        }

        function keyUpHandle(event) {
            const keyCode = event.code;
            console.log(keyCode);

            // Delete keyCode from the list of active keys
            playerOne.pressedKeys.delete(keyCode);
            playerTwo.pressedKeys.delete(keyCode);

            // Delete block
            if (keyCode === controls.PlayerOneBlock) {
                playerOne.isBlocking = false;
                console.log('controls.PlayerOneBlock from keyUpHandle', controls.PlayerOneBlock);
            }
            if (keyCode === controls.PlayerTwoBlock) {
                playerTwo.isBlocking = false;
                console.log('controls.PlayerTwoBlock from keyUpHandle', controls.PlayerTwoBlock);
            }
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
