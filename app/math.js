const calculateMidPoint = function (maxX, minX, maxY, minY) {
    return {
        x: (Number(maxX) + Number(minX)) / 2,
        y: (Number(maxY) + Number(minY)) / 2
    };
};

const calculateLengthSegment = function (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
};

const calculateAngleBetweenTwoStraight = function (P0, P1, P2) {
    const delt_x1 = P1.X  - P0.X ;
    const delt_y1 = P0.Y  - P1.Y ;

    const delt_x2 = P2.X  - P0.X ;
    const delt_y2 = P0.Y  - P2.Y ;

    const angle1 = Math.atan2(delt_x1, delt_y1) * 180 / Math.PI ;
    const angle2 = Math.atan2(delt_x2, delt_y2) * 180 / Math.PI ;

    return angle2 - angle1;
};

export {calculateMidPoint, calculateLengthSegment, calculateAngleBetweenTwoStraight};