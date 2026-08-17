import { useEffect } from "react"
import { SiteFooter } from "@/components/site/CtaFooter"
import { useRouter } from "@/lib/router"
import { ApplyForm, type AppliedRole } from "@/components/site/ApplyForm"
import { Reveal } from "@/components/site/ui"

/**
 * Dedicated application page — reached from the Careers CTAs so the form
 * never competes with the story on /careers.
 */
export function CareersApply() {
  const { path, navigate } = useRouter()

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }) }, [path])

  /* ?role=…&dept=…&place=… carried over from an opening's Apply button */
  const params = new URLSearchParams(window.location.search)
  const roleTitle = params.get("role")
  const appliedRole: AppliedRole | undefined = roleTitle
    ? { title: roleTitle, dept: params.get("dept") ?? undefined, place: params.get("place") ?? undefined }
    : undefined

  return (
    <main>
      <section className="bg-mist pb-[clamp(56px,9vh,110px)] pt-[clamp(112px,17vh,160px)] text-asphalt">
        <div className="mx-auto max-w-[1120px] px-5 sm:px-8">
          <Reveal>
            <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-[0.78rem] font-medium text-slate-500">
              <a href="/" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/") } }} className="transition-colors hover:text-asphalt">Home</a>
              <span className="text-slate-400">›</span>
              <a href="/careers" onClick={(e) => { if (!e.metaKey && !e.ctrlKey) { e.preventDefault(); navigate("/careers") } }} className="transition-colors hover:text-asphalt">Careers</a>
              <span className="text-slate-400">›</span>
              <span className="text-asphalt">Apply</span>
            </nav>
          </Reveal>
          <ApplyForm appliedRole={appliedRole} />
        </div>
      </section>
      <SiteFooter />
    </main>
  )
}
