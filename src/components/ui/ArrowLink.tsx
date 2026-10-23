import { ArrowUpRight } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

type Props = Omit<ComponentProps<typeof Link>, 'children'> & { children: ReactNode };

/** Understated editorial link with a small arrow and an animated underline. */
export function ArrowLink({ children, className = '', ...props }: Props) {
  return (
    <Link
      {...props}
      className={`group inline-flex items-center gap-2 text-[0.9375rem] font-medium tracking-wide ${className}`}
    >
      <span className="link-line pb-0.5">{children}</span>
      <ArrowUpRight
        aria-hidden
        size={18}
        strokeWidth={1.5}
        className="transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}
