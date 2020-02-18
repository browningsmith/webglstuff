//Main function to be loaded on window.load

const cubeVertices = [
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
  ];

const faceColors = [

    //Front face: white
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,
    1.0, 1.0, 1.0, 1.0,

    //Back face: red
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,
    1.0, 0.0, 0.0, 1.0,

    //Top face: green
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,
    0.0, 1.0, 0.0, 1.0,

    //Bottom face: blue
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,
    0.0, 0.0, 1.0, 1.0,

    //Right face: yellow
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,

    //Left face: purple
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
    1.0, 0.0, 1.0, 1.0,
];

//Enumerate vertices of cube to form 12 triangles. Each face is constructed out of 2 triangles
const cubeIndices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
];

//Vertex Shader code
const vertexShaderCode = `

    attribute vec4 a_vertexPosition; //Position of vertex
    attribute vec4 a_vertexColor; //Color of vertex

    uniform mat4 u_modelViewMatrix; //Model View transformation matrix
    uniform mat4 u_projectionMatrix; //Projection transformation matrix

    varying lowp vec4 v_currentColor; //Color of current vertex to be used by fragment shader

    void main(void) {

        gl_Position = u_projectionMatrix * u_modelViewMatrix * a_vertexPosition; //Compute vertex position relative to camera
        v_currentColor = a_vertexColor; //set v_currentColor to a_vertexColor, to be passed to fragment shader
    }
`;

const fragmentShaderCode =`

    varying lowp vec4 v_currentColor;

    void main(void) {

        gl_FragColor = v_currentColor; //Get color to be used for interpolation
    }
`;

function main() {

    //Get the canvas object
    const canvas = document.getElementById("canvas");

    //Get the canvas context
    const context = canvas.getContext("webgl");

    //If unable to initialize webGL, alert user and exit
    if (context === null) {

        alert("Unable to initialize WebGL. It may not be supported by this browser.");
        return;
    }

    //Create shaders
    const vertexShader = compileShader(context, context.VERTEX_SHADER, vertexShaderCode);
    const fragmentShader = compileShader(context, context.FRAGMENT_SHADER, fragmentShaderCode);

    //Create shader program
    const shaderProgram = context.createProgram();

    //attach shaders to program
    context.attachShader(shaderProgram, vertexShader);
    context.attachShader(shaderProgram, fragmentShader);

    //Link shaders to complete shader program
    context.linkProgram(shaderProgram);

    //If unable to create shader program, alert user and exit
    if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {

        console.error("Error creating full shader program: " + context.getProgramInfoLog(shaderProgram));
        return;
    }

    render(context);
}

//Function to compile a new shader. Takes context, type of shader, and shader source code.
//Returns pointer to a new compiled shader
//Returns null if error is encountered, deletes shader and prints error message to console
function compileShader(context, type, code) {

    const newShader = context.createShader(type); //Create a new shader

    context.shaderSource(newShader, code); //Pass in the shader code

    context.compileShader(newShader); //Compile the shader

    if (!context.getShaderParameter(newShader, context.COMPILE_STATUS)) {

        console.error("Error compiling a shader: " + context.getShaderInfoLog(newShader));
        context.deleteShader(newShader);
        return null;
    }

    return newShader;
}

//Function to render the scene
function render(context) {

    context.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    context.clearDepth(1.0);                 // Clear everything
    context.enable(context.DEPTH_TEST);           // Enable depth testing
    context.depthFunc(context.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);
}

window.onload = main;