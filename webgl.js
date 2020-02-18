//Main function, to be called on load
function main() {

    //Get canvas element from DOM
    const canvas = document.getElementById("canvas");

    //Get webgl context for canvas
    const ctx = canvas.getContext("webgl");

    //Only continue if WebGL is available and working
    if (ctx === null) {

        alert("Unable to initialize WebGL. This browser may not support it.");
        console.error("Unable to initialize WebGL. This browser may not support it.");
        return;
    }

    //Set clear color, all black, fully opaque
    ctx.clearColor(0.0, 0.0, 0.0, 1.0);

    //Clear the color buffer
    ctx.clear(ctx.COLOR_BUFFER_BIT);
}

//On window load, call main
window.onload = main;