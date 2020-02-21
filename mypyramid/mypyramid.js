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

var models = {

    pyramid: {
    
        vertexValues: [

            //Bottom
            -1.0, -1.0, 0.0,  1.0, -1.0, 0.0,
            -1.0, 1.0, 0.0,
        ],

        colorValues: [

            //Bottom white
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
        ],

        indexValues: [

            //Bottom
            0, 1, 2,
        ],

        indexCount: 3,
	},
};

var objectRotation = 0.0;

//Camera object, contains data on camera position and angle
var camera = {

    x: 0.0, //Camera initialized at origin
    y: 0.0,
    z: 0.0,

    roll: 0.0, //Camera facing forward (or something)
    pitch: 0.0,
    yaw: 0.0,

    speed: 0.1,
};

//Mouse position, contains data on last mouse position relative to the canvas
var lastMousePosition = {

    inWindow: false,
    x: 0,
    y: 0,
};

//Main function, to be executed on load
function main() {

    //Get canvas element
    const canvas = document.getElementById("canvas");

    //Add mouse event listeners
    canvas.addEventListener("mousemove", updateMouse);
    canvas.addEventListener("mouseleave", mouseLeave);
    window.addEventListener("keydown", parseKeys);

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

    //Create and fill buffers, attach them to their respective models
    for (model in models) {

        models[model].buffers = initBuffers(ctx, model);
	}

    //Initialize objectRotation to 0.0
    objectRotation = 0.0;

    //Initialize previousTimestamp
    var previousTimeStamp = 0;

    function newFrame(now) {

        //Get change in time
        now *= 0.001; //Convert to seconds

        var deltaT = now - previousTimeStamp;
        previousTimeStamp = now;

        drawScene(ctx, shaderProgramData, deltaT);

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

//Function to create and fill buffers and attach them to their respective models
function initBuffers(ctx, model) {

    //Create pointer to a new buffer
    var vertexBuffer = ctx.createBuffer();

    //Bind buffer to array buffer
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer);

    //Pass in the vertex data
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(models[model].vertexValues), ctx.STATIC_DRAW);

    //Create pointer to a new buffer
    var colorBuffer = ctx.createBuffer();

    //Bind buffer to array buffer
    ctx.bindBuffer(ctx.ARRAY_BUFFER, colorBuffer);

    //Pass in color data
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(models[model].colorValues), ctx.STATIC_DRAW);

    //Create pointer to a new buffer
    var indexBuffer = ctx.createBuffer();

    //Bind buffer to element array buffer
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, indexBuffer);

    //Pass in the index data
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, new Uint16Array(models[model].indexValues), ctx.STATIC_DRAW);

    return {

        vertex: vertexBuffer,
        index: indexBuffer,
        color: colorBuffer,
    };
}

//Function to draw a new scene
function drawScene(ctx, shaderProgramData, deltaT) {

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

    //Compute new model view matrix
    const newModelViewMatrix = mat4.create();

    mat4.rotate(newModelViewMatrix, newModelViewMatrix, camera.pitch, [1, 0, 0]);  //Sixth transform: rotate based on camera pitch
    mat4.rotate(newModelViewMatrix, newModelViewMatrix, camera.yaw, [0, 1, 0]); //Fifth transform: rotate based on camera yaw
    mat4.translate(newModelViewMatrix, newModelViewMatrix, [camera.x, camera.y, camera.z]);  //Fourth transform: move object away from camera

    mat4.translate(newModelViewMatrix, newModelViewMatrix, [0.0, 0.0, -6.0]);  //Third transform: move back from origin by -6
    mat4.rotate(newModelViewMatrix, newModelViewMatrix, objectRotation, [1, 0, 0]); //Second transform: rotate around x
    mat4.rotate(newModelViewMatrix, newModelViewMatrix, objectRotation * 4, [0, 0, 1]);  //First transform: rotate around z

    //Instruct WebGL how to pull out vertices
    ctx.bindBuffer(ctx.ARRAY_BUFFER, models.pyramid.buffers.vertex);
    ctx.vertexAttribPointer(shaderProgramData.attributes.vertexPosition, 3, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexPosition);

    //Instruct WebGL how to pull out colors
    ctx.bindBuffer(ctx.ARRAY_BUFFER, models.pyramid.buffers.color);
    ctx.vertexAttribPointer(shaderProgramData.attributes.vertexColor, 4, ctx.FLOAT, false, 0, 0);
    ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexColor);

    //Tell WebGl to use element array
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, models.pyramid.buffers.index);

    //Tell WebGL to use the shader program
    ctx.useProgram(shaderProgramData.program);

    //Set the uniforms
    ctx.uniformMatrix4fv(shaderProgramData.uniforms.projectionMatrix, false, newProjectionMatrix);
    ctx.uniformMatrix4fv(shaderProgramData.uniforms.modelViewMatrix, false, newModelViewMatrix);

    //Draw triangles
    ctx.drawElements(ctx.TRIANGLES, models.pyramid.indexCount, ctx.UNSIGNED_SHORT, 0);

    //Update objectRotation for next draw
    objectRotation += deltaT;
}

//Function to update mouse position on mouse move
function updateMouse(event) {

    //If the mouse is not in the window, record coordinates, set that it is in window, and return
    if (!lastMousePosition.inWindow) {
     
        lastMousePosition.x = event.offsetX; //record x
        lastMousePosition.y = event.offsetY; //record y
        lastMousePosition.inWindow = true; //Set that mouse is in window

        return;
	}

    //Record change in x and y
    var deltaX = event.offsetX - lastMousePosition.x;
    var deltaY = event.offsetY - lastMousePosition.y;

    //Update mouse position
    lastMousePosition.x = event.offsetX;
    lastMousePosition.y = event.offsetY;

    //Update camera angle
    updatePitch(deltaY);
    updateYaw(deltaX);
}

//Function to reset inwindow flag for mouse if mouse leaves
function mouseLeave(event) {

    lastMousePosition.inWindow = false;
}

//Function to update camera pitch based on change in Y
function updatePitch(deltaY) {

    camera.pitch += deltaY * 0.005;

    //If pitch mod 2 pi is greater than pi / 2, set pitch to pi / 2

    //If pitch mod 2 pi is less than - pi / 2, set pitch to pi / 2
}

//Function to update camera yaw based on change in X
function updateYaw(deltaX) {

    camera.yaw += deltaX * 0.005;
}

//Function to interpret keys to move camera around
function parseKeys(event) {

    console.log(event.code);

    if (event.code == "KeyW") { //Forward
    
        moveForward();
	}
    else if (event.code == "KeyS") { //Backward
    
        moveBackward();
	}
    else if (event.code == "KeyA") { //Left
    
        moveLeft();
	}
    else if (event.code == "KeyD") { //Right
    
        moveRight();
	}
}

//Function to move forward based on camera yaw
function moveForward() {

    camera.x -= camera.speed * Math.sin(camera.yaw);
    camera.z += camera.speed * Math.cos(camera.yaw);
}

//Function to move backward based on camera yaw
function moveBackward() {

    camera.x += camera.speed * Math.sin(camera.yaw);
    camera.z -= camera.speed * Math.cos(camera.yaw);
}

//Function to move left based on camera yaw
function moveLeft() {

    camera.x += camera.speed * Math.cos(camera.yaw);
    camera.z += camera.speed * Math.sin(camera.yaw);
}

//Function to move right based on camera yaw
function moveRight() {

    camera.x -= camera.speed * Math.cos(camera.yaw);
    camera.z -= camera.speed * Math.sin(camera.yaw);
}

window.onload = main;