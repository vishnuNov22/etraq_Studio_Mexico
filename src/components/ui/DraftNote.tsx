import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';

/**
 * Marks copy that is placeholder / unverified, so it is never mistaken for facts about the studio.
 * Hidden by setting NEXT_PUBLIC_SHOW_DRAFT_NOTES=false once the studio has approved the content.
 * Pass `message` to show a specific note instead of the generic one.
 */
export function DraftNote({ message, className = '' }: { message?: string; className?: string }) {
  const t = useTranslations('Common');
  if (!siteConfig.showDraftNotes) return null;
  return (
    <p
      className={`inline-flex items-center gap-2 text-[0.8125rem] leading-snug text-muted ${className}`}
    >
      <span aria-hidden className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rojo" />
      <span>{message ?? t('draftNote')}</span>
    </p>
  );
}
