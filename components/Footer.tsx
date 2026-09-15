import { BRAND, FOOTER_COLUMNS } from "@/data/product";

export default function Footer() {
  const year = 2026;

  return (
    <footer className="border-t border-line bg-cream">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <p className="font-serif text-2xl font-semibold text-ink">{BRAND.name}</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            A beautifully organized Google Sheets budget planner — monthly dashboards,
            automatic calculations and instant digital access.
          </p>
          {BRAND.contactEmail && (
            <a
              href={`mailto:${BRAND.contactEmail}`}
              className="mt-4 inline-block text-sm font-medium text-rose-dark hover:text-ink"
            >
              {BRAND.contactEmail}
            </a>
          )}
        </div>

        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.heading} aria-label={column.heading}>
            <h3 className="text-xs font-semibold tracking-[0.16em] text-ink uppercase">
              {column.heading}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        {/* extra bottom padding on mobile clears the sticky CTA bar */}
        <p className="container-page py-6 pb-28 text-center text-xs text-muted md:pb-6">
          © {year} {BRAND.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
