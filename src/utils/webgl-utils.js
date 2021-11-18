
// 声明初始化着色器函数
export function initShader(gl, vertexShaderSource, fragShaderSource) {
  // 创建顶点着色器对象
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  // 创建片元着色器对象
  const fragShader = loadShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
  // 创建程序对象
  const program = gl.createProgram();
  // 附着顶点着色器和片元着色器到program
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragShader);
  // 链接program
  gl.linkProgram(program);

  // 创建失败， alert
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }
  // 返回程序program对象
  return program;
}
//
export function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
//
export function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const vertices = [
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.SRATIC_DRAW);
  return {
    position: positionBuffer,
  }
}
