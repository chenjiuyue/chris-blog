import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import type { Components } from 'react-markdown';
import type { ReactNode } from 'react';
import { useMemo, useRef } from 'react';

interface Props {
  content: string;
  skipFirstH1?: boolean;
}

// 递归提取 React children 中的文本内容
function extractText(children: ReactNode): string {
  if (typeof children === 'string') {
    return children;
  }
  
  if (typeof children === 'number') {
    return String(children);
  }
  
  if (Array.isArray(children)) {
    return children.map(extractText).join('');
  }
  
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText(children.props.children);
  }
  
  return '';
}

// 去掉 markdown 中第一个 h1（与页面 header 重复）
function removeFirstH1(content: string): string {
  const lines = content.split('\n');
  let found = false;
  const result = lines.filter((line) => {
    if (!found && /^#\s+/.test(line)) {
      found = true;
      return false;
    }
    return true;
  });
  return result.join('\n');
}

export function PostDetail({ content, skipFirstH1 = false }: Props) {
  const processedContent = skipFirstH1 ? removeFirstH1(content) : content;
  // 预处理：提取所有标题，确保与 TableOfContents 一致
  const headingIds = useMemo(() => {
    const ids: string[] = [];
    const lines = processedContent.split('\n');
    
    lines.forEach((line) => {
      const match = line.match(/^(#{1,6})\s+(.+)$/);
      if (match) {
        const text = match[2].trim();
        const id = `heading-${ids.length}-${text.toLowerCase().replace(/[^\w\u4e00-\u9fa5]+/g, '-')}`;
        ids.push(id);
      }
    });
    
    return ids;
  }, [processedContent]);

  // 使用 ref 来追踪当前标题索引
  const headingIndexRef = useRef(0);

  // 为标题生成唯一 ID（与预处理列表匹配）
  const getIdForHeading = () => {
    const id = headingIds[headingIndexRef.current] || '';
    headingIndexRef.current++;
    return id;
  };

  const components: Components = useMemo(() => ({
    h1: ({ children, ...props }) => {
      return <h1 id={getIdForHeading()} {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }) => {
      return <h2 id={getIdForHeading()} {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => {
      return <h3 id={getIdForHeading()} {...props}>{children}</h3>;
    },
    h4: ({ children, ...props }) => {
      return <h4 id={getIdForHeading()} {...props}>{children}</h4>;
    },
    h5: ({ children, ...props }) => {
      return <h5 id={getIdForHeading()} {...props}>{children}</h5>;
    },
    h6: ({ children, ...props }) => {
      return <h6 id={getIdForHeading()} {...props}>{children}</h6>;
    },
  }), [headingIds]);

  // 重置索引
  headingIndexRef.current = 0;

  return (
    <div className="prose max-w-none break-words">
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
}
