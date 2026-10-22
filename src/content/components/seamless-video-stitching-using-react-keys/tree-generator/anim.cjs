const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function h2(x, y) {
	let h = (x * 374761393 + y * 668265263) | 0;
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function vnoise(x, y) {
	const x0 = Math.floor(x), y0 = Math.floor(y);
	const tx = x - x0, ty = y - y0;
	const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
	const a = h2(x0, y0), b = h2(x0 + 1, y0), c = h2(x0, y0 + 1), d = h2(x0 + 1, y0 + 1);
	return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
}

const fbm = (x, y) => 0.6 * vnoise(x, y) + 0.3 * vnoise(x * 2.1 + 7, y * 2.1 + 3) + 0.1 * vnoise(x * 4.3 + 1, y * 4.3 + 9);

function rng(seed) {
	return () => {
		seed |= 0;
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (v) => { const t = clamp(v); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

const rgb = (hex) => { const n = parseInt(hex.slice(1, 7), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };

function ramp(colors, v, px, py) {
	const f = clamp(v, 0, 0.9999) * (colors.length - 1);
	const i = Math.floor(f);
	return colors[Math.min(colors.length - 1, f - i > BAYER[(py & 3) * 4 + (px & 3)] ? i + 1 : i)];
}

const BARK = ["#1c1917", "#292524", "#44403b", "#57534d", "#79716b", "#a6a09b"].map(rgb);
const SNOW = rgb("#e2e8f0"), SNOW_SHADE = rgb("#90a1b9"), SNOW_SOFT = rgb("#cad5e2"), FLAKE = rgb("#90a1b9");
const BUD = ["#5ea500", "#9ae600", "#bbf451"].map(rgb);
const BLOSSOM = ["#fccee8", "#fda5d5", "#fb64b6"].map(rgb);

const PALETTES = {
	spring: {
		layers: [["#016630", "#008236", "#00a63e", "#5ea500"], ["#008236", "#00a63e", "#5ea500", "#7ccf00", "#9ae600"], ["#5ea500", "#7ccf00", "#9ae600", "#bbf451", "#d8f999"]],
		rim: "#ecfcca",
	},
	summer: {
		layers: [["#002c22", "#004f3b", "#005f46", "#007a55", "#009966"], ["#0d542b", "#016630", "#008236", "#00a63e", "#00c950"], ["#016630", "#008236", "#00a63e", "#00c950", "#7ccf00", "#9ae600"]],
		rim: "#bbf451",
	},
	fall: {
		layers: [["#460809", "#82181a", "#9f0712", "#c10007"], ["#9f0712", "#c10007", "#ca3500", "#f54900", "#ff6900"], ["#ca3500", "#f54900", "#ff6900", "#fe9a00", "#ffb900", "#ffd230"]],
		rim: "#fee685",
	},
};
for (const p of Object.values(PALETTES)) { p.layers = p.layers.map((l) => l.map(rgb)); p.rim = rgb(p.rim); }
const FALL_LEAF = ["#ff6900", "#fe9a00", "#c10007", "#f54900"].map(rgb);

const CLUMPS = [
	...[[0.35, 0.43, 0.17], [0.65, 0.41, 0.17], [0.5, 0.22, 0.18], [0.29, 0.3, 0.13], [0.71, 0.28, 0.13]].map((c) => [...c, 0]),
	...[[0.41, 0.35, 0.16], [0.59, 0.33, 0.16], [0.5, 0.45, 0.17], [0.35, 0.5, 0.12], [0.66, 0.5, 0.12]].map((c) => [...c, 1]),
	...[[0.45, 0.25, 0.12], [0.6, 0.23, 0.11], [0.52, 0.53, 0.12], [0.39, 0.44, 0.1], [0.67, 0.42, 0.1]].map((c) => [...c, 2]),
].map((c, i) => [...c, h2(i, 77)]);

const LIGHT = (() => { const v = [-0.55, -0.7, 0.45]; const l = Math.hypot(...v); return v.map((c) => c / l); })();

const { SEGS, TIPS } = (() => {
	const segs = [[0.5, 0.86, 0.5, 0.55, 0.042, 0.032, true]];
	const tips = [];
	const r = rng(21);
	const grow = (x, y, ang, len, w, depth) => {
		const ex = x + Math.sin(ang) * len, ey = y - Math.cos(ang) * len;
		segs.push([x, y, ex, ey, w, w * 0.72]);
		if (depth === 0) { tips.push([ex, ey], [lerp(x, ex, 0.55), lerp(y, ey, 0.55)]); return; }
		const spread = 0.38 + r() * 0.2;
		const kids = depth > 1 && r() < 0.35 ? 3 : 2;
		for (let k = 0; k < kids; k++) {
			const a = ang + (kids === 2 ? (k ? spread : -spread) : (k - 1) * spread) + (r() - 0.5) * 0.25;
			grow(ex, ey, a, len * (0.7 + r() * 0.12), w * 0.66, depth - 1);
		}
	};
	grow(0.5, 0.56, -0.62, 0.13, 0.022, 3);
	grow(0.5, 0.56, 0.02, 0.14, 0.024, 3);
	grow(0.5, 0.56, 0.66, 0.13, 0.022, 3);
	segs.push([0.47, 0.845, 0.37, 0.868, 0.02, 0.006], [0.53, 0.845, 0.635, 0.868, 0.02, 0.006], [0.49, 0.855, 0.44, 0.874, 0.016, 0.005], [0.51, 0.855, 0.57, 0.874, 0.016, 0.005]);
	return { SEGS: segs, TIPS: tips };
})();

const DROP = 0.04;
const GROUND = 0.866;
const CLIP_SECONDS = [2.2, 2.8, 1.9, 3.2];

function canopyPoint(r) {
	const c = CLUMPS[5 + Math.floor(r() * 10)];
	const a = r() * Math.PI * 2, d = Math.sqrt(r()) * c[2] * 0.85;
	return [c[0] + Math.cos(a) * d, c[1] + Math.sin(a) * d];
}

const PARTICLES = (() => {
	const r = rng(99);
	const list = [];
	for (let i = 0; i < 30; i++) list.push({ kind: "flake", season: 0, born: 0.02 + r() * 0.2, life: 0.3, x: 0.08 + r() * 0.84, y: -0.02 + r() * 0.3, vy: 0.14 + r() * 0.08, sway: r() * 6 });
	for (let i = 0; i < 26 * 4; i++) r();
	for (let i = 0; i < 18; i++) { const [x, y] = canopyPoint(r); list.push({ kind: "petal", season: 2, born: 0.03 + r() * 0.45, life: 0.5, x, y, vy: 0.09 + r() * 0.05, sway: r() * 6, c: BLOSSOM[Math.floor(r() * 3)] }); }
	for (let i = 0; i < 56; i++) { const [x, y] = canopyPoint(r); list.push({ kind: "leaf", season: 3, born: 0.3 + r() * 0.5, life: 0.6, x, y, vy: 0.2 + r() * 0.14, sway: r() * 6, c: FALL_LEAF[Math.floor(r() * FALL_LEAF.length)] }); }
	return list;
})();

function stateAt(tau) {
	const k = Math.min(3, Math.floor(tau)), p = tau - k;
	const env = Math.sin(Math.PI * p) ** 2;
	const sec = p * CLIP_SECONDS[k];
	const breeze = (amp) => amp * env * (Math.sin(sec * 2 * Math.PI * 0.9) * 0.8 + Math.sin(sec * 2 * Math.PI * 1.7 + 1) * 0.2);
	const s = { k, p, D: -1, from: "spring", to: "spring", mix: 0, mixMode: "pixel", blossom: 0, buds: 0, snow: 0, melt: 0, shadow: 0.3, sway: 0 };
	if (k === 0) {
		s.snow = ease(p / 0.3);
		s.melt = clamp((p - 0.34) / 0.62);
		s.sway = breeze(0.004);
	} else if (k === 1) {
		s.buds = ease(p / 0.3) * (1 - ease((p - 0.55) / 0.35));
		s.D = lerp(-0.12, 0.5, ease((p - 0.18) / 0.82));
		s.blossom = ease((p - 0.45) / 0.5);
		s.shadow = lerp(0.3, 0.65, ease(p));
		s.sway = breeze(0.006);
	} else if (k === 2) {
		s.D = lerp(0.5, 1, ease(p / 0.6));
		s.from = "spring"; s.to = "summer"; s.mix = ease(p / 0.7);
		s.blossom = 1 - ease(p / 0.4);
		s.shadow = lerp(0.65, 1, ease(p / 0.6));
		s.sway = breeze(0.012);
	} else {
		s.from = "summer"; s.to = "fall"; s.mix = ease(p / 0.45); s.mixMode = "clump";
		const q = ease((p - 0.3) / 0.64);
		s.D = q < 0.9 ? lerp(0.82, 0.12, q / 0.9) : lerp(0.12, -0.3, (q - 0.9) / 0.1);
		s.shadow = lerp(1, 0.3, q);
		s.sway = breeze(0.009);
	}
	return s;
}

function frame(S, tau) {
	const st = stateAt(tau);
	const out = new Uint8Array(S * S * 4);
	const put = (px, py, c, a = 255) => {
		if (px < 0 || py < 0 || px >= S || py >= S) return;
		const i = (py * S + px) * 4;
		out[i] = c[0]; out[i + 1] = c[1]; out[i + 2] = c[2]; out[i + 3] = a;
	};
	const has = (px, py) => px >= 0 && py >= 0 && px < S && py < S && out[(py * S + px) * 4 + 3] === 255;
	const PX = (px) => (px + 0.5) / S;
	const PY = (py) => (py + 0.5) / S - DROP;
	const bend = (y) => st.sway * clamp((0.84 - y) / 0.6) ** 1.6;

	const sf = st.shadow;
	const black = [0, 0, 0];
	for (let py = Math.floor((0.82 + DROP) * S); py < Math.min(S, Math.ceil((0.91 + DROP) * S)); py++)
		for (let px = 0; px < S; px++) {
			const x = PX(px), y = PY(py);
			const rx = 0.1 + 0.22 * sf, ry = 0.02 + 0.016 * sf;
			const d = Math.hypot((x - (0.5 + 0.05 * sf)) / rx, (y - 0.864) / ry) + (fbm(x * 30, y * 30) - 0.5) * 0.25;
			const base = Math.hypot((x - 0.505) / 0.13, (y - 0.866) / 0.013);
			if (base < 1) put(px, py, black, 0x2e);
			else if (d < 1 && (d < 0.7 || (1 - d) / 0.3 > BAYER[(py & 3) * 4 + (px & 3)])) put(px, py, black, 0x1a);
		}

	const cover = clamp((st.D + 0.1) / 0.9);
	const bark = new Uint8Array(S * S);
	const minW = 0.55 / S;
	for (const [x0, y0, x1, y1, w0, w1, flare] of SEGS) {
		const pad = Math.max(w0, w1) + 0.06;
		const bx0 = Math.max(0, Math.floor((Math.min(x0, x1) - pad) * S)), bx1 = Math.min(S - 1, Math.ceil((Math.max(x0, x1) + pad) * S));
		const by0 = Math.max(0, Math.floor((Math.min(y0, y1) - pad + DROP) * S)), by1 = Math.min(S - 1, Math.ceil((Math.max(y0, y1) + pad + DROP) * S));
		const dx = x1 - x0, dy = y1 - y0, L2 = dx * dx + dy * dy;
		for (let py = by0; py <= by1; py++) {
			const y = PY(py), off = bend(y);
			for (let px = bx0; px <= bx1; px++) {
				const x = PX(px) - off;
				if (flare && (y > y0 + 0.004 || y < y1)) continue;
				const t = clamp(((x - x0) * dx + (y - y0) * dy) / L2);
				const cx = x0 + dx * t, cy = y0 + dy * t;
				const w = Math.max(minW, w0 + (w1 - w0) * t + (flare && y > 0.77 ? 0.026 * Math.min(1, (y - 0.77) / 0.09) ** 2.2 : 0));
				const d = flare ? Math.abs(x - cx) : Math.hypot(x - cx, y - cy);
				if (d > w) continue;
				let v = 0.6 - 0.4 * ((x - cx) / w) - (flare ? 0 : 0.3 * ((y - cy) / w)) + (vnoise(x * 420, y * 26) - 0.5) * 0.3;
				if (y < 0.6) v -= 0.3 * cover * Math.min(1, (0.6 - y) / 0.06);
				if (y > 0.8) v -= 0.2 * ((y - 0.8) / 0.06);
				put(px, py, ramp(BARK, v, px, py));
				bark[py * S + px] = 1;
			}
		}
	}

	if (st.snow > 0) {
		for (let py = 2; py < S; py++)
			for (let px = 0; px < S; px++) {
				if (!bark[py * S + px] || bark[(py - 1) * S + px] || PY(py) > 0.8) continue;
				const ox = Math.round((PX(px) - bend(PY(py))) * S);
				const n = h2(ox, py);
				if (n > st.snow) continue;
				const reach = clamp(Math.hypot(ox / S - 0.5, PY(py) - 0.56) / 0.34);
				const key = clamp((0.6 * (1 - reach) + 0.25 * vnoise(ox / 9, py / 9) + 0.15 * n - 0.1) / 0.6) ** 0.65;
				const m = clamp(st.melt * 2.5 - 1.5 * key);
				if (m >= 1) continue;
				if (m < 0.8) put(px, py - 1, m < 0.55 ? SNOW : SNOW_SOFT);
				put(px, py, SNOW_SHADE);
				if (m < 0.3 && n < st.snow * 0.45 && !bark[(py - 2) * S + px]) put(px, py - 2, SNOW_SOFT);
			}
	}

	if (st.buds > 0) {
		TIPS.forEach(([tx, ty], i) => {
			const g = clamp(st.buds * 1.4 - 0.4 * h2(i, 5));
			if (g < 0.15) return;
			const px = Math.floor((tx + bend(ty)) * S), py = Math.floor((ty + DROP) * S);
			put(px, py, BUD[0]);
			if (g > 0.5) put(px, py - 1, BUD[g > 0.85 ? 2 : 1]);
			if (g > 0.85 && h2(i, 6) > 0.5) put(px + (h2(i, 7) > 0.5 ? 1 : -1), py, BUD[1]);
		});
	}

	if (st.D > -0.3) {
		const A = PALETTES[st.from], B = PALETTES[st.to];
		const rimW = Math.max(1.2, S / 160) / S;
		for (const layer of [0, 1, 2]) {
			for (const [cx, cy, r, l, order] of CLUMPS) {
				if (l !== layer) continue;
				const x0 = Math.max(0, Math.floor((cx - r * 1.3 - 0.04) * S)), x1 = Math.min(S - 1, Math.ceil((cx + r * 1.3 + 0.04) * S));
				const y0 = Math.max(0, Math.floor((cy - r * 1.3 + DROP) * S)), y1 = Math.min(S - 1, Math.ceil((cy + r * 1.3 + DROP) * S));
				for (let py = y0; py <= y1; py++) {
					const y = PY(py), off = bend(y);
					for (let px = x0; px <= x1; px++) {
						const x = PX(px) - off;
						const dx = (x - cx) / r, dy = (y - cy) / r;
						const edge = (fbm(x * 38 + cx * 50, y * 38 + cy * 50) - 0.5) * 0.42;
						const d = Math.hypot(dx, dy) + edge;
						if (d > 1) continue;
						if (fbm(x * 55 + 3, y * 55 + 8) > st.D + 0.18 * (1 - d)) continue;
						const bunch = fbm(x * 90 + cx * 13, y * 90 + cy * 17) - 0.5;
						const ox = Math.round(x * S), oy = py;
						const pick = st.mixMode === "clump" ? 0.75 * order + 0.25 * h2(ox, oy) : 0.5 * fbm(x * 24 + 9, y * 24 + 4) + 0.5 * h2(ox, oy);
						const P = pick < st.mix * 1.02 ? B : A;
						const pal = P.layers[layer];
						const nz = Math.sqrt(Math.max(0, 1 - Math.min(1, dx * dx + dy * dy)));
						const lam = dx * LIGHT[0] + dy * LIGHT[1] + nz * LIGHT[2];
						let v = 0.42 + 0.5 * lam + bunch * 0.5;
						if (dy > 0.35) v -= 0.25 * (dy - 0.35);
						v -= 0.12 * (1 - layer / 2) * Math.max(0, 1 - d);
						const lit = -(dx * LIGHT[0] + dy * LIGHT[1]) / Math.max(0.001, Math.hypot(dx, dy));
						let c;
						if (d > 1 - (rimW / r) * 1.6 && lit < -0.35 && layer > 0 && bunch > -0.1) c = layer === 2 ? P.rim : pal[pal.length - 1];
						else c = ramp(pal, v, px, py);
						if (st.blossom > 0 && layer > 0) {
							const b = fbm(x * 70 + 40, y * 70 + 11);
							if (b > 0.7 && (b - 0.7) / 0.3 > 1 - st.blossom) c = BLOSSOM[v > 0.55 ? 0 : v > 0.3 ? 1 : 2];
						}
						put(px, py, c);
					}
				}
			}
		}
	}

	for (const q of PARTICLES) {
		if (q.season !== st.k) continue;
		const age = st.p - q.born;
		if (age <= 0 || age >= q.life || st.p > 0.985) continue;
		const sec = age * CLIP_SECONDS[st.k];
		const y = q.y + q.vy * sec;
		const x = q.x + 0.012 * Math.sin(sec * 4 + q.sway) + (q.kind === "leaf" ? 0.02 * sec : 0);
		if (y > GROUND - 0.004) continue;
		const px = Math.floor(x * S), py = Math.floor((y + DROP) * S);
		if (q.kind === "flake") put(px, py, FLAKE);
		else if (q.kind === "petal") { put(px, py, q.c); if (Math.sin(sec * 6 + q.sway) > 0) put(px + 1, py, q.c); }
		else { const flip = Math.sin(sec * 7 + q.sway) > 0; put(px, py, q.c); put(px + (flip ? 1 : -1), py, q.c); put(px, py - (flip ? 1 : 0), q.c); }
	}
	return out;
}

module.exports = { frame, stateAt, CLIP_SECONDS };
