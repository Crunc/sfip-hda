/**
 * Generates 2 normally distributed random numbers.
 *
 * @return {Array}
 *          An array of length 2, containing the generated random numbers.
 */
window.box_muller = function () {
    var x = 0, y = 0, rds, c;

    // Get two random numbers from -1 to 1.
    // If the radius is zero or greater than 1, throw them out and pick two new ones
    // Rejection sampling throws away about 20% of the pairs.
    do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        rds = x * x + y * y;
    }
    while (rds == 0 || rds > 1);

    // This magic is the Box-Muller Transform
    c = Math.sqrt(-2 * Math.log(rds) / rds);

    // It always creates a pair of numbers. I'll return them in an array.
    // This function is quite efficient so don't be afraid to throw one away if you don't need both.
    return [x * c, y * c];
};

/**
 *
 * @param {number} num
 *          The number of random numbers that are generated.
 * @param {number} mean
 *          The mean of the normally distributed random numbers.
 * @param {number} sd
 *          The standard deviation of the normally distributed random numbers.
 * @return {Array}
 *          An array containing the generated random numbers.
 */
window.normally_distributed_random_numbers = function (num, mean, sd, min, max) {
    var iterations = (num + (num % 2)) / 2;
    var buf = [];

    var bufMin = Number.MAX_VALUE;
    var bufMax = Number.MIN_VALUE;

    var add2Buf = function (bm) {
        var bmScaled = bm * sd + mean;
        bufMin = Math.min(bufMin, bmScaled);
        bufMax = Math.max(bufMax, bmScaled);
        buf.push(bmScaled);
    };

    for (var i = 0; i < iterations; ++i) {
        var bm = box_muller();
        add2Buf(bm[0]);
        if (buf.length < num) {
            add2Buf(bm[1]);
        }
    }
//    for (var i = 0; i < buf.length; ++i) {
//        buf[i] = iv2iv(buf[i], bufMin, bufMax, min, max);
//    }

    return buf;
};

window.iv2iv = function (src, srcMin, srcMax, dstMin, dstMax) {
    var grad = (dstMax - dstMin) / (srcMax - srcMin);
    return ((grad * src) + dstMax) - (grad * srcMax);
};


