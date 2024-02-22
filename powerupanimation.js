class PowerUpAnimation {

    constructor(powerup) {


        map.animations.powerup.push(this);


        
        this.el = document.createElement("div");
        this.el.classList.add("powerupicon");
        this.el.classList.add("powerupanimation");
        this.type = powerup.type;
        this.el.style.setProperty("--color", player.powerups[this.type].color);
        document.body.appendChild(this.el);

        this.rotation = powerup.rotation;
        const bcrect = powerup.element.getBoundingClientRect();
        this.pos = {x: bcrect.x + bcrect.width / 2, y: bcrect.y + bcrect.height / 2};
        const tbcrect = player.powerups[this.type].icon.getBoundingClientRect();
        this.targetpos = {x: tbcrect.x + tbcrect.width / 2, y: tbcrect.y + tbcrect.height / 2};

        this.opacity = 1;

        this.update();
    }

    update() {
        this.rotation += (360 - this.rotation) / 35;
        this.pos.x += (this.targetpos.x - this.pos.x) / 35;
        this.pos.y += (this.targetpos.y - this.pos.y) / 35;
        this.opacity += (0 - this.opacity) / 35;
        if(this.opacity < 0.01) {
            this.el.remove();
            const index = map.animations.powerup.indexOf(this);
            if (index !== -1) {
                map.animations.powerup.splice(index, 1);
            }
        }

        this.el.style.setProperty("transform", `translate(-50%, -50%) rotateZ(${this.rotation}deg)`);
        this.el.style.setProperty("left", this.pos.x + "px");
        this.el.style.setProperty("top", this.pos.y + "px");
        this.el.style.setProperty("opacity", this.opacity);
    }


}