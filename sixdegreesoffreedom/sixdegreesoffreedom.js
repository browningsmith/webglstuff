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

    //Normal vectors representing right, left, and forward for the camera.
    //Camera is initialized facing negative Z
    rightVec: vec3.fromValues(1.0, 0.0, 0.0),
    upVec: vec3.fromValues(0.0, 1.0, 0.0),
    forwardVec: vec3.fromValues(0.0, 0.0, -1.0),

    //Camera rotation matrix, needs to be recomputed on each roll, pitch, or yaw update
    rotationMatrix: mat4.create(),

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
    ctx.clearColor(0.0, 0.0, 0.0, 1.0); //set clear color to black
    ctx.clearDepth(1.0); //set clear depth to 1.0
    ctx.clear(ctx.COLOR_BUFFER_BIT, ctx.DEPTH_BUFFER_BIT);

    //Enable depth testing and have it obscure objects further back
    ctx.enable(ctx.DEPTH_TEST);
    ctx.depthFunc(ctx.LEQUAL);

    //Compute new projection matrix
    const newProjectionMatrix = mat4.create();
    mat4.perspective(newProjectionMatrix, 45 * Math.PI / 180, ctx.canvas.width / ctx.canvas.height, 0.1, 1000.0);

    //Compute worldViewMatrix based on opposite coordinates of camera position and camera rotation
    const newWorldViewMatrix = mat4.clone(camera.rotationMatrix);
    mat4.translate(newWorldViewMatrix, newWorldViewMatrix, [camera.x * -1.0, camera.y * -1.0, camera.z * -1.0]); //Second transform, move objects away from camera

    for (object in objects) {

        //Compute new model view matrix
        const newModelViewMatrix = mat4.create();

        mat4.translate(newModelViewMatrix, newModelViewMatrix, [objects[object].x, objects[object].y, objects[object].z]);  //Fourth transform: move back from origin based on position
        mat4.rotate(newModelViewMatrix, newModelViewMatrix, objects[object].pitch, [1, 0, 0]); //Third transform: rotate around x based on object pitch
        mat4.rotate(newModelViewMatrix, newModelViewMatrix, objects[object].yaw, [0, 1, 0]);   //Second transform: rotate around y based on object yaw
        mat4.rotate(newModelViewMatrix, newModelViewMatrix, objects[object].roll, [0, 0, 1]);  //First transform: rotate around z based on object roll

        //Compute new normals matrix
        const newNormalMatrix = mat4.create();
        mat4.invert(newNormalMatrix, newModelViewMatrix);
        mat4.transpose(newNormalMatrix, newNormalMatrix);

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

    console.log("deltaX: " + deltaX + " deltaY: " + deltaY);

    //Yaw and pitch based on change in x and y
    pitchUp(deltaY * -0.01);
    yawRight(deltaX * -0.01);
}

//Function to reset inwindow flag for mouse if mouse leaves
function mouseLeave(event) {

    lastMousePosition.inWindow = false;
}

//Function to interpret keys to move camera around
function parseKeys(event) {

    console.log(event.code);

    if (event.code == "KeyW") { //Forward
    
        moveForward(camera.speed);
	}
    else if (event.code == "KeyS") { //Backward
    
        moveForward(camera.speed * -1.0);
	}
    else if (event.code == "KeyA") { //Left
    
        moveRight(camera.speed * -1.0);
	}
    else if (event.code == "KeyD") { //Right
    
        moveRight(camera.speed);
	}
    else if (event.code == "Space") { //Right
    
        moveUp(camera.speed);
	}
    else if (event.code == "ShiftLeft") { //Right
    
        moveUp(camera.speed * -1.0);
    }
    else if (event.code == "KeyQ") { //Right
    
        rollRight(-0.05);
    }
    else if (event.code == "KeyE") { //Right
    
        rollRight(0.05);
    }
}

//Function to roll the camera around it's local z vector
function rollRight(angle) {

    //Create a quaternion representing rotation around forwardVec by negative angle
    const rollQuat = quat.create();
    quat.setAxisAngle(rollQuat, camera.forwardVec, angle * -1.0);

    //Create a new rotation matrix with roll quaternion and no translation
    const rollMatrix = mat4.create();
    mat4.fromRotationTranslation(rollMatrix, rollQuat, [0.0, 0.0, 0.0]);

    //Apply this matrix to the camera's view matrix
    mat4.multiply(camera.rotationMatrix, camera.rotationMatrix, rollMatrix);

    //Now set the quaternion using the positive angle
    quat.setAxisAngle(rollQuat, camera.forwardVec, angle);

    //Apply this rotation to camera's rightVec and upVec
    vec3.transformQuat(camera.rightVec, camera.rightVec, rollQuat);
    vec3.transformQuat(camera.upVec, camera.upVec, rollQuat);
}

//Function to pitch the camera around it's local x vector
function pitchUp(angle) {

    //Create a quaternion representing rotation around rightVec by negative angle
    const pitchQuat = quat.create();
    quat.setAxisAngle(pitchQuat, camera.rightVec, angle * -1.0);

    //Create a new rotation matrix with roll quaternion and no translation
    const pitchMatrix = mat4.create();
    mat4.fromRotationTranslation(pitchMatrix, pitchQuat, [0.0, 0.0, 0.0]);

    //Apply this matrix to the camera's view matrix
    mat4.multiply(camera.rotationMatrix, camera.rotationMatrix, pitchMatrix);

    //Now set the quaternion using the positive angle
    quat.setAxisAngle(pitchQuat, camera.rightVec, angle);

    //Apply this rotation to camera's upVec and forwardVec
    vec3.transformQuat(camera.upVec, camera.upVec, pitchQuat);
    vec3.transformQuat(camera.forwardVec, camera.forwardVec, pitchQuat);
}

//Function to yaw the camera around it's local y vector
function yawRight(angle) {

    //Create a quaternion representing rotation around upVec by negative angle
    const yawQuat = quat.create();
    quat.setAxisAngle(yawQuat, camera.upVec, angle * -1.0);

    //Create a new rotation matrix with roll quaternion and no translation
    const yawMatrix = mat4.create();
    mat4.fromRotationTranslation(yawMatrix, yawQuat, [0.0, 0.0, 0.0]);

    //Apply this matrix to the camera's view matrix
    mat4.multiply(camera.rotationMatrix, camera.rotationMatrix, yawMatrix);

    //Now set the quaternion using the positive angle
    quat.setAxisAngle(yawQuat, camera.upVec, angle);

    //Apply this rotation to camera's rightVec and forwardVec
    vec3.transformQuat(camera.rightVec, camera.rightVec, yawQuat);
    vec3.transformQuat(camera.forwardVec, camera.forwardVec, yawQuat);
}

//Function to move forward based on camera directional vectors
function moveForward(speed) {

    camera.x += camera.forwardVec[0] * speed;
    camera.y += camera.forwardVec[1] * speed;
    camera.z += camera.forwardVec[2] * speed;
}

//Function to move right based on camera directional vectors
function moveRight(speed) {

    camera.x += camera.rightVec[0] * speed;
    camera.y += camera.rightVec[1] * speed;
    camera.z += camera.rightVec[2] * speed;
}

//Function to move up based on camera directional vectors
function moveUp(speed) {

    camera.x += camera.upVec[0] * speed;
    camera.y += camera.upVec[1] * speed;
    camera.z += camera.upVec[2] * speed;
}

window.onload = main;