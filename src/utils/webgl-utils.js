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
    alert(
      "Unable to initialize the shader program: " +
        gl.getProgramInfoLog(program)
    );
    return null;
  }
  // 返回程序program对象
  return program;
}
// 创建着色器方法，输入参数：渲染上下文，着色器类型，数据源
export function loadShader(gl, type, source) {
  const shader = gl.createShader(type); // 创建着色器对象
  gl.shaderSource(shader, source); // 提供数据源
  gl.compileShader(shader); // 编译 -> 生成着色器
  // 编译失败的处理方法
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      "An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
// 创建缓冲区
export function initBuffers(dataArr) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataArr), gl.SRATIC_DRAW);
  return buffer;
}
//
export function drawScene(gl, config) {
  const primitiveType = config.primitiveType || gl.TRIANGLES;
  const offset = config.offset || 0;
  const count = config.count || 3;
  gl.drawArrays(primitiveType, offset, count);
}
// 清空画布
export function clearDraw(gl) {
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}
// 随机参数 range 范围内的整数
export function randomInt(range = 800) {
  return Math.floor(Math.random() * range);
}

// 求平面中一点绕任意点旋转 θ 度后的坐标点
export function getRotatedPosition(point, angle, origin = { x: 0, y: 0 }, arrayFlag = false) {
  if (!point) return { x: 0, y: 0 };
  const radian = convert2radian(angle);
  const pointX = parseFloat(point.x);
  const pointY = parseFloat(point.y);
  const originX = parseFloat(origin.x);
  const originY = parseFloat(origin.y);
  const x =
    (pointX - originX) * Math.cos(radian) -
    (pointY - originY) * Math.sin(radian) +
    originX;
  const y =
    (pointX - originX) * Math.sin(radian) +
    (pointY - originY) * Math.cos(radian) +
    originY;
  return arrayFlag ? [x, y] : { x, y };
}
// 角度转弧度
export function convert2radian(angle) {
  return parseFloat(angle) * Math.PI / 180;
}
// 大于最大取最大， 小于最小取最小
export function getAvailableVal(val, min = 0, max = 100,) {
  return Math.max(min, Math.min(val, max));
}
// 用参数生成矩形顶点并写进缓冲
export function setRectAngle(gl, x, y, width, height) {
  const x2 = x + width;
  const y2 = y + height;
  /**
   * 注意：gl.bufferData(gl.ARRAY_BUFFER, ...) 将会影响到
   * 当前绑定点 ‘ARRAY_BUFFER’ 的绑定缓冲
   * 目前我们只有一个缓冲，如果我们又多个缓冲
   * 我们需要先将所需缓冲绑定到 ‘ARRAY_BUFFER’
   * */
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([x, y, x2, y, x, y2, x, y2, x2, y2, x2, y]),
    gl.STATIC_DRAW
  );
}

// 绘制f
export function drawF(gl, config) {
  const startPoint = config.point || {
    x: 0,
    y: 0,
  };
  const { x, y } = startPoint;
  const width = config.width || 1;
  const height = config.height || 1;
  const dataArr = getFArray(x, y, width, height);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(dataArr), gl.STATIC_DRAW);
}

export function getFArray(x = 0, y = 0, width = 1, height = 2) {
  const thicknessW = width / 4;
  const thicknessH = height / 6;
  return [
    x,
    y,
    x,
    y + height,
    x + thicknessW,
    y + height,

    x,
    y,
    x + thicknessW,
    y,
    x + thicknessW,
    y + height,

    x + thicknessW,
    y,
    x + width,
    y,
    x + thicknessW,
    y + thicknessH,

    x + thicknessW,
    y + thicknessH,
    x + width,
    y + thicknessH,
    x + width,
    y,

    x + thicknessW,
    y + 3.5 * thicknessH,
    x + 2.5 * thicknessW,
    y + 3.5 * thicknessH,
    x + thicknessW,
    y + 2.5 * thicknessH,

    x + thicknessW,
    y + 2.5 * thicknessH,
    x + 2.5 * thicknessW,
    y + 2.5 * thicknessH,
    x + 2.5 * thicknessW,
    y + 3.5 * thicknessH,
  ];
}
