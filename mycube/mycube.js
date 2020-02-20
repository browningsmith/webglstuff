//const speed = 0.2;

/*var cameraPosition = {

    x: 0.0,
    y: 0.0,
    z: -6.0,
};

var cameraAngle = {

    pitch: 0.0,
    roll: 0.0,
    yaw: 0.0,
};

var oldMouseCoordinates = {

    hasFirstRecord: false,
    x: 0,
    y: 0,
    z: 0,
};*/

//Vertex Shader code
const vertexShaderCode = `

    attribute vec4 avertexPosition;
    
    uniform mat4 umodelViewMatrix;
    uniform mat4 uprojectionMatrix;

    void main(void) {
    
        gl_Position = uprojectionMatrix * umodelViewMatrix * avertexPosition;
	}
`;

const fragmentShaderCode = `

    void main(void) {
    
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
	}
`;

//Main function
function main() {

    //Get canvas element
    const canvas = document.getElementById("canvas");

    //Expand canvas width and height to fit page
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //Get context
    const ctx = canvas.getContext("webgl");

    //If unable to get context, alert the user and terminate program
    if (!ctx) {
    
        alert("Unable to initialize WebGL. It may not be supported by this browser.");
        return;
	}

    //Create the shader program
    const shaderProgram = initShader(ctx);

    //Now that the shader program has been created, we need to grab it's data locations
    const shaderProgramData = {
    
        program: shaderProgram,
        attributes: {
      
            vertexPosition: ctx.getAttribLocation(shaderProgram, "avertexPosition"),
		},

        uniforms: {
      
            modelViewMatrix: ctx.getUniformLocation(shaderProgram, "umodelViewMatrix"),
            projectionMatrix: ctx.getUniformLocation(shaderProgram, "uprojectionMatrix"),
		},
	};

    const buffers = initBuffers(ctx);

    function newFrame(now) {
    
        drawScene(ctx, shaderProgramData, buffers);
        
        requestAnimationFrame(newFrame);
	}

    requestAnimationFrame(newFrame);
}

//Function to create the shader program
function initShader(ctx) {

    //Compile the shaders
    const vertexShader = loadShader(ctx, ctx.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader = loadShader(ctx, ctx.FRAGMENT_SHADER, fragmentShaderCode);

    //Create pointer to a new shader program
    const newShaderProgram = ctx.createProgram();

    //Attach the shaders
    ctx.attachShader(newShaderProgram, vertexShader);
    ctx.attachShader(newShaderProgram, fragmentShader);

    //Link the program to finish
    ctx.linkProgram(newShaderProgram);

    //If there was an error creating the program, print error to console and exit program
    if (!ctx.getProgramParameter(newShaderProgram, ctx.LINK_STATUS)) {
    
        console.error("Error creating shader program: " + ctx.getProgramInfoLog(newShaderProgram));
        return null;
	}

    return newShaderProgram;
}

//Function to compile and return a Shader
function loadShader(ctx, type, code) {

    //Create pointer to a new Shader
    const newShader = ctx.createShader(type);

    //Attach the code
    ctx.shaderSource(newShader, code);

    //Compile the Shader
    ctx.compileShader(newShader);

    //If shader did not compile, write error to console, delete shader, and exit program
    if (!ctx.getShaderParameter(newShader, ctx.COMPILE_STATUS)) {
    
        console.error("Error compiling a shader: " + ctx.getShaderInfoLog(newShader));
        ctx.deleteShader(newShader);
        return null;
	}

    return newShader;
}

//Function to create buffer for our shapes
function initBuffers(ctx) {

    //Buffer for the square's vertices
    const positionBuffer = ctx.createBuffer();

    //Bind as array Buffer
    ctx.bindBuffer(ctx.ARRAY_BUFFER, positionBuffer);

    //Array of square coordinates
    const positions = [
    
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0,
    ];

    //Fill the Buffer
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(positions), ctx.STATIC_DRAW);

    return {
    
        position: positionBuffer,
	}
}

//Function to draw the scene
function drawScene(ctx, shaderProgramData, buffers) {

    //Clear the scene
    ctx.clearColor(0.0, 0.0, 0.0, 1.0);
    ctx.clearDepth(1.0);
    //Enable depth testing
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.LEQUAL);
    ctx.clear(ctx.COLOR_BUFFER_BIT, ctx.DEPTH_BUFFER_BIT);

    //Create projection matrix
    const FOV = 45 * Math.PI / 180; //Field of view 45 degrees converted to radians
    const aspect = ctx.canvas.clientWidth / ctx.canvas.clientHeight; //Aspect ratio
    const zNear = 0.1;
    const zFar = 100.0;

    const newProjectionMatrix = mat4.create(); //Create new identity matrix

    mat4.perspective(newProjectionMatrix,
                    FOV,
                    aspect,
                    zNear,
                    zFar
    );

    console.log(newProjectionMatrix);

    //Create the model view matrix
    const newModelViewMatrix = mat4.create(); //Create new identity matrix

    //Move the square back from the camera by 6
    mat4.translate(newModelViewMatrix,
                    newModelViewMatrix,
                    [-0.0, 0.0, -6.0]
    );

    console.log(newModelViewMatrix);

    //Direct WebGL to pull 2 units out of the positionBuffer
    {
    
        const numComponents = 2; //Pull out two coordinates for vertices each time
        const type = ctx.FLOAT; //Type is 32 bit FLOAT
        const normalize = false; //Don't normalize
        const stride = 0; //There is no space between elements in the Buffer
        const offset = 0; //There is no offset to start pulling from the buffer

        ctx.bindBuffer(ctx.ARRAY_BUFFER, buffers.position); //Bind the position buffer as array buffer

        //Enable pointer to pass info from buffer to proper attribute
        ctx.vertexAttribPointer(shaderProgramData.attributes.vertexPosition,
                                numComponents,
                                type,
                                normalize,
                                stride,
                                offset,
        );
        ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexPosition);
	}

    //Direct WebGL to use the shader program
    ctx.useProgram(shaderProgramData.program);

    //Connect the shader uniforms to the proper matrices
    ctx.uniformMatrix4fv(shaderProgramData.uniforms.projectionMatrix, false, newProjectionMatrix);
    ctx.uniformMatrix4fv(shaderProgramData.uniforms.modelViewMatrix, false, newModelViewMatrix);

    //Render the primitives!
    {
        const offset = 0; //Start on the first Vertex
        const count = 4; //Number of vertices to Render
        ctx.drawArrays(ctx.TRIANGLE_STRIP, offset, count);
	}
}

/*//Function to parse which keys have been pressed
function parseKeys(event) {

    console.log(event.code);

    //If it is the left arrow key
    if (event.code == "KeyA") {
    
        moveLeft(speed);
	}
    else if (event.code == "KeyD") {
    
        moveRight(speed);
	}
    else if (event.code == "KeyW") {
    
        moveForward(speed);
	}
    else if (event.code == "KeyS") {
    
        moveBackward(speed);
	}
    else if (event.code == "Space") {
    
        cameraPosition.y -= speed;
	}
    else if (event.code == "ShiftLeft") {
    
        cameraPosition.y += speed;
	}
}*/

/*//Function to move forward based on Camera yaw position
function moveForward(speed) {

  cameraPosition.z += speed * Math.cos(cameraAngle.yaw);
  cameraPosition.x -= speed * Math.sin(cameraAngle.yaw);
}

//Function to move backward based on Camera yaw position
function moveBackward(speed) {

  cameraPosition.z -= speed * Math.cos(cameraAngle.yaw);
  cameraPosition.x += speed * Math.sin(cameraAngle.yaw);
}

//Function to move left based on Camera yaw position
function moveLeft(speed) {

  cameraPosition.z += speed * Math.sin(cameraAngle.yaw);
  cameraPosition.x += speed * Math.cos(cameraAngle.yaw);
}

//Function to move right based on Camera yaw position
function moveRight(speed) {

  cameraPosition.z -= speed * Math.sin(cameraAngle.yaw);
  cameraPosition.x -= speed * Math.cos(cameraAngle.yaw);
}

//Function to update camera angle when user looks up or down
function updateCameraAngle(event) {

    //console.log("Mouse movement recorded");
    
    //Check to see if we need an initial mouse recording
    if (oldMouseCoordinates.hasFirstRecord == false) {
    
        //Record these as first oldCoordinates
        oldMouseCoordinates.x = event.offsetX;
        oldMouseCoordinates.y = event.offsetY;

        //Reset flag
        oldMouseCoordinates.hasFirstRecord = true;

        return;
	}

    var deltaX = event.offsetX - oldMouseCoordinates.x; //Get change in x
    var deltaY = event.offsetY - oldMouseCoordinates.y; //Get change in y

    //Update camera pitch based on change in y
    cameraAngle.pitch += deltaY * 0.005;

    //Update camera yaw based on change in x
    cameraAngle.yaw += deltaX * 0.005;

    //Update oldMouseCoordinates
    oldMouseCoordinates.x = event.offsetX;
    oldMouseCoordinates.y = event.offsetY;
}

//Function to reset mouse coordinates hasFirstRecord flag when mouse leaves
function resetMouseCoordinates(event) {

    //console.log("Mouse leave recorded");

    //Reset flag
    oldMouseCoordinates.hasFirstRecord = false;
}*/

window.onload = main;