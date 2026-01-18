import { PI, cos, sin } from 'mathjs';

const r = 10;

const a = PI * r * r;
const x = r * cos(PI);
const y = r * sin(PI / 2);

console.log(a, x, y);
