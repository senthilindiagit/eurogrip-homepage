import { useMemo } from "react"

export function TreadRing({
  blocks = 44,
  block = "rgba(255,255,255,.45)",
  accent = "#ed1c24",
  stroke = "rgba(255,255,255,.2)",
  className,
}: {
  blocks?: number
  block?: string
  accent?: string
  stroke?: string
  className?: string
}) {
  const { polys } = useMemo(() => {
    const cx = 100, cy = 100, rOut = 96, rIn = 66
    const arr: { points: string; fill: string }[] = []
    for (let i = 0; i < blocks; i++) {
      const a0 = (i / blocks) * 2 * Math.PI
      const a1 = ((i + 0.58) / blocks) * 2 * Math.PI
      const p = [
        [cx + rIn * Math.cos(a0), cy + rIn * Math.sin(a0)],
        [cx + rOut * Math.cos(a0), cy + rOut * Math.sin(a0)],
        [cx + rOut * Math.cos(a1), cy + rOut * Math.sin(a1)],
        [cx + rIn * Math.cos(a1), cy + rIn * Math.sin(a1)],
      ]
      arr.push({
        points: p.map((q) => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(" "),
        fill: i % 5 === 0 ? accent : block,
      })
    }
    return { polys: arr }
  }, [blocks, block, accent])

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="97" fill="none" stroke={stroke} strokeWidth="1.2" />
      <circle cx="100" cy="100" r="64" fill="none" stroke={stroke} strokeWidth="1.2" />
      {polys.map((p, i) => (
        <polygon key={i} points={p.points} fill={p.fill} />
      ))}
    </svg>
  )
}
