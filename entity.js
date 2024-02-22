class Entity {
    constructor(hitbox, element) {
        this.hitbox = new Hitbox(hitbox);
        this.element = null;
        if(element) this.element = element;
        this.x = 0;
        this.y = 0;
        this.lastx = NaN;
        this.lasty = NaN;
        this.velocity = { x: 0, y: 0};
        this.visibilitytreshold = 200;
        this.lastvisibilitystatus = true;
        this.visibility = true;
    }
    registerHitbox(data) {
        if(this.hitbox != null) {
            this.hitbox.deleteHitbox();
        }
        this.hitbox = new Hitbox(data);
    }
    registerElement(element) {
        this.element = element;
    }
    getPositionOnScreen() {
        return {
            x: map.width / 2 + this.x * map.scale - map.camera.x * map.scale,
            y: map.height / 2 - this.y * map.scale + map.camera.y * map.scale + map.scale
        }
    }
    isOnScreen() {
        const pos = this.getPositionOnScreen();
        return !(pos.x < -this.visibilitytreshold || pos.x > map.width + this.visibilitytreshold ||
            pos.y < -this.visibilitytreshold || pos.y > map.height + this.visibilitytreshold);
    }
    updateEntity(nophysics) {
        this.updateHitbox();
        this.hitbox.updateMark();

        if(!nophysics)
            this.updatePhysics();
        this.updatePositionStyle();
        this.updateVisibility();
    }
    updateVisibility() {
        if(this.element == null) return;
        this.visibility = this.isOnScreen();
        if(this.visibility != this.lastvisibilitystatus) {
            this.lastvisibilitystatus = this.visibility;
            this.element.style.setProperty("display", this.visibility ? "block" : "none");
        }
    }
    updateHitbox() {
        this.hitbox.x = this.x;
        this.hitbox.y = this.y;
    }
    checkCollision(startpos) {
        for(let x = -1; x < 2; x++) {
            for(let y = -1; y < 2; y++) {
                const block = map.getBlock(this.x + x, this.y + y);
                if(block.hitbox.collides(this.hitbox))
                    return this.onCollision(block, startpos);
            }
        }
        return false;
    }
    onCollision(block, startpos) { return block; }
    registerOnCollision(callback) { this.onCollision = callback; }
    updatePosition() {
        if(this.hitbox == null) return;
        if(this.velocity.x == 0 && this.velocity.y == 0) return;

        const tick = function(p) {
            let startpos = {
                x: p.x, y: p.y
            };

            if(p.velocity.x != 0) {
                p.x += p.velocity.x / 0.9;
                p.updateHitbox();
                if(p.checkCollision(startpos)) {
                    p.x -= p.velocity.x / 0.9
                    p.velocity.x = -p.velocity.x;
                    p.updateHitbox();
                }
                if(Math.abs(p.velocity.x) < 0.0001) p.velocity.x = 0;   
            }
            if(p.velocity.y != 0) {
                p.y += p.velocity.y / 0.9;
                p.updateHitbox();
                if(p.checkCollision(startpos)) {
                    p.y -= p.velocity.y / 0.9
                    p.velocity.y = -p.velocity.y;
                    p.updateHitbox();
                }
                if(Math.abs(p.velocity.y) < 0.0001) p.velocity.y = 0;
            }
            
            p.velocity.x *= 0.9;
            p.velocity.y *= 0.9;
        }
        for(let i=0; i<1; i++) {
            tick(this);
        }
        map.setCameraTarget(this.x, this.y - 1);
    }
    updatePhysics() {
        this.updatePosition();
    }
    updatePositionStyle() {
        if(this.element == null) return;
        if(!this.visibility) return;
        if(this.x != this.lastx) {
            this.element.style.setProperty("--x", this.x);
            this.lastx = this.x;
        }
        if(this.y != this.lasty) {
            this.element.style.setProperty("--y", this.y);
            this.lastx = this.y;
        }
    }
}