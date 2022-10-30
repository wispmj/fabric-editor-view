
import { fabric } from 'fabric';
import $ from 'jquery'

export default function (canvas) {
    // var isDrawing = false;
    // var line;
    // canvas.on('mouse:down', function (options) {
    //     if (options.button === 1) {
    //         console.log("left click");
    //     }
    //     if (options.button === 2) {
    //         isDrawing = true;
    //     }
    //     if (options.button === 3) {
    //         isDrawing = false;
    //         return;
    //     }
    //     mousedown(canvas, options);
    // })
    // function mousedown(canvas, o) {
    //     if (isDrawing) {
    //         var pointer = canvas.getPointer(o.e);
    //         var points = [pointer.x, pointer.y, pointer.x, pointer.y];

    //         line = new fabric.Line(points, {
    //             strokeWidth: 3,
    //             stroke: 'black',
    //             perPixelTargetFind:true,
    //             hasBorders:false,
    //             hasControls:false,
    //             perPixelTargetFind:true
    //         });
    //         canvas.add(line);
    //         console.log("mouse:down")
    //     }
    // }

    // canvas.on('mouse:move', function (o) {
    //     // if (isDrawing) {
    //     //     var pointer = canvas.getPointer(o.e);
    //     //     line.set({ x2: pointer.x, y2: pointer.y });
    //     //     canvas.renderAll();
    //     // }
    // });
}
