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

        const PLAYERS = [
            {
                player: playerOne,
                opponent: playerTwo,
                controls: {
                    attack: controls.PlayerOneAttack,
                    block: controls.PlayerOneBlock,
                    critical: controls.PlayerOneCriticalHitCombination
                },
                cssClass: 'player1'
            },
            {
                player: playerTwo,
                opponent: playerOne,
                controls: {
                    attack: controls.PlayerTwoAttack,
                    block: controls.PlayerTwoBlock,
                    critical: controls.PlayerTwoCriticalHitCombination
                },
                cssClass: 'player2'
            }
        ];

        console.log(PLAYERS);

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

        function keyHandle({ player, controls, cssClass, opponent }, keyCode) {
            console.log('player now : ', player);
            player.pressedKeys.add(keyCode);
            // Set opponents health bar
            const healthBar = player.name === playerOne.name ? healthBar2 : healthBar1;

            if (keyCode === controls.block) {
                player.isBlocking = true;
                console.log('player is blocking : ', player);
                // Set block info
                if (!document.getElementById(`block__${cssClass}`)) {
                    // Not allowed setting of many block elements
                    Root.append(hitInfo(player, ['block', cssClass]));
                }
            }

            // Critical hit Player 1
            if (isCriticalHit(controls.critical, player.pressedKeys) && !player.isBlocking) {
                const now = Date.now();
                if (now - player.lastCriticalTime > criticalHitTime) {
                    const damage = player.attack * 2;

                    // Set hit info
                    Root.append(hitInfo(player, ['critical', cssClass], damage));

                    opponent.currentHealth -= damage;
                    updateHealthBar(healthBar, opponent.currentHealth, opponent.health);
                    player.lastCriticalTime = now;
                    player.pressedKeys.clear();
                }
            }

            // Attack Player 1
            if (keyCode === controls.attack && !player.isBlocking) {
                const damage = getDamage(player, opponent);
                console.log('opponent ', opponent.defense);
                opponent.currentHealth -= damage;

                // Set hit info
                Root.append(hitInfo(player, [cssClass], damage));

                updateHealthBar(healthBar, opponent.currentHealth, opponent.health);
            }
        }

        function keyDownHandle(event) {
            const keyCode = event.code;

            // Remove previous hit info container
            const hitInfoContainer = document.getElementById('hit');
            hitInfoContainer?.remove();

            PLAYERS.forEach(player => {
                if (
                    keyCode === player.controls.attack ||
                    keyCode === player.controls.block ||
                    player.controls.critical.includes(keyCode)
                ) {
                    keyHandle(player, keyCode);
                    console.log('player is blocking : ', player);
                }
            });

            // End fight condition
            if (playerOne.currentHealth <= 0) endFight(secondFighter);
            if (playerTwo.currentHealth <= 0) endFight(firstFighter);
        }

        function keyUpHandle(event) {
            const keyCode = event.code;

            PLAYERS.forEach(({ player, controls, cssClass }) => {
                player.pressedKeys.delete(keyCode);
                if (keyCode === controls.block) {
                    player.isBlocking = false;
                    document.getElementById(`block__${cssClass}`)?.remove();
                }
            });
        }

        document.addEventListener('keydown', keyDownHandle);
        document.addEventListener('keyup', keyUpHandle);
    });
}

export function getDamage(attacker, defender) {
    console.log('defender : ', defender);
    console.log('defender is blocking : ', defender.isBlocking);

    const hitPower = getHitPower(attacker);
    const blockPower = defender.isBlocking ? getBlockPower(defender) : 0;
    console.log('block power : ', blockPower);
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
