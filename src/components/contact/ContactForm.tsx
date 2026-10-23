'use client';

import { useId, useRef, useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { siteConfig, instagramUrl } from '@/config/site';

type FieldName = 'name' | 'email' | 'type' | 'message';
type Status = 'idle' | 'submitting' | 'prototype' | 'success' | 'error';
type ErrorKey =
  | 'nameRequired'
  | 'emailRequired'
  | 'emailInvalid'
  | 'typeRequired'
  | 'messageRequired'
  | 'messageShort';

const PROJECT_TYPES = ['residential', 'commercial', 'hospitality', 'interior', 'other'] as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldBase =
  'w-full border-0 border-b border-ink/40 bg-transparent px-0 py-3 text-[1.0625rem] text-ink placeholder:text-ink/45 transition-colors focus:border-ink focus:outline-none focus-visible:outline-none aria-[invalid=true]:border-rojo';

/**
 * Accessible inquiry form.
 * - Every string, placeholder and validation message is translated.
 * - With NEXT_PUBLIC_CONTACT_ENDPOINT set it POSTs JSON there; otherwise it is an honest front-end
 *   prototype and never claims the message was delivered.
 */
export function ContactForm() {
  const t = useTranslations('Form');
  const id = useId();
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Partial<Record<FieldName, ErrorKey>>>({});
  const form = useRef<HTMLFormElement>(null);

  const ids = (f: FieldName) => ({ field: `${id}-${f}`, error: `${id}-${f}-error` });

  function validate(data: FormData) {
    const next: Partial<Record<FieldName, ErrorKey>> = {};
    const name = String(data.get('name') ?? '').trim();
    const email = String(data.get('email') ?? '').trim();
    const type = String(data.get('type') ?? '');
    const message = String(data.get('message') ?? '').trim();

    if (!name) next.name = 'nameRequired';
    if (!email) next.email = 'emailRequired';
    else if (!EMAIL_RE.test(email)) next.email = 'emailInvalid';
    if (!type) next.type = 'typeRequired';
    if (!message) next.message = 'messageRequired';
    else if (message.length < 10) next.message = 'messageShort';
    return next;
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Honeypot: bots fill hidden fields. Pretend nothing happened.
    if (String(data.get('company') ?? '')) return;

    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus('idle');
      const first = (['name', 'email', 'type', 'message'] as FieldName[]).find((f) => found[f]);
      if (first) form.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }

    if (!siteConfig.contactEndpoint) {
      setStatus('prototype');
      return;
    }

    setStatus('submitting');
    try {
      const res = await fetch(siteConfig.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          email: data.get('email'),
          projectType: data.get('type'),
          message: data.get('message'),
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus('success');
      form.current?.reset();
    } catch {
      setStatus('error');
    }
  }

  const errorCount = Object.keys(errors).length;
  const busy = status === 'submitting';

  return (
    <form ref={form} onSubmit={onSubmit} noValidate aria-busy={busy} className="space-y-9">
      {errorCount > 0 ? (
        <p role="alert" className="border-l-2 border-rojo pl-4 text-[0.9375rem] text-rojo">
          {t('errors.summary')}
        </p>
      ) : null}

      <div>
        <label htmlFor={ids('name').field} className="eyebrow block text-muted">
          {t('name')} <span className="sr-only">({t('required')})</span>
        </label>
        <input
          id={ids('name').field}
          name="name"
          type="text"
          autoComplete="name"
          placeholder={t('namePlaceholder')}
          aria-required="true"
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? ids('name').error : undefined}
          className={fieldBase}
        />
        {errors.name ? (
          <p id={ids('name').error} className="mt-2 text-[0.875rem] text-rojo">
            {t(`errors.${errors.name}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids('email').field} className="eyebrow block text-muted">
          {t('email')} <span className="sr-only">({t('required')})</span>
        </label>
        <input
          id={ids('email').field}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder={t('emailPlaceholder')}
          aria-required="true"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? ids('email').error : undefined}
          className={fieldBase}
        />
        {errors.email ? (
          <p id={ids('email').error} className="mt-2 text-[0.875rem] text-rojo">
            {t(`errors.${errors.email}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids('type').field} className="eyebrow block text-muted">
          {t('projectType')} <span className="sr-only">({t('required')})</span>
        </label>
        <select
          id={ids('type').field}
          name="type"
          defaultValue=""
          aria-required="true"
          aria-invalid={errors.type ? true : undefined}
          aria-describedby={errors.type ? ids('type').error : undefined}
          className={`${fieldBase} cursor-pointer`}
        >
          <option value="" disabled>
            {t('projectTypePlaceholder')}
          </option>
          {PROJECT_TYPES.map((key) => (
            <option key={key} value={key}>
              {t(`types.${key}`)}
            </option>
          ))}
        </select>
        {errors.type ? (
          <p id={ids('type').error} className="mt-2 text-[0.875rem] text-rojo">
            {t(`errors.${errors.type}`)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor={ids('message').field} className="eyebrow block text-muted">
          {t('message')} <span className="sr-only">({t('required')})</span>
        </label>
        <textarea
          id={ids('message').field}
          name="message"
          rows={5}
          placeholder={t('messagePlaceholder')}
          aria-required="true"
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? ids('message').error : undefined}
          className={`${fieldBase} resize-y`}
        />
        {errors.message ? (
          <p id={ids('message').error} className="mt-2 text-[0.875rem] text-rojo">
            {t(`errors.${errors.message}`)}
          </p>
        ) : null}
      </div>

      {/* Honeypot (hidden from people and assistive tech). */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          {t('honeypot')}
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="flex flex-col items-start gap-6">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex min-h-12 items-center justify-center bg-accent px-9 text-[0.8125rem] font-medium uppercase tracking-[0.18em] text-accent-ink transition-colors hover:bg-ink hover:text-surface focus-visible:outline-offset-4 disabled:opacity-60"
        >
          {busy ? t('submitting') : t('submit')}
        </button>

        <div aria-live="polite" className="min-h-6 max-w-md text-[0.9375rem] leading-relaxed">
          {status === 'prototype' ? (
            <p className="border-l-2 border-oak pl-4">
              {t('status.prototype')}{' '}
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="link-line font-medium">
                @{siteConfig.instagramHandle}
              </a>
            </p>
          ) : null}
          {status === 'success' ? <p className="border-l-2 border-accent pl-4">{t('status.success')}</p> : null}
          {status === 'error' ? <p className="border-l-2 border-rojo pl-4 text-rojo">{t('status.error')}</p> : null}
        </div>
      </div>
    </form>
  );
}
