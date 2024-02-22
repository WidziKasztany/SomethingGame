class Block{
    constructor(chunk, x, y, rx, ry) {
        this.element = null;
        this.chunk = chunk;
        this.material = "air";
        this.x = x; this.y = y;
        this.rx = rx; this.ry = ry;
        this.hidden = false;
        this.hitbox = new Hitbox();

        this.hitanimation = {
            starttime: 0,
            color: {r: 0, g: 255, b: 255},
            oldcolor: {r: 66, g: 77, b: 88},
            oldstate: 0,
            running: false,
        }
    }

    setMaterial(material) {
        this.material = material;
        this.updateBlock();
    }
    updateBlock() {
        if(this.element == null) {
            if(this.hidden || this.material == "air") return;
            const ch = document.createElement("div");
            ch.classList.add("block", `chunk-x${this.chunk.position.x}-y${this.chunk.position.y}`);
            ch.style.setProperty("--x", this.chunk.position.x * 16 + this.x);
            ch.style.setProperty("--y", this.chunk.position.y * 16 + this.y);
            this.chunk.map.appendChild(ch);
            this.element = ch;

            this.hitbox = new Hitbox({x: this.rx, y: this.ry, w: 1, h: 1});

            return;
        }
        if(this.hidden || this.material == "air") {
            this.element.remove();
            this.element = null;
            this.hitbox.deleteHitbox();
            return;
        }
    }
    getColor() {
        return {r: 66, g: 77, b: 88};
    }
    getChunk() {
        return this.chunk;
    }


    update() {
        this.updateRadius();
        this.updateBlock();

        this.hitbox.updateMark();
        this.updateHitAnimation();
    }

    updateRadius() {
        this.hidden = 
        !(
            this.rx < this.chunk.map.camera.x + this.chunk.map.blockWidth / 2 &&
            this.rx > this.chunk.map.camera.x - this.chunk.map.blockWidth / 2 &&
            this.ry < this.chunk.map.camera.y + this.chunk.map.blockHeight / 2 &&
            this.ry > this.chunk.map.camera.y - this.chunk.map.blockHeight / 2
            );
    }

    deleteBlock() {
        this.setMaterial("air");
    }
    startHitAnimation(player, startpos) {
        if(this.element == null) return;
        
        this.hitanimation.starttime = actualtime;
        this.hitanimation.running = true;

        this.element.style.setProperty("--xknockdir", `${startpos.x < this.rx || startpos.x > this.rx + 1 ? (startpos.x < this.rx ? 1 : -1) : 0}`);
        this.element.style.setProperty("--yknockdir", `${startpos.y < this.ry || startpos.y > this.ry + 1 ? (startpos.y < this.ry ? 1 : -1) : 0}`);
    }
    updateHitAnimation() { 
        if(this.element == null) return;
        if(!this.hitanimation.running) return;

        let state = (actualtime - this.hitanimation.starttime) / 3000;
        if(state > 1) {
            state = 1;
            this.hitanimation.running = false;
        }

        const color = this.getColor();
        let newcolor = {
            r: color.r * state + this.hitanimation.color.r * (1 - state),
            g: color.g * state + this.hitanimation.color.g * (1 - state),
            b: color.b * state + this.hitanimation.color.b * (1 - state)
        };

        if(
            this.hitanimation.oldcolor.r != newcolor.r ||
            this.hitanimation.oldcolor.g != newcolor.g ||
            this.hitanimation.oldcolor.b != newcolor.b
        ) {
            this.element.style.setProperty("--blockcolor", `rgb(${newcolor.r}, ${newcolor.g}, ${newcolor.b})`);
            this.hitanimation.oldcolor = newcolor;
        }
        if(
            state != this.hitanimation.oldstate
        ) {
            this.element.style.setProperty("--hitanimationstate", `${(1 - state)}`);
            this.hitanimation.oldstate = state;
        }
    }
}