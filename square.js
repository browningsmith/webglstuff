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

    //Source code for vertex shader program
    const vsSourceCode = `
    
        attribute vec4 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {

            gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        }
    `;

    //Source code for fragment shader program
    const fsSourceCode = `
    
        void main() {

            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;

    //Create pointer to new vertex shader
    const vertexShader = ctx.createShader(ctx.VERTEX_SHADER);

    //Feed it the source code
    ctx.shaderSource(vertexShader, vsSourceCode);

    //Compile the vertex shader
    ctx.compileShader(vertexShader);

    //If the vertex shader did not compile, write error to console and exit
    if (!ctx.getShaderParameter(vertexShader, ctx.COMPILE_STATUS)) {

        console.error("An error occured compiling the vertex shader: " + ctx.getShaderInfoLog(vertexShader));
        ctx.deleteShader(vertexShader); //Delete the vertexShader
        return;
    }

    //Create pointer to new fragment shader
    const fragmentShader = ctx.createShader(ctx.FRAGMENT_SHADER);

    //Feed it the source code
    ctx.shaderSource(fragmentShader, fsSourceCode);

    //Compile the fragment shader
    ctx.compileShader(fragmentShader);

    //If the fragment shader did not compile, write error to console and exit
    if (!ctx.getShaderParameter(fragmentShader, ctx.COMPILE_STATUS)) {

        console.error("An error occured compiling the vertex shader: " + ctx.getShaderInfoLog(fragmentShader));
        ctx.deleteShader(vertexShader); //Delete the vertexShader
        ctx.deleteShader(fragmentShader); //Delete the fragmentShader
        return;
    }

    //Create pointer to the full shader program
    const shaderProgram = ctx.createProgram();

    //Attach the vertex shader and the fragment shader
    ctx.attachShader(shaderProgram, vertexShader);
    ctx.attachShader(shaderProgram, fragmentShader);

    //Link the shader programs
    ctx.linkProgram(shaderProgram);

    //If the full shader program did not link, print error to console and exit
    if (!ctx.getProgramParameter(shaderProgram, ctx.LINK_STATUS)) {

        console.error("An error occured compiling linking the vertex shader and the fragment shader: " + ctx.getProgramInfoLog(shaderProgram));
        return;
    }

    //Now the shader program has been created

    //Get locations of shader program inputs, store in object programInfo
    const programInfo = {

        program: shaderProgram,
        attribLocations: {

            vertexPosition: ctx.getAttribLocation(shaderProgram, "aVertexPosition"),
        },

        uniformLocations: {

            projectionMatrix: ctx.getUniformLocation(shaderProgram, "uProjectionMatrix"),
            modelViewMatrix: ctx.getUniformLocation(shaderProgram, "uModelViewMatrix"),
        },
    };

    //Create an array of vertices for the square
    const squareVertices = [

        -1.0, 1.0,
         1.0, 1.0,
        -1.0, -1.0,
         1.0, -1.0,
    ];

    //Create a pointer to a new buffer object to feed them in to
    const vertexBuffer = ctx.createBuffer();

    //Bind vertexBuffer to an array buffer
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);

    //Pass the vertices of the square into the vertex buffer
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(squareVertices), ctx.STATIC_DRAW);

    drawScene(programInfo, vertexBuffer);

    function drawScene(programInfo, vertexBuffer) {

        ctx.clearColor(0.0, 0.0, 0.0, 1.0); //Set clearing color to black, fully opaque
        ctx.clearDepth(1.0); //Makes sure everything gets cleared, I assume
        ctx.enable(ctx.DEPTH_TEST); //Enables something called depth testing
        ctx.depthFunc(ctx.LEQUAL); //Sets it so near things obscure far things

        //Clear everything
        ctx.clear(ctx.COLOR_BUFFER_BIT, ctx.DEPTH_BUFFER_BIT);

        //Create a perspective matrix, which will be used to simulate how the scene would look if
        //viewed by a camera facing a certain way with a certain field of vision

        const FOV = 45 * Math.PI / 180; //Field of view in radians
        const aspectRatio = ctx.canvas.clientWidth / ctx.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;

        const projectionMatrix = mat4.create(); //Create new 4x4 matrix

        mat4.perspective(projectionMatrix, FOV, aspectRatio, zNear, zFar);

        //Create a modelViewMatrix, which I'm not sure what it is for :/
        const modelViewMatrix = mat4.create();

        mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

        // Tell WebGL how to pull out the positions from the position
        // buffer into the vertexPosition attribute.
        {
            const numComponents = 2;    // pull out 2 values per iteration
            const type = ctx.FLOAT;     // the data in the buffer is 32bit floats
            const normalize = false;    // don't normalize
            const stride = 0;           // how many bytes to get from one set of values to the next
                                        // 0 = use type and numComponents above
            const offset = 0;           // how many bytes inside the buffer to start from
            ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);
            ctx.vertexAttribPointer(
                programInfo.attribLocations.vertexPosition,
                numComponents,
                type,
                normalize,
                stride,
                offset);
            ctx.enableVertexAttribArray(
                programInfo.attribLocations.vertexPosition);
        }

        //Tell WebGL to use our program when drawing:
        ctx.useProgram(programInfo.program);

        //Set shader uniforms
        ctx.uniformMatrix4fv(

            programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);

        ctx.uniformMatrix4fv(

            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        //Draw the square
        ctx.drawArrays(ctx.TRIANGLE_STRIP, 0, 4);
    }
}

//On window load, call main
window.onload = main;