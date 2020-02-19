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