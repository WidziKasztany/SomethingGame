
        class Player extends Entity {
            constructor(element) {
                super(
                    {x: 0, y: 0, w: 0.2, h: 0.2, centered: true, mark: {styles: {"background": "rgba(0,0,255,0.5)"}}},
                    element);

                this.lastrotation = 0;
                this.force = 0.2;

                // STAMINA (Animations etc.)

                this.stamina = 30;
                this.showedstamina = 30;
                this.maxstamina = 30;
                this.staminapersecond = 2;

                this.oldstamina = 0;
                this.showedoldstamina = 0;
                this.oldstaminaremovecooldown = 0;

                this.notenoughstaminaremovecooldown = 0;
                this.notenoughstamina = 0;

                this.staminanousetime = 1;
                this.jumpscost = 1;

                // Notification animation

                this.notifystage = 250;
                this.notificationelement = document.getElementById("notification");
                this.notificationelementtext = document.getElementById("notificationtext");

                // Hitbox

                //this.hitbox = new Hitbox({x: 0, y: 0, w: 0.2, h: 0.2, centered: true, mark: {styles: {"background": "rgba(0,0,255,0.5)"}}});
            
                // Powerups

                this.powerups = {
                    stamina: new PowerUpLevel("Energy Increase", "gold", [
                        1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8
                    ]),
                    staminaregeneration: new PowerUpLevel("Energy Regeneration", "magenta", [
                        1.05, 1.1, 1.15, 1.2, 1.25, 1.3, 1.35, 1.4
                    ]),
                    jumppower: new PowerUpLevel("Longer Jump Distance", "lime", [
                        1.04, 1.08, 1.12, 1.16, 1.20, 1.24, 1.28, 1.32
                    ]),
                };

                this.registerOnCollision((block, startpos) => {
                    this.blockHitEvent(block, startpos);
                    return block;
                });
            }

            /*
                // TOOLS
            */

            update() {
                this.updateRotation();
                this.updateEntity();
                this.updateStyle();
            }

            /*
                // MOVEMENT AND OTHER TOOLS
            */
            pickupPowerUp(powerup) {
                if(this.powerups[powerup.type].addLevel()) {
                    new PowerUpAnimation(powerup);
                    powerup.deletePowerUp();
                }
            }

            moveforce(force) {
                let x = -Math.cos(this.lastrotation / 180 * Math.PI) * force;
                if(Math.abs(x) > Math.abs(this.velocity.x)) this.velocity.x = x;
                let y = Math.sin(this.lastrotation / 180 * Math.PI) * force;
                if(Math.abs(y) > Math.abs(this.velocity.y)) this.velocity.y = y;
            }
            move() {
                if(this.stamina < 1.5 * this.jumpscost) {
                    this.notify("You don't have enough energy" + (this.powerups.stamina.level == 0 ? ". Wait a while...\nCollect upgrades to increase the limit." : ""));
                    this.moveforce(0.02  * this.powerups.jumppower.getLevel());
                    return this.notEnoughStamina(1.5 * this.jumpscost);
                }
                this.useStamina(1.5 * this.jumpscost);

                this.force = 0.2 * this.powerups.jumppower.getLevel()

                this.updateRotation();

                this.moveforce(this.force);
                this.jumpscost *= 1.07;
            }
            useStamina(amount) {
                this.staminanousetime = 1;
                this.oldstaminaremovecooldown = 100;
                this.stamina -= amount;
            }

            /*
                // STYLES
            */

            updateRotationStyle() {
                this.element.style.transform = `rotateZ(${this.lastrotation - 90}deg)`;
                this.notificationelement.style.transform = `rotateZ(${-(this.lastrotation - 90)}deg)`;
            }
            updateStyle() {
                this.updateRotationStyle();
                this.updateAnimation();
                this.updateStaminaDisplay();
                this.updateStamina();
            }

            /*
                // ANIMATIONS
            */

            blockHitEvent(block, startpos) {
                block.startHitAnimation(this, startpos);
            }
            updateAnimation() {
                let mult = (Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y)) / this.force * 1.5;
                if(mult > 1) mult = 1;

                this.element.style.setProperty("--w", 1 - 0.5 * mult);

                this.notificationelement.style.setProperty("opacity", 1 * (250 - this.notifystage) / 100);
                this.notifystage++;
            }
            updateStaminaDisplay() {
                this.showedstamina += (this.stamina - this.showedstamina) / 12;
                this.showedoldstamina += (this.oldstamina - this.showedoldstamina) / 12;

                if(this.showedoldstamina < 0) this.showedoldstamina = 0;
                if(this.showedstamina < 0) this.showedstamina = 0;

                const el = document.getElementsByClassName("stamina")[0];
                el.style.setProperty("--stamina", this.showedstamina / this.maxstamina);
                el.style.setProperty("--usedstamina", this.showedoldstamina / this.maxstamina);
                el.style.setProperty("--notenoughstamina", this.notenoughstamina / this.maxstamina);
                el.style.setProperty("--multiplier", this.powerups.stamina.getLevel());
            }
            notEnoughStamina(amount) {
                this.notenoughstamina = amount;
                this.notenoughstaminaremovecooldown = 100;
            }

            notify(message) {
                this.notifystage = 0;
                this.notificationelementtext.innerText = message;
            }

            /*
                // PHYSICS
            */
            updateStamina() {
                this.maxstamina = 30 * this.powerups.stamina.getLevel();

                this.stamina += this.staminapersecond / 100 * this.staminanousetime * this.powerups.staminaregeneration.getLevel();
                if(this.stamina > this.maxstamina) this.stamina = this.maxstamina;
                if(this.stamina < 0) this.stamina = 0;
                
                if(this.oldstaminaremovecooldown > 0) this.oldstaminaremovecooldown--;
                else this.oldstamina = this.stamina;
                
                if(this.notenoughstaminaremovecooldown > 0) this.notenoughstaminaremovecooldown--;
                else this.notenoughstamina -= this.notenoughstamina / 20;

                this.staminanousetime *= 1.005;
                this.jumpscost /= 1.005;
                if(this.jumpscost < 1) this.jumpscost = 1;
            }

            updateRotation() {
                const ppos = this.getPositionOnScreen();
                const result = {
                    x: mousepos.x - ppos.x,
                    y: mousepos.y - ppos.y,
                };
                const rotation = Math.atan2(result.y, result.x) * 180 / Math.PI;
                this.lastrotation = rotation + 180;
            }
        }
        