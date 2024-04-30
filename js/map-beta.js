// DEBUG
document.getElementsByTagName("body")[0].style.backgroundColor = "black";
let modes = document.getElementsByClassName("mode");
for(let i = 0; i < modes.length; i++) {
    const mode = modes[i];
    mode.style.top = 50 * i + 10;
    mode.style.left = 10;

    console.log(mode);
}
