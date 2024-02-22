class HitboxMark {
    constructor(hitbox, styles) {
        this.hitbox = hitbox;
        this.oldtext = "";

        this.styles = styles ? styles : {
            background: "rgba(255,0,0,0.5)"
        };
    }
    createMark() {
        if(this.element != null) return;

        this.element = document.createElement("div");
        this.element.style.setProperty("position", "absolute");
        this.element.style.setProperty("color", "white");

        document.body.appendChild(this.element);

        this.update();
        
    }
    update() {
        if(this.element == null) return;

        const rect = this.hitbox.getRect();
        const screencoords = {
            x: map.width / 2 + rect.x1 * map.scale - map.camera.x * map.scale,
            y: map.height / 2 - rect.y2 * map.scale + map.camera.y * map.scale + map.scale,
            w: (rect.x2 - rect.x1) * map.scale,
            h: (rect.y2 - rect.y1) * map.scale
        };

        this.element.style.setProperty("left", `${screencoords.x}px`);
        this.element.style.setProperty("top", `${screencoords.y}px`);
        this.element.style.setProperty("width", `${screencoords.w}px`);
        this.element.style.setProperty("height", `${screencoords.h}px`);
        this.element.style.setProperty("background-color", this.styles.background);

        let newtext = 
        `x: ${Math.floor(this.hitbox.x*100)/100} y: ${Math.floor(this.hitbox.y*100)/100}\nw: ${Math.floor(this.hitbox.w*100)/100} h: ${Math.floor(this.hitbox.h*100)/100}\ncentered: ${this.hitbox.centered}`;

        if(this.oldtext != newtext) {
            this.oldtext = newtext;

            this.element.innerText = newtext;
        }

    }
    deleteMark() {
        if(this.element == null) return;

        this.element.remove();
        this.element = null;
    }
}