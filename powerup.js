class PowerUp extends Entity {

    constructor(x, y) {
        const el = document.createElement("div");
        el.classList.add("powerupicon");
        el.classList.add("powerupentity");
        super({x: 0, y: 0, w: 0.35, h: 0.35, centered: true, mark: {styles: {"background": "rgba(0,255,0,0.5)"}}}, el);
        this.rotation = Math.random() * 90;
        el.style.setProperty("transform", "translate(-50%, -50%) rotateZ(" + this.rotation + "deg)");
        map.appendChild(el);

        this.hitbox.offset = {x: 0.5, y: 0.5};

        this.x = x; this.y = y;
        this.update(true);

        let rand = Math.random();

        this.type = "stamina";
        if(rand > 0.4) this.type = "staminaregeneration";
        if(rand > 0.8) this.type = "jumppower";

        el.style.setProperty("--color", player.powerups[this.type].color);
    }
    deletePowerUp() {
        this.element.remove();
        this.hitbox.deleteHitbox();
        delete this;
    }

    update(nophysics) {
        this.updateEntity(nophysics);
        this.hitbox.updateMark();
        this.updatePickup();
    }
    updatePickup() {
        if((Math.abs(player.x) - Math.abs(this.x)) + (Math.abs(player.y) - Math.abs(this.y)) < 5) {
            if(this.hitbox.collides(player.hitbox)) {
                player.pickupPowerUp(this);
            }
        }
    }

}