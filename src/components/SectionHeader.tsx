interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
}

export default function SectionHeader({
  eyebrow,
  title,
  highlight,
  subtitle,
  centered = true,
  light = false,
}: SectionHeaderProps) {
  const textColor = light ? 'text-white' : 'text-slate-primary';
  const subtitleColor = light ? 'text-white/60' : 'text-slate-500';
  const eyebrowColor = light ? 'text-white/50' : 'text-slate-400';

  const titleParts = highlight ? title.split(highlight) : [title];

  return (
    <div className={`${centered ? 'text-center' : ''} mb-10`}>
      {eyebrow && (
        <span className={`inline-block text-xs font-bold uppercase tracking-widest ${eyebrowColor} mb-3`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`text-3xl lg:text-4xl font-extrabold leading-tight ${textColor}`}>
        {highlight ? (
          <>
            {titleParts[0]}
            <span className="text-accent-red">{highlight}</span>
            {titleParts[1]}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-base ${subtitleColor} max-w-2xl ${centered ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
