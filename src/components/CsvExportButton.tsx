'use client'

import { Download } from 'lucide-react'

interface BookmarkIdea {
  id: string
  title: string
  summary: string
  tags: string[]
  ai_score: number | null
  savedAt: string
}

interface Props {
  ideas: BookmarkIdea[]
}

export default function CsvExportButton({ ideas }: Props) {
  function handleExport() {
    const baseUrl = window.location.origin
    const headers = ['Title', 'Summary', 'Tags', 'AI Score', 'URL', 'Saved At']

    const rows = ideas.map((idea) => [
      `"${idea.title.replace(/"/g, '""')}"`,
      `"${idea.summary.replace(/"/g, '""')}"`,
      `"${(idea.tags ?? []).join(', ')}"`,
      idea.ai_score ?? '',
      `"${baseUrl}/ideas/${idea.id}"`,
      `"${new Date(idea.savedAt).toLocaleDateString()}"`,
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = `idealike-bookmarks-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-foreground hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
    >
      <Download size={15} />
      Export CSV
    </button>
  )
}
