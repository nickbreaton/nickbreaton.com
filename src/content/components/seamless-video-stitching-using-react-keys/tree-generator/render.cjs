const fs = require("fs");
const path = require("path");
const { frame, CLIP_SECONDS } = require("./anim.cjs");

const S = Number(process.argv[2] || 192);
const FPS = Number(process.argv[3] || 60);
const OUT = process.argv[4] || path.join(__dirname, "out");

const names = ["winter", "spring", "summer", "fall"];

fs.mkdirSync(OUT, { recursive: true });
for (let k = 0; k < 4; k++) {
	const fd = fs.openSync(path.join(OUT, `${names[k]}.raw`), "w");
	const N = Math.round(CLIP_SECONDS[k] * FPS);
		for (let f = 0; f <= N; f++) fs.writeSync(fd, frame(S, k + f / N));
	fs.closeSync(fd);
	console.log(names[k], N + 1, "frames");
}

const a = frame(S, 4), b = frame(S, 0);
let diff = 0;
for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
console.log("loop seam (fall end vs winter start) differing bytes:", diff);
