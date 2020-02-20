const vertexShaderCode = `

    attribute vec4 a_vertexPosition;
    attribute vec4 a_vertexColor;
    
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_modelViewMatrix;

    varying lowp vec4 v_currentColor;

    void main(void) {

        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_vertexPosition;
        v_currentColor = a_vertexColor;
    }
`;

const fragmentShaderCode = `

    varying lowp vec4 v_currentColor;

    void main(void) {

        gl_FragColor = v_currentColor;
    }
`;

var cubeRotation = 0.0;

//Main function, to be executed on load
function main() {

    //Get canvas element
    const canvas = document.getElementById("canvas");

    //Get canvas context
    const ctx = canvas.getContext("webgl");

    //If unable to get context, alert user and end program
    if (!ctx) {

        alert("Unable to initialize WebGL. It may not be supported by this browser.");
        return;
    }

    //Clear the canvas
    ctx.clearColor(0.0, 0.0, 0.0, 1.0); //set clear color to black
    ctx.clearDepth(1.0); //set clear depth to 1.0
    ctx.clear(ctx.COLOR_BUFFER_BIT, ctx.DEPTH_BUFFER_BIT);

    //Create the shader program
    const shaderProgram = createShaderProgram(ctx);

    //Get location of attributes and uniforms, store in shaderProgramData object
    const shaderProgramData = {

        program: shaderProgram,
        attributes: {

            vertexPosition: ctx.getAttribLocation(shaderProgram, "a_vertexPosition"),
            vertexColor: ctx.getAttribLocation(shaderProgram, "a_vertexColor"),
        },
        uniforms: {

            projectionMatrix: ctx.getUniformLocation(shaderProgram, "u_projectionMatrix"),
            modelViewMatrix: ctx.getUniformLocation(shaderProgram, "u_modelViewMatrix"),
        },
    };

    //Create and fill buffers
    const buffers = initBuffers(ctx);

    //Initialize cubeRotation to 0.0
    cubeRotation = 0.0;

    //Initialize previousTimestamp
    var previousTimeStamp = 0;

    function newFrame(now) {

        //Get change in time
        now *= 0.001; //Convert to seconds

        var deltaT = now - previousTimeStamp;
        previousTimeStamp = now;

        drawScene(ctx, shaderProgramData, buffers, deltaT);

        requestAnimationFrame(newFrame);
    }

    requestAnimationFrame(newFrame);
}

//Function to create shader program
function createShaderProgram(ctx) {

    //Compile shaders
    const vertexShader = loadShader(ctx, ctx.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader = loadShader(ctx, ctx.FRAGMENT_SHADER, fragmentShaderCode);

    //Create pointer to new shader program
    const newShaderProgram = ctx.createProgram();

    //Attach shaders
    ctx.attachShader(newShaderProgram, vertexShader);
    ctx.attachShader(newShaderProgram, fragmentShader);

    //Link program to complete
    ctx.linkProgram(newShaderProgram);

    //If there was an error linking, print error to console and return null
    if (!ctx.getProgramParameter(newShaderProgram, ctx.LINK_STATUS)) {

        console.error("Error creating shader program: " + ctx.getProgramInfoLog(newShaderProgram));
        return null;
    }

    return newShaderProgram;
}

//Function to compile a shader
function loadShader(ctx, type, code) {

    //Create pointer to a new shader
    const newShader = ctx.createShader(type);

    //Attach the code
    ctx.shaderSource(newShader, code);

    //Compile the shader
    ctx.compileShader(newShader);

    //If there was an error compiling, print error to console, delete shader, and return null
    if (!ctx.getShaderParameter(newShader, ctx.COMPILE_STATUS)) {

        console.error("Error compiling a shader: " + ctx.getShaderInfoLog(newShader));
        ctx.deleteShader(newShader);
        return null;
    }

    return newShader;
}

//Function to create and fill buffers
function initBuffers(ctx) {


    const pyramidVertices = [

        //Bottom
        -1.0, -1.0, 0.0,  1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0, 1.0, 1.0, 0.0,

        //Left
        -1.0, -1.0, 0.0,
        -1.0, 1.0, 0.0,
        0.0, 0.0, 1.5,

        //Back
        -1.0, 1.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 0.0, 1.5,

        //Right
        1.0, -1.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 0.0, 1.5,

        //Front
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        0.0, 0.0, 1.5,
    ];

    const pyramidColors = [

        //Bottom white
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,
        1.0, 1.0, 1.0, 1.0,

        //Left red
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        //Back green
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,
        0.0, 1.0, 0.0, 1.0,

        //Right blue
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 0.0, 1.0, 1.0,

        //Front purple
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
        1.0, 0.0, 1.0, 1.0,
    ];

    const pyramidIndices = [

        //Bottom
        0, 1, 2,
        1, 2, 3,

        //Left
        4, 5, 6,

        //Back
        7, 8, 9,

        //Right
        10, 11, 12,

        //Front
        13, 14, 15,
    ];

    //Create pointer to a new buffer
    const vertexBuffer = ctx.createBuffer();

    //Bind buffer to array buffer
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);

    //Pass in the vertex data
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(pyramidVertices), ctx.STATIC_DRAW);

    //Create pointer to a new buffer
    const colorBuffer = ctx.createBuffer();

    //Bind buffer to array buffer
    ctx.bindBuffer(ctx.ARRAY_BUFFER, colorBuffer);

    //Pass in color data
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(pyramidColors), ctx.STATIC_DRAW);

    //Create pointer to a new buffer
    const indexBuffer = ctx.createBuffer();

    //Bind buffer to element array buffer
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexBuffer);

    //Pass in the index data
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(pyramidIndices), ctx.STATIC_DRAW);

    return {

        vertex: vertexBuffer,
        index: indexBuffer,
        color: colorBuffer,
    }
}

//Function to draw a new scene
function drawScene(ctx, shaderProgramData, buffers, deltaT) {

    ctx.canvas.width = ctx.canvas.clientWidth;   //Resize canvas to fit CSS styling
    ctx.canvas.height = ctx.canvas.clientHeight;

    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height); //Resize viewport

    //Clear the canvas
    ctx.clearColor(0.0, 0.0, 0.0, 1.0); //set clear color to black
    ctx.clearDepth(1.0); //set clear depth to 1.0
    ctx.clear(ctx.COLOR_BUFFER_BIT, ctx.DEPTH_BUFFER_BIT);

    //Enable depth testing and have it obscure objects further back
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.LEQUAL);

    //Compute new projection matrix
    const newProjectionMatrix = mat4.create();
    mat4.perspective(newProjectionMatrix, 45 * Math.PI / 180, ctx.canvas.width / ctx.canvas.height, 0.1, 100.0);

    //Compute new model view matrix, move square back by 6, and rotate around z axis and x axis based on cubeRotation
    const newModelViewMatrix = mat4.create();

    mat4.translate(newModelViewMatrix, newModelViewMatrix, [0.0, 0.0, -6.0]);

    mat4.rotate(newModelViewMatrix, newModelViewMatrix, cubeRotation, [1, 0, 0]);
    mat4.rotate(newModelViewMatrix, newModelViewMatrix, cubeRotation * 4, [0, 0, 1]);
    
    //Instruct WebGL how to pull out vertices
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.vertex);
    ctx.vertexAttribPointer(shaderProgramData.attributes.vertexPosition, 3, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexPosition);

    //Instruct WebGL how to pull out colors
    ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.color);
    ctx.vertexAttribPointer(shaderProgramData.attributes.vertexColor, 4, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexColor);

    //Tell WebGl to use element array
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, buffers.index);

    //Tell WebGL to use the shader program
    ctx.useProgram(shaderProgramData.program);

    //Set the uniforms
    ctx.uniformMatrix4fv(shaderProgramData.uniforms.projectionMatrix, false, newProjectionMatrix);
    ctx.uniformMatrix4fv(shaderProgramData.uniforms.modelViewMatrix, false, newModelViewMatrix);

    //Draw triangles
    ctx.drawElements(ctx.TRIANGLES, 18, ctx.UNSIGNED_SHORT, 0);

    //Update cubeRotation for next draw
    cubeRotation += deltaT;
}

window.onload = main;