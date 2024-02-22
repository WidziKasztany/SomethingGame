class PowerUpLevel {

    constructor(name, color, levelsteps) {
        this.color = color;
        this.maxlevel = levelsteps.length;
        this.levelsteps = levelsteps;
        this.name = name;

        this.level = 0;
        
        this.element = document.createElement("div");
        this.element.classList.add("powerupsrow");
        this.element.style.setProperty("--color", color);
        let levels = ``;
        for(let i=0; i<this.maxlevel; i++) {
            levels += `<div class="poweruplevel"></div>`;
        }

        this.element.innerHTML = `
            <div class="powerupicon"></div><div style="margin:0 calc(var(--scale) * 0.08)">${name}:</div>
            <div style="width:calc(var(--scale) * 0.19 * ${this.maxlevel});"></div>
            <div class="poweruplevels">
                ${levels}
            </div>`;

        document.getElementsByClassName("powerups")[0].appendChild(this.element);
        document.getElementsByClassName("powerups")[0].appendChild(document.createElement("br"));
        
        this.icon = this.element.getElementsByClassName("powerupicon")[0];

        this.indicator = this.element.getElementsByClassName("poweruplevels")[0];
        this.levelselements = this.indicator.getElementsByClassName("poweruplevel");
    }

    setLevel(level) {
        if(level < 0) level = 0;
        if(level > this.maxlevel) level = this.maxlevel;

        if(level < this.level) {
            for(let i = level + 1; i <= this.level; i++) {
                this.levelselements[i - 1].classList.remove("poweruplevel-active");
            }
        }
        else {
            for(let i = this.level; i < level; i++) {
                this.levelselements[i].classList.add("poweruplevel-active");
            }
        }
        this.level = level;
    }
    getLevel() {
        return this.level == 0 ? 1 : this.levelsteps[this.level - 1];
    }
    addLevel() {
        if(this.level >= this.maxlevel) return false;
        this.setLevel(this.level + 1);
        return true;
    }


}