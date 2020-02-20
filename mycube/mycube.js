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

const vertexShaderCode = `

  attribute vec4 a_vertexPosition;

  uniform vec4 u_modelViewMatrix;
  uniform vec4 u_projectionMatrix;
  
  void main(void) {

    gl_Position = u_projectionMatrix * u_modelViewMatrix * a_vertexPosition;
  }
`;

const fragmentShaderCode = `

  void main(void) {

    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

//
// Start here
//
function main() {

  //Get canvas object
  const canvas = document.getElementById("canvas");

  //Get webgl context
  const ctx = canvas.getContext("webgl");

  //If webgl context was not loaded, error and return
  if (!ctx) {

    alert("WebGL was not initialized. It may not be supported by this browser.");
    return;
  }

  //Expand canvas to fit window
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;

  //Clear the canvas
  ctx.clearColor(0.0, 0.0, 0.0, 1.0);
  ctx.clearDepth(1.0);
  ctx.clear(ctx.COLOR_BUFFER_BIT, ctx.DEPTH_BUFFER_BIT);

  //Create the shader program
  const shaderProgram = createShaderProgram(ctx);

  //Now that the shader has been created, pull out data locations
  const shaderProgramData = {

    program: shaderProgram,
    attributes: {

      vertexPosition: ctx.getAttribLocation(shaderProgram, "a_vertexPosition"),
    },

    uniforms: {

      modelViewMatrix: ctx.getUniformLocation(shaderProgram, "u_modelViewMatrix"),
      projectionMatrix: ctx.getUniformLocation(shaderProgram, "u_projectionMatrix"),
    },
  };
}

//Function to create the shader program
function createShaderProgram(ctx) {

  //Compile the shaders
  const vertexShader = compileShader(ctx, ctx.VERTEX_SHADER, vertexShaderCode);
  const fragmentShader = compileShader(ctx, ctx.FRAGMENT_SHADER, fragmentShaderCode);

  //Create pointer to a new shader program
  const newShaderProgram = ctx.createProgram();

  //Attach the shaders
  ctx.attachShader(newShaderProgram, vertexShader);
  ctx.attachShader(newShaderProgram, fragmentShader);

  //Link the program
  ctx.linkProgram(newShaderProgram);

  //If program failed to create, print error to console and exit program
  if (!ctx.getProgramParameter(newShaderProgram, ctx.LINK_STATUS)) {

    console.error("Error creating shader program: " + ctx.getProgramInfoLog(newShaderProgram));
    return null;
  }

  return newShaderProgram;
}

//Function to compile a shader
function compileShader(ctx, type, code) {

  //Create pointer to a new shader
  const newShader = ctx.createShader(type);
  
  //attach source code
  ctx.shaderSource(newShader, code);

  //Compile the shader
  ctx.compileShader(newShader);

  //If there was an error compiling the shader, print error to console and exit program
  if (!ctx.getShaderParameter(newShader, ctx.COMPILE_STATUS)) {

    console.error("Unable to compile a shader: " + ctx.getShaderInfoLog(newShader));
    ctx.deleteShader(newShader);
    return null;
  }

  return newShader;
}

//Function to initialize buffers
function initBuffers(ctx) {

  const vertices = [

    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

  ];

  //Create pointer to a new buffer
  
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