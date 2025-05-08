import controls from '../../constants/controls';
import hitInfo from './hitInfo';

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

            // Add keyCodes to the list:
            //playerOne.pressedKeys.add(keyCode);
            //playerTwo.pressedKeys.add(keyCode);

            // Block
            //if (keyCode === controls.PlayerOneBlock) playerOne.isBlocking = true;
            //if (keyCode === controls.PlayerTwoBlock) playerTwo.isBlocking = true;

            // Player 1 Keys
            if (
                controls.PlayerOneAttack === keyCode ||
                controls.PlayerOneBlock === keyCode ||
                controls.PlayerOneCriticalHitCombination.includes(keyCode)
            ) {
                playerOne.pressedKeys.add(keyCode);
                console.log('Player1 pressed :', playerOne.pressedKeys);
                if (keyCode === controls.PlayerOneBlock) {
                    playerOne.isBlocking = true;

                    // Set block info
                    document.getElementById('root').append(hitInfo(playerOne, ['block', 'player1']));
                    console.log('Player1 is blocking :', playerOne.isBlocking);
                }

                // Critical hit Player 1
                if (isCriticalHit(controls.PlayerOneCriticalHitCombination, playerOne.pressedKeys)) {
                    console.log('critical hit player1');
                    const now = Date.now();
                    if (now - playerOne.lastCriticalTime > criticalHitTime) {
                        console.log('critical hit player1 SUCCESSED');
                        const damage = playerOne.attack * 2;

                        // Set hit info
                        document.getElementById('root').append(hitInfo(playerOne, ['critical', 'player1'], damage));

                        playerTwo.currentHealth -= damage;
                        updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                        playerOne.lastCriticalTime = now;
                        playerOne.pressedKeys.clear();
                    }
                }

                // Attack Player 1
                if (keyCode === controls.PlayerOneAttack && !playerTwo.isBlocking) {
                    const damage = getDamage(playerOne, playerTwo);
                    console.log('player1 attack with damage: ', damage);
                    playerTwo.currentHealth -= damage;

                    // Set hit info
                    document.getElementById('root').append(hitInfo(playerOne, ['player1'], damage));
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
                console.log('Player2 pressed :', playerTwo.pressedKeys);
                if (keyCode === controls.PlayerTwoBlock) {
                    playerTwo.isBlocking = true;

                    // Set block info
                    document.getElementById('root').append(hitInfo(playerTwo, ['block', 'player2']));
                    console.log('Player1 is blocking :', playerOne.isBlocking);
                    console.log('Player2 is blocking :', playerTwo.isBlocking);
                }

                // Critical hit Player 2
                if (isCriticalHit(controls.PlayerTwoCriticalHitCombination, playerTwo.pressedKeys)) {
                    console.log('critical hit player2');

                    const now = Date.now();
                    if (now - playerTwo.lastCriticalTime > criticalHitTime) {
                        console.log('critical hit player2 SUCCESSED');
                        const damage = playerTwo.attack * 2;

                        // Set hit info
                        document.getElementById('root').append(hitInfo(playerTwo, ['critical', 'player2'], damage));
                        playerOne.currentHealth -= damage;
                        updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                        playerTwo.lastCriticalTime = now;
                        playerTwo.pressedKeys.clear(); // Скидання комбінації
                    }
                }

                // Attack Player 2
                if (keyCode === controls.PlayerTwoAttack && !playerOne.isBlocking) {
                    const damage = getDamage(playerTwo, playerOne);
                    console.log('player2 attack with damage: ', damage);

                    // Set hit info
                    document.getElementById('root').append(hitInfo(playerTwo, ['player2'], damage));
                    playerOne.currentHealth -= damage;
                    updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                }
            }

            // Critical hit player 1
            /*if (isCriticalHit(controls.PlayerOneCriticalHitCombination, playerOne.pressedKeys)) {
                console.log('Critical hit Player1');

                const now = Date.now();
                if (now - playerOne.lastCriticalTime > criticalHitTime) {
                    const damage = playerOne.attack * 2;
                    playerTwo.currentHealth -= damage;
                    updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                    playerOne.lastCriticalTime = now;
                }
            }*/

            // Critical hit player 2
            /*if (isCriticalHit(controls.PlayerTwoCriticalHitCombination, playerTwo.pressedKeys)) {
                console.log('Critical hit Player2');
                const now = Date.now();
                if (now - playerTwo.lastCriticalTime > criticalHitTime) {
                    const damage = playerTwo.attack * 2;
                    playerOne.currentHealth -= damage;
                    updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                    playerTwo.lastCriticalTime = now;
                }
            }*/

            // Attack Player 1
            /*if (keyCode === controls.PlayerOneAttack) {
                if (!playerTwo.isBlocking) {
                    const damage = getDamage(playerOne, playerTwo);
                    playerTwo.currentHealth -= damage;
                    updateHealthBar(healthBar2, playerTwo.currentHealth, secondFighter.health);
                }
            }*/

            // Attack Player 2
            /*if (keyCode === controls.PlayerTwoAttack) {
                if (!playerOne.isBlocking) {
                    const damage = getDamage(playerTwo, playerOne);
                    playerOne.currentHealth -= damage;
                    updateHealthBar(healthBar1, playerOne.currentHealth, firstFighter.health);
                }
            }*/

            // End fight condition
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
            }
            if (keyCode === controls.PlayerTwoBlock) {
                playerTwo.isBlocking = false;
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
