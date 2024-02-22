class Chunk {
    constructor(cx, cy, map) {
        this.blocks = new Array(16);
        for(let x = 0; x < this.blocks.length; x++) {
            this.blocks[x] = new Array(16);
            for(let y = 0; y < this.blocks[x].length; y++) {
                this.blocks[x][y] = new Block(this, x, y, cx * 16 + x, cy * 16 + y);
            }
        }

        this.position = {x: cx, y: cy};
        this.map = map;
        this.powerups = [];

        this.generateChunk();
    }
    deleteChunk() {
        for(const x of this.blocks) {
            for(const y of x) {
                y.deleteBlock();
            }
        }
        delete this.map.chunks[`${this.position.x};${this.position.y}`];
        for(const pup of this.powerups) {
            pup.deletePowerUp();
        }
    }
    getBlock(x, y) {
        try {
        return this.blocks[x][y];
        }
        catch(e) {
            console.error(e.stack);
            console.log(x, y);
        }
    }
    generateChunk() {
        for(let x=0; x<16; x++) {
            for(let y=0; y<16; y++) {
                if(Math.random() < 0.1) {
                    this.blocks[x][y].setMaterial("stone");
                }
                else if(Math.random() < 0.05) {
                    this.powerups.push(new PowerUp(this.position.x * 16 + x, this.position.y * 16 + y));
                }
            }
        }
    }

    update() {
        this.updateBlocks();
        this.updatePowerups();
    }

    updateBlocks() {
        for(const x of this.blocks) {
            for(const y of x) {
                y.update();
            }
        }
    }
    updatePowerups() {
        for(const pup of this.powerups) {
            pup.update();
        }
    }
}