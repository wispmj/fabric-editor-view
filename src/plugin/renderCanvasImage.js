import options from './options';

export default function (canvas, options, translatex = 0, translatey = 0) {
    var currentCanvasWidth = canvas.width * 2 / canvas.getZoom();
    var currentcanvasHeight = canvas.height * 2 / canvas.getZoom();
    // 当前网格大小
    var gridSize = options.gridSize ;//* canvas.getZoom();

    // 创建画布作为 网格和背景图片
    var bgCanvas = document.createElement("canvas");
    bgCanvas.width = currentCanvasWidth;
    bgCanvas.height = currentCanvasWidth;
    var context = bgCanvas.getContext("2d");
    // context.translate(-translatex, -translatey);
    // 网格线颜色
    context.strokeStyle = options.gridColor;
    context.clearRect(0, 0, currentCanvasWidth, currentcanvasHeight);
    if (!options.grid) {
        return;
    }
    // 背景
    var offsetX = 0.25 * currentCanvasWidth - 0.25 * currentCanvasWidth % gridSize;
    var offsetY = 0.25 * currentcanvasHeight - 0.25 * currentcanvasHeight % gridSize;

    if (options.bgPic || (canvas.backgroundImage && canvas.backgroundImage.getSrc() !== null)) {
        var bgImg = new Image();
        bgImg.src = options.bgPic || canvas.backgroundImage.getSrc();
        context.drawImage(bgImg, offsetX, offsetY);
    }

    // Drawing vertical lines
    var x;
    for (x = 0; x <= currentCanvasWidth; x += gridSize) {
        context.moveTo(x + 0.5, 0);
        context.lineTo(x + 0.5, currentcanvasHeight);
    }

    // Drawing horizontal lines
    var y;
    for (y = 0; y <= currentcanvasHeight; y += gridSize) {
        context.moveTo(0, y + 0.5);
        context.lineTo(currentCanvasWidth, y + 0.5);
    }
    context.stroke();
    drawGrid2Img(bgCanvas, canvas, offsetX, offsetY)
}

// canvas to image
function drawGrid2Img(bgCanvas, canvas, offsetX, offsetY) {
    var imgStr = bgCanvas.toDataURL("image/png")
    const imgEl = document.createElement('img');
    imgEl.src = imgStr;
    imgEl.onload = () => {
        canvas.setBackgroundImage(imgEl.src, canvas.requestRenderAll.bind(canvas), {
            // left: -0.25 * currentCanvasWidth - translatex,
            // top: -0.25 * currentcanvasHeight - translatey
            left: -offsetX,
            top: -offsetY
        });
        imgEl.remove()
        bgCanvas.remove()
    }
}
