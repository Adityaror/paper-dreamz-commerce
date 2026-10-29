/** Gold line-art floral sprig used to decorate the page heroes. Inherits colour from `currentColor`. */

function Blossom({ x, y, r = 1, turn = 0 }: { x: number; y: number; r?: number; turn?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${r})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <path key={a} transform={`rotate(${a})`} d="M0 0 C -6 -5, -6 -14, 0 -18 C 6 -14, 6 -5, 0 0 Z" />
      ))}
      <circle r="2.6" fill="currentColor" stroke="none" />
      {[36, 108, 180, 252, 324].map((a) => (
        <circle key={a} transform={`rotate(${a}) translate(0 -6)`} r="0.9" fill="currentColor" stroke="none" />
      ))}
    </g>
  );
}

function Leaf({ x, y, turn, s = 1 }: { x: number; y: number; turn: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn}) scale(${s})`}>
      <path d="M0 0 C 6 -6, 18 -6, 26 0 C 18 6, 6 6, 0 0 Z" />
      <path d="M2 0 L 22 0" strokeWidth="0.6" />
    </g>
  );
}

function Bud({ x, y, turn }: { x: number; y: number; turn: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${turn})`}>
      <path d="M0 0 C -4 -4, -4 -10, 0 -14 C 4 -10, 4 -4, 0 0 Z" />
      <path d="M-4 -2 C -2 0, 2 0, 4 -2" />
    </g>
  );
}

export default function FloralOrnament({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {/* main stem and side branches */}
      <path d="M8 232 C 50 196, 92 150, 118 104 C 140 66, 168 38, 214 18" />
      <path d="M70 172 C 92 170, 118 160, 138 140" />
      <path d="M104 126 C 92 106, 88 84, 94 62" />
      <path d="M150 64 C 170 70, 190 70, 210 60" />
      <path d="M40 204 C 34 188, 34 172, 42 158" />

      <Leaf x={52} y={190} turn={-130} s={0.9} />
      <Leaf x={60} y={182} turn={-20} />
      <Leaf x={88} y={168} turn={-60} s={0.8} />
      <Leaf x={112} y={156} turn={10} s={0.85} />
      <Leaf x={112} y={112} turn={-160} s={0.9} />
      <Leaf x={126} y={90} turn={-40} />
      <Leaf x={96} y={86} turn={170} s={0.75} />
      <Leaf x={160} y={52} turn={-150} s={0.85} />
      <Leaf x={176} y={66} turn={20} s={0.8} />
      <Leaf x={196} y={28} turn={-30} s={0.7} />

      <Blossom x={138} y={140} r={1.15} turn={10} />
      <Blossom x={94} y={60} r={0.95} turn={-20} />
      <Blossom x={212} y={60} r={0.8} turn={30} />
      <Blossom x={214} y={18} r={0.65} />

      <Bud x={42} y={158} turn={-10} />
      <Bud x={150} y={64} turn={-60} />

      {[
        [72, 140],
        [160, 112],
        [186, 96],
        [60, 120],
        [140, 30],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.4" fill="currentColor" stroke="none" />
      ))}
    </svg>
  );
}
