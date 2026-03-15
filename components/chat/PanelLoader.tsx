'use client';

import { TextShimmer } from '@/components/ui/text-shimmer';
import { TextLoop } from '@/components/motion-primitives/text-loop';

const GENERATING_MESSAGES = [
  'Magicmail is thinking',
  'Tailoring great design',
  'Polishing email copy',
  'Almost done',
];

export function PanelLoader({ message }: { message: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center px-6 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}

export function GeneratingLoader() {
  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <TextLoop interval={3} className="text-center">
        {GENERATING_MESSAGES.map((msg) => (
          <TextShimmer
            key={msg}
            duration={1.5}
            spread={3}
            className="text-base font-medium tracking-tight [--base-color:#71717a] [--base-gradient-color:#18181b] dark:[--base-color:#52525b] dark:[--base-gradient-color:#fafafa]"
          >
            {msg}
          </TextShimmer>
        ))}
      </TextLoop>
    </div>
  );
}
