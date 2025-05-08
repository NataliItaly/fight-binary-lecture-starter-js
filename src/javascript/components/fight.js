import controls from '../../constants/controls';
import hitInfo from './hitInfo';
import Root from '../../constants/root';

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

        let isFightEnded = false;
        const criticalHitTime = 10000;
        const healthBar1 = document.getElementById('left-fighter-indicator');
        const healthBar2 = document.getElementById('right-fighter-indicator');
        console.log('playerOne ', playerOne);
        console.log('playerTwo ', playerTwo);

        function updateHealthBar(healthBar, currentHealth, maxHealth) {
            healthBar.style.width = `${Math.max((currentHealth / maxHealth) * 100, 0)}%`;
        }

        function endFight(winner) {
            if (isFightEnded) return;
            isFightEnded = true;
            document.removeEventListener('keydown', keyDownHandle);
            document.removeEventListener('keyup', keyUpHandle);
            resolve(winner);
        }

        function isCriticalHit(comboKeys, pressedKeys) {
            return comboKeys.every(key => pressedKeys.has(key));
        }

        function keyDownHandle(event) {
            const keyCode = event.code;

            // Remove previous hit info container
            const hitInfoContainer = document.getElementById('hit');
            hitInfoContainer?.remove();

            // Player 1 Keys
            if (
                controls.PlayerOneAttack === keyCode ||
                controls.PlayerOneBlock === keyCode ||
                controls.PlayerOneCriticalHitCombination.includes(keyCode)
            ) {
                playerOne.pressedKeys.add(keyCode);

                if (keyCode === controls.PlayerOneBlock) {
                    playerOne.isBlocking = true;

                    // Set block info
                    if (!document.getElementById('block__player1')) {
                        // Not allowed setting of many block elements
                        Root.append(hitInfo(playerOne, ['block', 'player1']));
                    }
                }

                // Critical hit Player 1
                if (
                    isCriticalHit(controls.PlayerOneCriticalHitCombination, playerOne.pressedKeys) &&
                    !playerOne.isBlocking
                ) {
                    const now = Date.now();
                    if (now - playerOne.lastCriticalTime > criticalHitTime) {
                        const damage = playerOne.attack * 2;

                        // Set hit info
                        Root.append(hitInfo(playerOne, ['critical', 'player1'], damage));

                        playerTwo.currentHealth -= damage;
                        updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                        playerOne.lastCriticalTime = now;
                        playerOne.pressedKeys.clear();
                    }
                }

                // Attack Player 1
                if (keyCode === controls.PlayerOneAttack && !playerOne.isBlocking) {
                    const damage = getDamage(playerOne, playerTwo);
                    console.log('player1 attack with damage: ', damage);
                    playerTwo.currentHealth -= damage;

                    // Set hit info
                    Root.append(hitInfo(playerOne, ['player1'], damage));
                    //hitInfo.style.display = 'block';
                    updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                }
            }

            // Player 2 Keys
            if (
                controls.PlayerTwoAttack === keyCode ||
                controls.PlayerTwoBlock === keyCode ||
                controls.PlayerTwoCriticalHitCombination.includes(keyCode)
            ) {
                playerTwo.pressedKeys.add(keyCode);

                if (keyCode === controls.PlayerTwoBlock) {
                    playerTwo.isBlocking = true;

                    // Set block info
                    if (!document.getElementById('block__player2')) {
                        // Not allowed setting of many block elements
                        Root.append(hitInfo(playerTwo, ['block', 'player2']));
                    }
                }

                // Critical hit Player 2
                if (
                    isCriticalHit(controls.PlayerTwoCriticalHitCombination, playerTwo.pressedKeys) &&
                    !playerTwo.isBlocking
                ) {
                    const now = Date.now();
                    if (now - playerTwo.lastCriticalTime > criticalHitTime) {
                        const damage = playerTwo.attack * 2;

                        // Set hit info
                        Root.append(hitInfo(playerTwo, ['critical', 'player2'], damage));
                        playerOne.currentHealth -= damage;
                        updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                        playerTwo.lastCriticalTime = now;
                        playerTwo.pressedKeys.clear(); // Скидання комбінації
                    }
                }

                // Attack Player 2
                if (keyCode === controls.PlayerTwoAttack && !playerTwo.isBlocking) {
                    const damage = getDamage(playerTwo, playerOne);
                    console.log('player2 attack with damage: ', damage);

                    // Set hit info
                    Root.append(hitInfo(playerTwo, ['player2'], damage));
                    playerOne.currentHealth -= damage;
                    updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                }
            }

            // End fight condition
            if (playerOne.currentHealth <= 0) endFight(secondFighter);
            if (playerTwo.currentHealth <= 0) endFight(firstFighter);
        }

        function keyUpHandle(event) {
            const keyCode = event.code;

            // Delete keyCode from the list of active keys
            playerOne.pressedKeys.delete(keyCode);
            playerTwo.pressedKeys.delete(keyCode);

            // Delete block
            if (keyCode === controls.PlayerOneBlock) {
                playerOne.isBlocking = false;
                document.getElementById('block__player1')?.remove();
            }
            if (keyCode === controls.PlayerTwoBlock) {
                playerTwo.isBlocking = false;
                document.getElementById('block__player2')?.remove();
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
    const criticalHitChance = Math.random() + 1;
    return fighter.attack * criticalHitChance;
}

export function getBlockPower(fighter) {
    const dodgeChance = Math.random() + 1;
    return fighter.defense * dodgeChance;
}
