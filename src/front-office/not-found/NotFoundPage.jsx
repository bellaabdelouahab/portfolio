import { Link } from "react-router-dom";
import SEO from "../../shared/ui/SEO";
import { useT } from "../../shared/i18n/strings";
import { useLocalePath } from "../../shared/i18n/i18n";

export default function NotFound() {
  const t = useT();
  const lp = useLocalePath();
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <SEO title={t("nf.title")} noIndex />
      <h1 className="mb-3 text-3xl font-bold text-ink-strong">404 · {t("nf.title")}</h1>
      <p className="mb-6 text-ink">{t("nf.text")}</p>
      <Link to={lp("/")} className="font-bold text-success! hover:underline">{t("nf.home")}</Link>
    </div>
  );
}
