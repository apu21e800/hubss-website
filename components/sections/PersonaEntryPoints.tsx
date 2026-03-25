export default function PersonaEntryPoints() {
  return (
    <section className="bg-zinc-900 py-16 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-6">
        <p className="text-center text-zinc-500 text-sm uppercase tracking-widest mb-10">Trusted By</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-white font-semibold text-lg mb-2">Municipalities</p>
            <p className="text-zinc-400 text-sm">York Region · City of Vancouver · City of Toronto · UBC</p>
          </div>
          <div>
            <p className="text-white font-semibold text-lg mb-2">Landscape Architects</p>
            <p className="text-zinc-400 text-sm">Specifying decorative and functional pavement since 1994</p>
          </div>
          <div>
            <p className="text-white font-semibold text-lg mb-2">Contractors</p>
            <p className="text-zinc-400 text-sm">Complete installation support · Training · Technical specs</p>
          </div>
        </div>
      </div>
    </section>
  )
}
