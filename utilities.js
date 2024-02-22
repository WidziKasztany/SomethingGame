const mousepos = { x: 0, y: 0 }
document.addEventListener("mousemove", e => {
    mousepos.x = e.x;
    mousepos.y = e.y;

    player.updateRotation();
    player.updateRotationStyle();
});
let actualtime = 0;
setInterval(() => {
    actualtime = (new Date()).getTime();
}, 10);