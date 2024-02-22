class Map {
    constructor(element) {
        this.element = element;
        this.documentfragment = new DocumentFragment();
        this.rdf = false; // refresh document fragment
        this.camera = {x: 0, y: -1};
        this.target = {x: 0, y: -1};
        this.loadingRadius = 1;
        this.chunks = {};
        this.updateSizes();
        this.scale = parseInt(getComputedStyle(document.body).getPropertyValue('--scale').replace("px", ""));
        this.blocksizeTreshold = 1;
        this.animations = {
            powerup: []
        };
    }

    appendChild(element) {
        this.rdf = true;
        this.documentfragment.appendChild(element);
    }

    setCamera(x, y) {
        this.camera = {x: x, y: y};
        this.target = {x: x, y: y};
    }
    setCameraTarget(x, y) {
        this.target = {x: x, y: y};
    }

    updateCameraStyle() {
        this.element.style.setProperty("--camerax", this.camera.x);
        this.element.style.setProperty("--cameray", this.camera.y);
    }
    updateStyle() {
        this.updateCameraStyle();
    }

    updateMovement() {
        this.camera.x += (this.target.x - this.camera.x) * 0.08;
        this.camera.y += (this.target.y - this.camera.y) * 0.08;
    }
    updatePhysics() {
        this.updateMovement();
    }

    update() {
        this.updateStyle();
        this.updatePhysics();
        this.updateSizes();
        this.updateAnimations();
    }

    updateElements() {
        if(this.rdf == false) return;
        this.rdf = false;
        this.element.appendChild(this.documentfragment);
        this.documentfragment = new DocumentFragment();
    }
    runTick() {
        this.updateChunks();
        this.updateElements();
    }



    addChunk(chunk) {
        if(!this.chunks[`${chunk.position.x};${chunk.position.y}`])
            this.chunks[`${chunk.position.x};${chunk.position.y}`] = chunk;
    }
    getChunk(x, y) {
        if(!this.chunks[`${x};${y}`]) {
            this.chunks[`${x};${y}`] = new Chunk(x, y, this);
        }
        return this.chunks[`${x};${y}`];
    }
    getBlock(x, y) {
        return this.getChunk(Math.floor(x / 16), Math.floor(y / 16))
            .getBlock(
                Math.floor(x < 0 ? (16 + x % 16) % 16 : x % 16),
                Math.floor(y < 0 ? (16 + y % 16) % 16 : y % 16)
                );
    }
    updateChunksRadius() {
        const ch = this.getBlock(this.camera.x, this.camera.y).getChunk();

        for(const index in this.chunks) {
            const chunk = this.chunks[index];
            if(
                chunk.position.x > ch.position.x + this.loadingRadius ||
                chunk.position.x < ch.position.x - this.loadingRadius ||
                chunk.position.y > ch.position.y + this.loadingRadius ||
                chunk.position.y < ch.position.y - this.loadingRadius
                ) {
                    chunk.deleteChunk();
                }
        }
        for(let x = ch.position.x - this.loadingRadius; x <= ch.position.x + this.loadingRadius; x++) {
            for(let y = ch.position.y - this.loadingRadius; y <= ch.position.y + this.loadingRadius; y++) {
                this.getChunk(x, y);
            }
        }
    }
    updateChunks() {
        for(const index in this.chunks) {
            const chunk = this.chunks[index];
            chunk.update();
        }
    }

    updateSizes() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.blockWidth = Math.ceil(this.width / this.scale) + this.blocksizeTreshold * 2;
        this.blockHeight = Math.ceil(this.height / this.scale) + this.blocksizeTreshold * 2;

        let scaley = this.height/9;
        let scalex = this.width/15;

        let smaller = scaley < scalex ? scaley : scalex;

        if(this.scale != smaller) {
            document.body.style.setProperty("--scale", smaller + "px");
            this.scale = smaller;
        }
    }

    updateAnimations() {
        for(const i of this.animations.powerup) {
            i.update();
        }
    }
}