
import { Computed } from '../interface';
import { getAngle, getVLength, getDirection } from '../vector';
import { propX, propY } from '../const';
import intervalCompute from './intervalCompute';
import computeDistance from './computeDistance';

let maxLength: number = 0;
export default function ({
    status,
    startInput,
    prevInput,
    input
}: any): any {
    // 如果输入为空, 那么就计算了, 鼠标模式下, 点击了非元素部分, mouseup阶段会初选input为undefined
    if (undefined === input) return;
    const length = input.pointers.length;
    const { abs, max } = Math;

    let computed: any = {
        // 起始到结束的偏移
        displacementX: 0,
        displacementY: 0,
        distanceX: 0,
        distanceY: 0,
        distance: 0,

        // 位移变化量
        deltaX: 0,
        deltaY: 0,
        absDeltaX: 0,
        absDeltaY: 0,

        //  速率
        velocityX: 0,
        velocityY: 0,

        // 时间
        duration: 0,

        // 旋转和缩放
        angle: 0,
        scale: 1,
        lastVelocityY: undefined,
        lastVelocityX: undefined
    };

    // 滑动距离
    const { displacementX, displacementY, distanceX, distanceY, distance } = computeDistance({
        status,
        startInput,
        input
    });
    computed = { ...computed, displacementX, displacementY, distanceX, distanceY, distance };
    // 已消耗时间
    computed.duration = input.timestamp - startInput.timestamp;

    // 最近25ms内速度
    // console.log(input.status);
    const intervalComputed = intervalCompute(input);
    computed.lastVelocityX = intervalComputed.velocityX;
    computed.lastVelocityY = intervalComputed.velocityY;

    // ================== 单点 ==================
    if (1 === length) {
        if (undefined !== prevInput && 2 > prevInput.pointers.length) {
            // 位移增量
            computed.deltaX = input.centerX - prevInput.centerX;
            computed.deltaY = input.centerY - prevInput.centerY;
            // 时间增量
            computed.deltaTime = input.timestamp - prevInput.timestamp;
        }

        // 速率
        computed.velocityX = abs(computed.distanceX / computed.duration);
        computed.velocityY = abs(computed.distanceY / computed.duration);
        computed.maxVelocity = max(computed.velocityX, computed.velocityY);

        // 计算方向
        computed.direction = getDirection(computed.deltaX, computed.deltaY);
    }
    // ================== 多点 ==================
    else if (undefined !== prevInput && 1 < prevInput.pointers.length && 1 < input.pointers.length) {
        const v0 = {
            x: prevInput.pointers[1][propX] - prevInput.pointers[0][propX],
            y: prevInput.pointers[1][propY] - prevInput.pointers[0][propY]
        };

        const v1 = {
            x: input.pointers[1][propX] - input.pointers[0][propX],
            y: input.pointers[1][propY] - input.pointers[0][propY]
        };

        // 缩放增量
        computed.scale = getVLength(v1) / getVLength(v0);

        // 角度增量
        computed.angle = getAngle(v1, v0);
    }


    maxLength = max(maxLength, length);
    if('start' === status) {
        maxLength = length;
    } else if('end' === status) {
        maxLength = Math.max(1, length);
    }


    return {
        ...input,
        length,
        maxLength,
        ...computed
    };
};