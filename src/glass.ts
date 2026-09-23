// Liquid-glass backdrop for `.glass` elements, modelled on the Figma Glass effect:
// Light -55° / 30%, Refraction 81, Depth 18, Dispersion 25, Frost 25, Splay 15.
// Refraction + dispersion need an SVG filter inside backdrop-filter, which only Chromium supports;
// other browsers keep the CSS fallback (frost blur + hairline border) from styles.css.

const GLASS = {
  refraction: 81,
  depth: 18,
  dispersion: 25,
  frost: 25,
}

const SVG_NS = 'http://www.w3.org/2000/svg'
const supported = typeof navigator !== 'undefined' && /Chrome\//.test(navigator.userAgent)

let defs: SVGDefsElement | null = null
const filters = new Map<string, string>()

function ensureDefs() {
  if (defs) return defs
  const svg = document.createElementNS(SVG_NS, 'svg')
  svg.setAttribute('width', '0')
  svg.setAttribute('height', '0')
  svg.setAttribute('aria-hidden', 'true')
  svg.style.position = 'absolute'
  defs = document.createElementNS(SVG_NS, 'defs')
  svg.appendChild(defs)
  document.body.appendChild(svg)
  return defs
}

// Displacement map for a rounded rect: inside a `depth`-wide rim, pixels sample inward along
// the edge normal with a convex falloff, which bends the backdrop like a thick glass edge.
function displacementMap(w: number, h: number, r: number, depth: number) {
  const scale = 2 // supersample for crisp edges on retina
  const cw = Math.round(w * scale), ch = Math.round(h * scale)
  const canvas = document.createElement('canvas')
  canvas.width = cw
  canvas.height = ch
  const ctx = canvas.getContext('2d')!
  const img = ctx.createImageData(cw, ch)
  const hw = w / 2, hh = h / 2

  for (let py = 0; py < ch; py++) {
    for (let px = 0; px < cw; px++) {
      const x = (px + 0.5) / scale - hw
      const y = (py + 0.5) / scale - hh
      // Signed distance to rounded rect (negative inside)
      const qx = Math.abs(x) - (hw - r)
      const qy = Math.abs(y) - (hh - r)
      const ox = Math.max(qx, 0), oy = Math.max(qy, 0)
      const outside = Math.hypot(ox, oy)
      const sd = outside + Math.min(Math.max(qx, qy), 0) - r
      const inset = -sd

      let dx = 0, dy = 0
      if (inset > 0 && inset < depth) {
        // Outward normal
        let nx: number, ny: number
        if (qx > 0 && qy > 0) { nx = ox / (outside || 1); ny = oy / (outside || 1) }
        else if (qx > qy) { nx = 1; ny = 0 } else { nx = 0; ny = 1 }
        nx *= Math.sign(x) || 1
        ny *= Math.sign(y) || 1
        const t = 1 - inset / depth
        const mag = t * t * (3 - 2 * t) // smoothstep: no hard line where the rim ends
        dx = -nx * mag
        dy = -ny * mag
      }
      const i = (py * cw + px) * 4
      img.data[i] = 128 + dx * 127
      img.data[i + 1] = 128 + dy * 127
      img.data[i + 2] = 128
      img.data[i + 3] = 255
    }
  }
  ctx.putImageData(img, 0, 0)
  return canvas.toDataURL()
}

function getFilter(w: number, h: number, r: number) {
  const key = `${w}x${h}r${r}`
  const cached = filters.get(key)
  if (cached) return cached

  const id = `glass-${filters.size}`
  const depth = Math.min(GLASS.depth, Math.min(w, h) / 2.2)
  const scale = GLASS.refraction * 0.45 * (depth / GLASS.depth)
  const spread = GLASS.dispersion / 250 // ±10% per channel
  const blur = GLASS.frost / 10

  const filter = document.createElementNS(SVG_NS, 'filter')
  filter.setAttribute('id', id)
  filter.setAttribute('x', '0')
  filter.setAttribute('y', '0')
  filter.setAttribute('width', String(w))
  filter.setAttribute('height', String(h))
  filter.setAttribute('filterUnits', 'userSpaceOnUse')
  filter.setAttribute('primitiveUnits', 'userSpaceOnUse')
  filter.setAttribute('color-interpolation-filters', 'sRGB')
  filter.innerHTML = `
    <feImage href="${displacementMap(w, h, r, depth)}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="none" result="map"/>
    <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="frost"/>
    <feDisplacementMap in="frost" in2="map" scale="${scale * (1 + spread)}" xChannelSelector="R" yChannelSelector="G" result="dr"/>
    <feDisplacementMap in="frost" in2="map" scale="${scale}" xChannelSelector="R" yChannelSelector="G" result="dg"/>
    <feDisplacementMap in="frost" in2="map" scale="${scale * (1 - spread)}" xChannelSelector="R" yChannelSelector="G" result="db"/>
    <feColorMatrix in="dr" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r"/>
    <feColorMatrix in="dg" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g"/>
    <feColorMatrix in="db" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b"/>
    <feBlend in="r" in2="g" mode="screen" result="rg"/>
    <feBlend in="rg" in2="b" mode="screen"/>
  `
  ensureDefs().appendChild(filter)
  filters.set(key, id)
  return id
}

function apply(el: HTMLElement) {
  const w = Math.round(el.offsetWidth)
  const h = Math.round(el.offsetHeight)
  if (!w || !h) return
  const r = Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2)
  const id = getFilter(w, h, Math.round(r))
  const value = `url(#${id}) saturate(150%)`
  if (el.dataset.glassFilter === value) return
  el.dataset.glassFilter = value
  el.style.backdropFilter = value
  el.style.setProperty('-webkit-backdrop-filter', value)
}

export function initGlass() {
  if (!supported) return
  document.documentElement.classList.add('has-liquid-glass')

  const resize = new ResizeObserver(entries => {
    for (const e of entries) apply(e.target as HTMLElement)
  })
  const seen = new WeakSet<Element>()
  const scan = () => {
    document.querySelectorAll<HTMLElement>('.glass').forEach(el => {
      if (seen.has(el) || el.closest('.sheet')) return
      seen.add(el)
      resize.observe(el)
      apply(el)
    })
  }
  new MutationObserver(scan).observe(document.body, { childList: true, subtree: true })
  scan()
}
