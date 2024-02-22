// Change to true to show hitboxes on screen
let showHitboxes = false;

class Hitbox {

    constructor(data) {
        this.empty = typeof data == "undefined";
        if(this.empty) return;

        this.offset = {x: 0, y: 0};
        this.x = data.x;
        this.y = data.y;
        this.w = data.w;
        this.h = data.h;
        this.centered = typeof data.centered != "undefined" ? data.centered : false;

        if(showHitboxes || data.mark?.enabled) {
            this.mark = new HitboxMark(this, data.mark?.styles);
            this.mark.createMark();
        }
        else {
            this.mark = false;
        }
    }

    getRect() {

        return this.empty ? {x1:0,y1:0,x2:0,y2:0} : (
            this.centered ? 
            {
                x1: this.x - this.w / 2 + this.offset.x,
                y1: this.y - this.h / 2 + this.offset.y,
                x2: this.x + this.w / 2 + this.offset.x,
                y2: this.y + this.h / 2 + this.offset.y,
            } :
            {
            x1: this.x + this.offset.x,
            y1: this.y + this.offset.y,
            x2: this.x + this.w + this.offset.x,
            y2: this.y + this.h + this.offset.y,
        }
        );
    }

    contains(point, _rect) {
        if(this.empty) return false;

        const rect = _rect ? _rect : this.getRect();
        return point.x >= rect.x1 && point.x <= rect.x2 && point.y >= rect.y1 && point.y <= rect.y2;
    }

    collides(hitbox) {
        if(this.empty) return false;

        const trect = this.getRect();
        const orect = hitbox.getRect();

        return (
            this.contains({x: orect.x1, y: orect.y1}, trect) ||
            this.contains({x: orect.x1, y: orect.y2}, trect) ||
            this.contains({x: orect.x2, y: orect.y1}, trect) ||
            this.contains({x: orect.x2, y: orect.y2}, trect) ||
            hitbox.contains({x: trect.x1, y: trect.y1}, orect) ||
            hitbox.contains({x: trect.x1, y: trect.y2}, orect) ||
            hitbox.contains({x: trect.x2, y: trect.y1}, orect) ||
            hitbox.contains({x: trect.x2, y: trect.y2}, orect)
        );
    }

    updateMark() {
        if(this.empty || !this.mark) return;
        this.mark.update();
    }
    deleteHitbox() {
        if(this.empty) return;
        if(this.mark) this.mark.deleteMark();
        this.empty = true;
    }

}