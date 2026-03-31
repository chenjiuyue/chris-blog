import { Inbox } from 'lucide-react';

interface Props {
  message?: string;
}

export function Empty({ message = '暂无内容' }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-text-muted">
      <Inbox size={48} className="mb-3 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
