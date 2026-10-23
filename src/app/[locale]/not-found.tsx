import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function NotFound() {
  const t = useTranslations('Errors');
  const tm = useTranslations('Meta');
  const tc = useTranslations('Common');

  return (
    <section className="container-x flex min-h-[80svh] flex-col justify-center gap-8 pb-24 pt-40">
      <title>{tm('notFound.title')}</title>
      <p className="eyebrow text-muted">{t('notFoundCode')}</p>
      <h1 className="font-display display-lg">{t('notFoundTitle')}</h1>
      <p className="max-w-md text-[1.0625rem] leading-[1.75] text-ink/85">{t('notFoundBody')}</p>
      <Link href="/" className="link-line self-start">
        {tc('goHome')}
      </Link>
    </section>
  );
}
