import { GitBranch, Mail, BookOpen, Code2, Palette, Coffee, Globe } from 'lucide-react';
import { SEO } from '../components/common/SEO';

const skills = [
  { name: 'React', icon: Code2 },
  { name: 'TypeScript', icon: Code2 },
  { name: 'Node.js', icon: Code2 },
  { name: 'UI Design', icon: Palette },
  { name: 'Tech Writing', icon: BookOpen },
  { name: 'Coffee Lover', icon: Coffee },
];

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: GitBranch },
  { name: 'Blog', href: '/', icon: Globe },
  { name: 'Email', href: 'mailto:hello@chrisknow.dev', icon: Mail },
];

export function AboutPage() {
  return (
    <>
      <SEO title="关于我" description="了解博主 Chris 的技术背景和兴趣爱好" />
      <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="animate-fade-in">
        {/* Profile Header */}
        <div className="text-center mb-12">
          <div className="w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden ring-2 ring-accent/30 ring-offset-2 ring-offset-surface-light dark:ring-offset-primary-dark">
            <img
              src="https://placehold.co/112x112/D4A574/1A1A2E?text=C&font=DM+Serif+Display"
              alt="Chris"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl text-primary dark:text-text-light mb-2">
            Chris Know
          </h1>
          <p className="text-text-secondary dark:text-text-muted text-sm">
            全栈开发者 / 技术写作者 / 终身学习者
          </p>
        </div>

        {/* Skills */}
        <div className="mb-12">
          <h2 className="font-serif text-xl text-primary dark:text-text-light mb-5">技能与兴趣</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
              <div
                key={skill.name}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--color-border)]
                  bg-white dark:bg-[#2D2D3A]/40 text-sm text-text-secondary dark:text-text-muted
                  hover:border-accent/30 hover:text-accent transition-all duration-200"
              >
                <skill.icon size={14} />
                {skill.name}
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-12">
          <h2 className="font-serif text-xl text-primary dark:text-text-light mb-5">关于我</h2>
          <div className="prose max-w-none">
            <p>
              你好，我是 Chris。一名热爱技术的全栈开发者，专注于 Web 前端开发和用户体验设计。
              我相信好的代码应该像好的文章一样 — 清晰、优雅、富有表达力。
            </p>
            <p>
              在过去几年中，我参与了多个大型项目的前端架构设计与开发，涵盖企业级 SaaS 应用、
              数据可视化平台和移动端应用。我喜欢探索新技术，并在实践中总结经验。
            </p>
            <p>
              这个博客是我记录技术思考、分享开发经验的地方。希望这些文字能对你有所帮助。
              如果你对我的内容感兴趣，欢迎通过以下方式联系我。
            </p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h2 className="font-serif text-xl text-primary dark:text-text-light mb-5">联系方式</h2>
          <div className="flex gap-4">
            {socialLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[var(--color-border)]
                  bg-white dark:bg-[#2D2D3A]/40 text-sm text-text-secondary dark:text-text-muted
                  hover:border-accent/30 hover:text-accent transition-all duration-200"
              >
                <link.icon size={16} />
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
