import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, Plus, Download, Search, X, LayoutDashboard, 
  Palette, FileText, Link, Upload, Wand2, ChevronRight,
  Code, Database, Settings, MessageSquare, Brain, Cog, Menu
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

// Initial skills data
const INITIAL_SKILLS = [
  {
    id: 'frontend-design',
    name: 'Frontend Design',
    description: 'Create distinctive, production-grade frontend interfaces with high design quality.',
    category: 'design',
    tags: ['frontend', 'ui', 'css', 'react'],
    content: `---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, or applications.
---

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE?

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency.
- **Motion**: Use animations for effects and micro-interactions. Focus on high-impact moments.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors.

## Core Principles

1. **Never use generic AI-generated aesthetics** - Avoid Inter, Roboto, Arial, purple gradients, predictable layouts
2. **Match implementation complexity to aesthetic vision** - Maximalist needs elaborate code, minimalist needs restraint
3. **Every design should be different** - Vary between light/dark, fonts, aesthetics

## Implementation

Generate production-grade code (HTML/CSS/JS, React, Vue) that is:
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail`
  },
  {
    id: 'skill-creator',
    name: 'Skill Creator',
    description: 'Create or update AgentSkills with scripts, references, and assets.',
    category: 'development',
    tags: ['skills', 'agents', 'configuration'],
    content: `---
name: skill-creator
description: Create or update AgentSkills with proper structure and configuration.
---

## Overview

This skill guides the creation of well-structured AgentSkills that can be used by AI assistants.

## Skill Structure

A proper skill consists of:
- \`SKILL.md\` - Main definition file
- \`scripts/\` - Helper scripts
- \`references/\` - Documentation and guides
- \`assets/\` - Images, icons, and media

## Creating a Skill

1. Define the skill name and description
2. Outline core capabilities
3. Add usage examples
4. Include configuration options
5. Document edge cases`
  },
  {
    id: 'weather',
    name: 'Weather',
    description: 'Get current weather and forecasts for any location.',
    category: 'utility',
    tags: ['api', 'weather', 'forecasts'],
    content: `---
name: weather
description: Get current weather and forecasts via wttr.in or Open-Meteo.
---

## Usage

Use when: user asks about weather, temperature, or forecasts for any location.

## Features

- Current temperature and conditions
- Multi-day forecasts
- Hourly breakdowns
- Location-based data

## APIs

- wttr.in - Weather data
- Open-Meteo - Free weather API

## Limitations

NOT for: historical weather data, severe weather alerts, or detailed meteorological analysis.`
  }
]

// Dashboard modules data
const DASHBOARD_MODULES = {
  'Core Modules': [
    { name: 'Chat', icon: MessageSquare, desc: 'Conversational interface, message handling, context management' },
    { name: 'Memory', icon: Brain, desc: 'Short-term and long-term memory, context persistence' },
    { name: 'Tools', icon: Cog, desc: 'Tool execution, skill loading, capability discovery' },
    { name: 'Skills', icon: Sparkles, desc: 'AgentSkills system, skill registry, skill execution' },
  ],
  'UI Components': [
    { name: 'Cards', icon: LayoutDashboard, desc: 'Content cards, feature cards, pricing cards' },
    { name: 'Forms', icon: FileText, desc: 'Input fields, selects, checkboxes, validation' },
    { name: 'Navigation', icon: ChevronRight, desc: 'Headers, sidebars, breadcrumbs, tabs' },
    { name: 'Modals', icon: Palette, desc: 'Dialogs, drawers, overlays, tooltips' },
  ],
  'Features': [
    { name: 'Authentication', icon: Settings, desc: 'Login, signup, sessions, tokens' },
    { name: 'API Integration', icon: Link, desc: 'REST APIs, GraphQL, webhooks' },
    { name: 'Database', icon: Database, desc: 'CRUD operations, queries, migrations' },
    { name: 'Code Execution', icon: Code, desc: 'Sandboxed code running, REPL, compilation' },
  ],
  'Pages': [
    { name: 'Landing Page', icon: LayoutDashboard, desc: 'Hero sections, features, CTAs, testimonials' },
    { name: 'Dashboard', icon: LayoutDashboard, desc: 'Stats, charts, activity feeds, quick actions' },
    { name: 'Settings', icon: Settings, desc: 'Preferences, account management, security' },
    { name: 'Profile', icon: User, desc: 'User info, avatars, bio, activity history' },
  ]
}

function User({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

// Components
function Pill({ children, accent, onClick, className = '' }) {
  return (
    <motion.button
      className={`pill ${accent ? 'accent' : ''} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.button>
  )
}

function Button({ variant = 'primary', children, onClick, icon: Icon, className = '' }) {
  return (
    <button className={`btn btn-${variant} ${className}`} onClick={onClick}>
      {Icon && <Icon size={16} />}
      {children}
    </button>
  )
}

function SkillCard({ skill, onClick }) {
  return (
    <motion.div 
      className="skill-card"
      onClick={onClick}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="skill-card-icon">
        <Sparkles size={24} color="#0D0D0D" />
      </div>
      <h3 className="skill-card-name">{skill.name}</h3>
      <p className="skill-card-desc">{skill.description}</p>
      <div className="skill-card-tags">
        {skill.tags.map(tag => (
          <span key={tag} className="skill-tag">{tag}</span>
        ))}
      </div>
    </motion.div>
  )
}

function Header({ visible, skills, activeSkill, onSelectSkill, onNewSkill, onImport, onDashboard, onHome, onMenuClick }) {
  return (
    <header className={`header ${visible ? 'visible' : ''}`}>
      <div className="header-left">
        <button className="mobile-menu-btn" onClick={onMenuClick}>
          <Menu size={20} />
        </button>
        <div className="header-logo" onClick={onHome} style={{ cursor: 'pointer' }}>
          <Sparkles size={24} />
          <span>Skill</span>Forge
        </div>
      </div>
      
      <div className="header-tabs">
        {skills.map(skill => (
          <button
            key={skill.id}
            className={`header-tab ${activeSkill?.id === skill.id ? 'active' : ''}`}
            onClick={() => onSelectSkill(skill)}
          >
            {skill.name}
            <X size={12} className="close" />
          </button>
        ))}
      </div>
      
      <div className="header-actions">
        <Button variant="ghost" icon={LayoutDashboard} onClick={onDashboard}>Dashboard</Button>
        <Button variant="secondary" icon={Plus} onClick={onNewSkill}>New Skill</Button>
        <Button variant="primary" icon={Download} onClick={onImport}>Import</Button>
      </div>
    </header>
  )
}

function WelcomeScreen({ onNavigate }) {
  const pills = [
    { label: 'Browse Skills', action: 'browse', icon: Search },
    { label: 'Design New Skill', action: 'new', icon: Wand2 },
    { label: 'Import Skill', action: 'import', icon: Link },
    { label: 'View Dashboard', action: 'dashboard', icon: LayoutDashboard },
  ]

  return (
    <div className="welcome-screen">
      <motion.div 
        className="welcome-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="welcome-title fade-in">SkillForge Studio</h1>
        <p className="welcome-subtitle fade-in stagger-1">
          Preview, design, and create AgentSkills. Build your own custom skills 
          or explore pre-built ones for your AI assistant.
        </p>
        
        <motion.div 
          className="chat-box fade-in stagger-2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="chat-input-container">
            <textarea 
              className="chat-input" 
              placeholder="What would you like to do today?"
              rows={2}
              readOnly
            />
          </div>
          
          <div className="pills-container">
            {pills.map((pill, i) => (
              <motion.div
                key={pill.action}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
              >
                <Pill 
                  accent={i === 1} 
                  onClick={() => onNavigate(pill.action)}
                >
                  {pill.icon && <pill.icon size={14} style={{ marginRight: 6 }} />}
                  {pill.label}
                </Pill>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

function DashboardView({ onBack }) {
  return (
    <div className="dashboard">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="dashboard-title">Dashboard</h1>
        
        {Object.entries(DASHBOARD_MODULES).map(([section, modules], sectionIndex) => (
          <motion.div 
            key={section}
            className="dashboard-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="dashboard-section-title">
              {section}
            </h2>
            <div className="modules-grid">
              {modules.map((module, i) => (
                <motion.div
                  key={module.name}
                  className="skill-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: sectionIndex * 0.1 + i * 0.05 }}
                >
                  <div className="skill-card-icon" style={{ background: 'linear-gradient(135deg, #00D9FF 0%, #FF6B35 100%)' }}>
                    <module.icon size={24} color="#0D0D0D" />
                  </div>
                  <h3 className="skill-card-name">{module.name}</h3>
                  <p className="skill-card-desc">{module.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function SkillBrowser({ skills, onSelectSkill }) {
  const [search, setSearch] = useState('')
  
  const filtered = skills.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.description.toLowerCase().includes(search.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="skill-browser">
      <div className="browser-header">
        <h1 className="browser-title">Browse Skills</h1>
        <input 
          type="text" 
          className="browser-search"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      
      <div className="skills-grid">
        {filtered.map((skill, i) => (
          <motion.div
            key={skill.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <SkillCard skill={skill} onClick={() => onSelectSkill(skill)} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SkillPreview({ skill, onBack }) {
  // Parse the markdown content
  const content = skill.content || ''

  return (
    <div className="skill-preview">
      <div className="preview-header">
        <div>
          <motion.h1 
            className="preview-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {skill.name}
          </motion.h1>
          <div className="preview-meta">
            <span className="skill-tag">{skill.category}</span>
            {skill.tags.map(tag => (
              <span key={tag} className="skill-tag">{tag}</span>
            ))}
          </div>
        </div>
        <Button variant="secondary" onClick={onBack}>← Back</Button>
      </div>
      
      <motion.div 
        className="preview-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ReactMarkdown
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={oneDark}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </motion.div>
    </div>
  )
}

function SkillDesigner({ onSave, onClose }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'development',
    tags: '',
    content: ''
  })

  const handleSubmit = () => {
    if (!form.name || !form.content) return
    onSave({
      id: form.name.toLowerCase().replace(/\s+/g, '-'),
      name: form.name,
      description: form.description,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      content: form.content
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Design New Skill</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label className="form-label">Skill Name</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., Python Scripting"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Description</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="Brief description of what this skill does"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Category</label>
            <select 
              className="form-select"
              value={form.category}
              onChange={e => setForm({...form, category: e.target.value})}
            >
              <option value="development">Development</option>
              <option value="design">Design</option>
              <option value="utility">Utility</option>
              <option value="data">Data</option>
              <option value="automation">Automation</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input 
              type="text" 
              className="form-input"
              placeholder="e.g., python, scripts, automation"
              value={form.tags}
              onChange={e => setForm({...form, tags: e.target.value})}
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Skill Content (Markdown)</label>
            <textarea 
              className="form-textarea"
              placeholder="Write your SKILL.md content here..."
              value={form.content}
              onChange={e => setForm({...form, content: e.target.value})}
            />
          </div>
        </div>
        
        <div className="modal-footer">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSubmit}>Save Skill</Button>
        </div>
      </motion.div>
    </div>
  )
}

function ImportModal({ onImport, onClose }) {
  const [tab, setTab] = useState('url')
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImport = async () => {
    setError('')
    setLoading(true)
    
    try {
      let skillContent = content
      
      if (tab === 'url' && url) {
        const response = await fetch(url)
        if (!response.ok) throw new Error('Failed to fetch URL')
        skillContent = await response.text()
      }
      
      // Parse the frontmatter
      const match = skillContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
      let name = 'Imported Skill'
      let description = ''
      let category = 'imported'
      let tags = []
      
      if (match) {
        const frontmatter = match[1]
        const body = match[2]
        
        const nameMatch = frontmatter.match(/name:\s*(.+)/)
        const descMatch = frontmatter.match(/description:\s*(.+)/)
        
        if (nameMatch) name = nameMatch[1].trim()
        if (descMatch) description = descMatch[1].trim()
        
        skillContent = body
      }
      
      const skill = {
        id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name,
        description,
        category,
        tags,
        content: skillContent
      }
      
      onImport(skill)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="modal-header">
          <h2 className="modal-title">Import Skill</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="modal-body">
          <div className="tabs">
            <button 
              className={`tab ${tab === 'url' ? 'active' : ''}`}
              onClick={() => setTab('url')}
            >
              <Link size={14} /> From URL
            </button>
            <button 
              className={`tab ${tab === 'paste' ? 'active' : ''}`}
              onClick={() => setTab('paste')}
            >
              <FileText size={14} /> Paste Content
            </button>
          </div>
          
          {tab === 'url' && (
            <div className="form-group">
              <label className="form-label">GitHub Raw URL or Webpage</label>
              <input 
                type="text" 
                className="form-input"
                placeholder="https://raw.githubusercontent.com/.../SKILL.md"
                value={url}
                onChange={e => setUrl(e.target.value)}
              />
            </div>
          )}
          
          {tab === 'paste' && (
            <div className="form-group">
              <label className="form-label">Paste SKILL.md Content</label>
              <textarea 
                className="form-textarea"
                placeholder="Paste your SKILL.md content here..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
          )}
          
          {error && (
            <p style={{ color: 'var(--error)', marginBottom: 'var(--space-md)' }}>{error}</p>
          )}
        </div>
        
        <div className="modal-footer">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            variant="primary" 
            onClick={handleImport}
            disabled={loading || (tab === 'url' ? !url : !content)}
          >
            {loading ? 'Importing...' : 'Import Skill'}
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

// Main App
function App() {
  const [view, setView] = useState('welcome') // welcome, dashboard, browse, preview
  const [skills, setSkills] = useState(() => {
    const saved = localStorage.getItem('skillforge-skills')
    return saved ? JSON.parse(saved) : INITIAL_SKILLS
  })
  const [activeSkill, setActiveSkill] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(() => {
    return localStorage.getItem('skillforge-interacted') === 'true'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem('skillforge-skills', JSON.stringify(skills))
  }, [skills])

  const handleNavigate = (action) => {
    setHasInteracted(true)
    localStorage.setItem('skillforge-interacted', 'true')
    
    switch(action) {
      case 'browse':
        setView('browse')
        break
      case 'dashboard':
        setView('dashboard')
        break
      case 'new':
        setShowNewModal(true)
        break
      case 'import':
        setShowImportModal(true)
        break
    }
  }

  const handleSelectSkill = (skill) => {
    setActiveSkill(skill)
    setView('preview')
  }

  const handleSaveSkill = (skill) => {
    setSkills(prev => [...prev, skill])
    setShowNewModal(false)
  }

  const handleImportSkill = (skill) => {
    setSkills(prev => [...prev, skill])
  }

  const handleHome = () => {
    setView('welcome')
    setActiveSkill(null)
  }

  return (
    <div className="app">
      <Header 
        visible={hasInteracted}
        skills={skills}
        activeSkill={activeSkill}
        onSelectSkill={handleSelectSkill}
        onNewSkill={() => setShowNewModal(true)}
        onImport={() => setShowImportModal(true)}
        onDashboard={() => setView('dashboard')}
        onHome={handleHome}
        onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      />
      
      <AnimatePresence mode="wait">
        {view === 'welcome' && !hasInteracted && (
          <motion.div
            key="welcome"
            exit={{ opacity: 0 }}
          >
            <WelcomeScreen onNavigate={handleNavigate} />
          </motion.div>
        )}
        
        {hasInteracted && (
          <motion.div 
            key="main"
            className="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {view === 'dashboard' && (
              <DashboardView onBack={() => setView('browse')} />
            )}
            
            {view === 'browse' && (
              <SkillBrowser 
                skills={skills} 
                onSelectSkill={handleSelectSkill} 
              />
            )}
            
            {view === 'preview' && activeSkill && (
              <SkillPreview 
                skill={activeSkill} 
                onBack={() => setView('browse')}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      {showNewModal && (
        <SkillDesigner 
          onSave={handleSaveSkill}
          onClose={() => setShowNewModal(false)}
        />
      )}
      
      {showImportModal && (
        <ImportModal 
          onImport={handleImportSkill}
          onClose={() => setShowImportModal(false)}
        />
      )}
    </div>
  )
}

export default App
