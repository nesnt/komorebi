import { JournalMetadata } from '@/types/journal';

/**
 * Downloads a raw .md file directly to the user's local disk
 */
export const downloadMarkdown = (filename: string, content: string) => {
  if (typeof window === 'undefined') return;
  const cleanFilename = filename.endsWith('.md') ? filename : `${filename}.md`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = cleanFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Copies text cleanly to clipboard
 */
export const copyMarkdownToClipboard = async (content: string): Promise<boolean> => {
  if (typeof window === 'undefined' || !navigator.clipboard) return false;
  try {
    await navigator.clipboard.writeText(content);
    return true;
  } catch (err) {
    console.error('Failed to copy text:', err);
    return false;
  }
};

/**
 * Creates an Obsidian deep link protocol URL:
 * obsidian://new?name=...&content=...
 */
export const getObsidianAppUri = (vaultName: string, title: string, content: string): string => {
  const encodedVault = encodeURIComponent(vaultName.trim() || 'Vault');
  const encodedTitle = encodeURIComponent(title.trim().replace(/[/\\?%*:|"<>]/g, '-'));
  const encodedContent = encodeURIComponent(content);
  return `obsidian://new?vault=${encodedVault}&name=${encodedTitle}&content=${encodedContent}`;
};

/**
 * Generates a standard Obsidian markdown note string from metadata
 */
export const formatObsidianMarkdown = (
  metadata: JournalMetadata,
  rawTranscript?: string
): string => {
  const frontmatter = `---
title: "${metadata.title.replace(/"/g, '\\"')}"
date: ${metadata.date}
${metadata.time ? `time: ${metadata.time}` : ''}
tags:
${(metadata.tags || []).map((t) => `  - ${t.replace(/^#/, '')}`).join('\n')}
mood: "${metadata.dominantEmotion}"
mood_score: ${metadata.moodScore}
energy_level: "${metadata.energyLevel}"
---

# ${metadata.title}

> [!quote] Introspeksi Hari
> "${metadata.summary}"

## 💡 Hikmah & Pembelajaran Utama
${(metadata.keyInsights || []).map((k) => `- ${k}`).join('\n')}

## 🌿 Refleksi Batin & Keadaan Emosi
- **Emosi Dominan:** ${metadata.dominantEmotion}
- **Tingkat Energi:** ${metadata.energyLevel} (${metadata.moodScore}/5)

## ✅ Rencana Tindak Lanjut
${(metadata.actionItems || []).map((a) => `- [ ] ${a}`).join('\n')}

## 🔗 Konsep Terkait (Second Brain)
${(metadata.connectedConcepts || []).map((c) => `- [[${c}]]`).join('\n')}

${
  rawTranscript
    ? `\n<details>\n<summary>📝 Catatan Percakapan Mentah</summary>\n\n\`\`\`text\n${rawTranscript}\n\`\`\`\n</details>\n`
    : ''
}

---
*Disintesis oleh Komorebi Companion · Format Obsidian Vault Second Brain*
`;

  return frontmatter;
};
