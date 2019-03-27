
window.onload = function loadFile()
{
    document.getElementById('file-input').addEventListener('change', readSingleFile, false); 
};

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    // Initialize file reader
    var reader = new FileReader();
    reader.onload = function(e) {
    // Code for the contents of the function
        var ply = e.target.result;
        var vCount = ply.indexOf("vertex") + 7;
        var vNum = ply.substring(vCount, vCount + 5);
        vNum = parseInt(vNum, 10);
        var fCount = ply.indexOf("face") + 5;
        var fNum = ply.substring(fCount, fCount + 5);
        fNum = parseInt(fNum, 10);

        // getting vertex and face coordinates
        var tempIndex = ply.indexOf("end_header");
        tempIndex = tempIndex + 12;
        var bigString = ply.substring(tempIndex, ply.length-1);

        var vfString = bigString.split("\n");
        var vArray = vfString.slice(0, vNum);
        var fArray = vfString.slice(vNum, vfString.length);

        //putting vertex coordinates into final array
        vtempArray = [];
        for (i=0; i <vArray.length; ++i){
            vtempArray.push(vArray[i].split(" "));
        }
        var vertices = [];
        for (i=0; i < vtempArray.length; ++i){
            for (j=0; j < vtempArray[i].length; ++j){
                vertices.push(parseFloat(vtempArray[i][j]));
            }
        }
        var vtempArray = [];
        for (i=0; i<vertices.length; i += 6){
            var v = vertices.slice(i, i + 3);
            vtempArray.push(v);
        }
        vertices = [];
        vertices = vtempArray;
        
        //putting face coordinates into the final array
        var ftempArray = [];
        for (i=0; i<fArray.length; ++i){
            ftempArray.push(fArray[i].split(" "));
        }
        var indices = [];
        for (i=0; i < ftempArray.length; ++i){
            for (j=0; j < ftempArray[i].length; ++j){
                indices.push(parseInt(ftempArray[i][j]));
            }
        }
        ftempArray = [];
        for (i=0; i<indices.length; i += 5){
            var f = indices.slice(i+1, i+4);
            ftempArray.push(f);
        }   
        indices = [];
        indices = ftempArray;

        draw(vertices, indices);
    };
    reader.readAsText(file);
  }

function draw(vert, faces){
    var canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    var extension = gl.getExtension('OES_element_index_uint');
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
    
    //  Load shaders and initialize attribute buffers
    
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    // Load the data into the GPU

    gl.bindBuffer( gl.ARRAY_BUFFER, gl.createBuffer() );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vert), gl.STATIC_DRAW );
    console.log("num of vertices written:" + vert.length);
    console.log(vert);
    
    // Associate out shader variables with our data buffer
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    faces[9]=vec3(4,7,3);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(faces), gl.STATIC_DRAW);
    render(faces); 
}

function render(face) {
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    gl.drawElements( gl.POINTS, face.length, gl.UNSIGNED_INT, 0 );
    
}