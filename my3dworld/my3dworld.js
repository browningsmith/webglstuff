const vertexShaderCode = `

    attribute vec4 a_vertexPosition;
    attribute vec3 a_vertexNormal;
    attribute vec4 a_vertexColor;
    
    uniform mat4 u_projectionMatrix;
    uniform mat4 u_modelViewMatrix;
    uniform mat4 u_normalMatrix;
    uniform mat4 u_worldViewMatrix;

    varying lowp vec4 v_currentColor;
    varying highp vec3 v_currentLighting;

    void main(void) {

        gl_Position = u_projectionMatrix * u_worldViewMatrix * u_modelViewMatrix * a_vertexPosition;
        v_currentColor = a_vertexColor;
        
        highp vec3 ambientLight = vec3(0.4, 0.4, 0.4); //Set ambientLight to 0.3 rgb
        highp vec3 directionalLightColor = vec3(1.0, 1.0, 1.0); //Set directional light color to white

        highp vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0)); //Set light direction vector

        highp vec4 transformedNormal = u_normalMatrix * vec4(a_vertexNormal, 1.0); //Compute new normals based on cube rotation

        highp float directional = max(dot(transformedNormal.xyz, lightDirection),0.0); //Compute directional based on transformed normal and direction of light

        v_currentLighting = ambientLight + (directionalLightColor * directional); //Compute lighting of current vertex as ambient light plus directional light times the directional thingy
    }
`;

const fragmentShaderCode = `

    varying lowp vec4 v_currentColor;
    varying lowp vec3 v_currentLighting;

    void main(void) {

        gl_FragColor = vec4(v_currentColor.rgb * v_currentLighting, 1.0);
    }
`;

var models = {

    cube: {

        vertexValues: [

            // Front face
            -1.0, -1.0,  1.0,
            1.0, -1.0,  1.0,
            1.0,  1.0,  1.0,
            -1.0,  1.0,  1.0,
            
            // Back face
            -1.0, -1.0, -1.0,
            -1.0,  1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0, -1.0, -1.0,
            
            // Top face
            -1.0,  1.0, -1.0,
            -1.0,  1.0,  1.0,
            1.0,  1.0,  1.0,
            1.0,  1.0, -1.0,
            
            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0,  1.0,
            -1.0, -1.0,  1.0,
            
            // Right face
            1.0, -1.0, -1.0,
            1.0,  1.0, -1.0,
            1.0,  1.0,  1.0,
            1.0, -1.0,  1.0,
            
            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0,  1.0,
            -1.0,  1.0,  1.0,
            -1.0,  1.0, -1.0,
        ],

        normalValues: [

            // Front
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,
            0.0,  0.0,  1.0,

            // Back
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,
            0.0,  0.0, -1.0,

            // Top
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,
            0.0,  1.0,  0.0,

            // Bottom
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,
            0.0, -1.0,  0.0,

            // Right
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,
            1.0,  0.0,  0.0,

            // Left
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0,
            -1.0,  0.0,  0.0
        ],

        colorValues: [

            //Front white
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            1.0, 1.0, 1.0, 1.0,
            

            //Back Red
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            1.0, 0.0, 0.0, 1.0,
            

            //Top Green
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            

            //Bottom blue
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            

            //Right purple
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            1.0, 0.0, 1.0, 1.0,
            

            //Left yellow
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
            1.0, 1.0, 0.0, 1.0,
        ],

        indexValues: [

            0, 1, 2,
            0, 2, 3,

            4, 5, 6,
            4, 6, 7,

            8, 9, 10,
            8, 10, 11,

            12, 13, 14,
            12, 14, 15,

            16, 17, 18,
            16, 18, 19,

            20, 21, 22,
            20, 22, 23,
        ],
        indexCount: 36,
    },
};

var objects = {

    cube1: {
    
        x: 0.0,
        y: 0.0,
        z: -6.0,

        roll: 0.0,
        pitch: 0.0,
        yaw: 0.0,

        rollSpeed: 1.0,
        pitchSpeed: 0.0,
        yawSpeed: 2.0,

        model: models.cube,
    },

    cube2: {
    
        x: 0.0,
        y: -3.0,
        z: -12.0,

        roll: 0.0,
        pitch: 0.0,
        yaw: 0.0,

        rollSpeed: 0.0,
        pitchSpeed: 0.0,
        yawSpeed: 0.0,

        model: models.cube,
    },

    cube3: {
    
        x: 0.0,
        y: 0.0,
        z: -18.0,

        roll: 0.0,
        pitch: 0.0,
        yaw: 0.0,

        rollSpeed: 0.0,
        pitchSpeed: 0.0,
        yawSpeed: 0.0,

        model: models.cube,
    },

    cube4: {
    
        x: 0.0,
        y: 0.0,
        z: -24.0,

        roll: 0.0,
        pitch: 0.0,
        yaw: 0.0,

        rollSpeed: 0.0,
        pitchSpeed: 0.0,
        yawSpeed: 0.0,

        model: models.cube,
    },
};

//Camera object, contains data on camera position and angle
var camera = {

    x: 0.0, //Camera initialized at origin
    y: 0.0,
    z: 0.0,

    roll: 0.0, //Camera facing forward (or something)
    pitch: 0.0,
    yaw: 0.0,

    speed: 0.2,
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
    ctx.clearColor(0.3984375, 1.0, 1.0, 1.0); //set clear color to black
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
            vertexNormal: ctx.getAttribLocation(shaderProgram, "a_vertexNormal"),
        },
        uniforms: {

            projectionMatrix: ctx.getUniformLocation(shaderProgram, "u_projectionMatrix"),
            modelViewMatrix: ctx.getUniformLocation(shaderProgram, "u_modelViewMatrix"),
            worldViewMatrix: ctx.getUniformLocation(shaderProgram, "u_worldViewMatrix"),
            normalMatrix: ctx.getUniformLocation(shaderProgram, "u_normalMatrix"),
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

    //Create pointer to a new buffer
    var normalBuffer = ctx.createBuffer();

    //Bind the buffer to array buffer
    ctx.bindBuffer(ctx.ARRAY_BUFFER, normalBuffer);

    //Pass in normals data
    ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(models[model].normalValues), ctx.STATIC_DRAW);

    return {

        vertex: vertexBuffer,
        index: indexBuffer,
        color: colorBuffer,
        normal: normalBuffer,
    };
}

//Function to draw a new scene
function drawScene(ctx, shaderProgramData, deltaT) {

    ctx.canvas.width = ctx.canvas.clientWidth;   //Resize canvas to fit CSS styling
    ctx.canvas.height = ctx.canvas.clientHeight;

    ctx.viewport(0, 0, ctx.canvas.width, ctx.canvas.height); //Resize viewport

    //Clear the canvas
    ctx.clearColor(0.3984375, 1.0, 1.0, 1.0); //set clear color to black
    ctx.clearDepth(1.0); //set clear depth to 1.0
    ctx.clear(ctx.COLOR_BUFFER_BIT, ctx.DEPTH_BUFFER_BIT);

    //Enable depth testing and have it obscure objects further back
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.LEQUAL);

    for (object in objects) {
        //Compute new projection matrix
        const newProjectionMatrix = mat4.create();
        mat4.perspective(newProjectionMatrix, 45 * Math.PI / 180, ctx.canvas.width / ctx.canvas.height, 0.1, 100.0);

        //Compute new model view matrix
        const newModelViewMatrix = mat4.create();

        mat4.translate(newModelViewMatrix, newModelViewMatrix, [objects[object].x, objects[object].y, objects[object].z]);  //Third transform: move back from origin based on position
        mat4.rotate(newModelViewMatrix, newModelViewMatrix, objects[object].pitch, [1, 0, 0]); //Third transform: rotate around x based on object pitch
        mat4.rotate(newModelViewMatrix, newModelViewMatrix, objects[object].yaw, [0, 1, 0]);   //Second transform: rotate around y based on object yaw
        mat4.rotate(newModelViewMatrix, newModelViewMatrix, objects[object].roll, [0, 0, 1]);  //First transform: rotate around z based on object roll

        //Compute new normals matrix
        const newNormalMatrix = mat4.create();
        mat4.invert(newNormalMatrix, newModelViewMatrix);
        mat4.transpose(newNormalMatrix, newNormalMatrix);

        //Compute new world view matrix
        const newWorldViewMatrix = mat4.create();

        mat4.rotate(newWorldViewMatrix, newWorldViewMatrix, camera.pitch, [1, 0, 0]);  //Sixth transform: rotate based on camera pitch
        mat4.rotate(newWorldViewMatrix, newWorldViewMatrix, camera.yaw, [0, 1, 0]); //Fifth transform: rotate based on camera yaw
        mat4.translate(newWorldViewMatrix, newWorldViewMatrix, [camera.x * -1.0, camera.y * -1.0, camera.z * -1.0]);  //Fourth transform: move object away from camera

        //Instruct WebGL how to pull out vertices
        ctx.bindBuffer(ctx.ARRAY_BUFFER, objects[object].model.buffers.vertex);
        ctx.vertexAttribPointer(shaderProgramData.attributes.vertexPosition, 3, ctx.FLOAT, false, 0, 0);
        ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexPosition);

        //Instruct WebGL how to pull out colors
        ctx.bindBuffer(ctx.ARRAY_BUFFER, objects[object].model.buffers.color);
        ctx.vertexAttribPointer(shaderProgramData.attributes.vertexColor, 4, ctx.FLOAT, false, 0, 0);
        ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexColor);

        //Instruct WebGL how to pull out normals
        ctx.bindBuffer(ctx.ARRAY_BUFFER, objects[object].model.buffers.normal);
        ctx.vertexAttribPointer(shaderProgramData.attributes.vertexNormal, 3, ctx.FLOAT, false, 0, 0);
        ctx.enableVertexAttribArray(shaderProgramData.attributes.vertexNormal);

        //Tell WebGl to use element array
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, objects[object].model.buffers.index);

        //Tell WebGL to use the shader program
        ctx.useProgram(shaderProgramData.program);

        //Set the uniforms
        ctx.uniformMatrix4fv(shaderProgramData.uniforms.projectionMatrix, false, newProjectionMatrix);
        ctx.uniformMatrix4fv(shaderProgramData.uniforms.modelViewMatrix, false, newModelViewMatrix);
        ctx.uniformMatrix4fv(shaderProgramData.uniforms.worldViewMatrix, false, newWorldViewMatrix);
        ctx.uniformMatrix4fv(shaderProgramData.uniforms.normalMatrix, false, newNormalMatrix);

        //Draw triangles
        ctx.drawElements(ctx.TRIANGLES, objects[object].model.indexCount, ctx.UNSIGNED_SHORT, 0);

        //Update rotation for next draw
        updateObjectRotation(object, deltaT);
    }
}

//Function to update an object's rotation
function updateObjectRotation(object, deltaT) {

    objects[object].pitch += objects[object].pitchSpeed * deltaT;
    objects[object].roll += objects[object].rollSpeed * deltaT;
    objects[object].yaw += objects[object].yawSpeed * deltaT;
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

    //If pitch is greater than pi / 2, set pitch to pi / 2
    if (camera.pitch > Math.PI / 2) {
    
        camera.pitch = Math.PI / 2;
	}

    //If pitch is less than - pi / 2, set pitch to - pi / 2
    if (camera.pitch < Math.PI / -2) {
    
        camera.pitch = Math.PI / -2;
	}
}

//Function to update camera yaw based on change in X
function updateYaw(deltaX) {

    camera.yaw += deltaX * 0.005;
}

//Function to interpret keys to move camera around
function parseKeys(event) {

    //console.log(event.code);

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

    camera.x += camera.speed * Math.sin(camera.yaw);
    camera.z -= camera.speed * Math.cos(camera.yaw);
}

//Function to move backward based on camera yaw
function moveBackward() {

    camera.x -= camera.speed * Math.sin(camera.yaw);
    camera.z += camera.speed * Math.cos(camera.yaw);
}

//Function to move left based on camera yaw
function moveLeft() {

    camera.x -= camera.speed * Math.cos(camera.yaw);
    camera.z -= camera.speed * Math.sin(camera.yaw);
}

//Function to move right based on camera yaw
function moveRight() {

    camera.x += camera.speed * Math.cos(camera.yaw);
    camera.z += camera.speed * Math.sin(camera.yaw);
}

window.onload = main;