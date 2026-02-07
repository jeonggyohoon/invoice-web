'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface CopyLinkButtonProps {
  uuid: string
}

export function CopyLinkButton({ uuid }: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin
    const url = `${baseUrl}/quotes/${uuid}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('링크가 클립보드에 복사되었습니다.')
      setTimeout(() => setCopied(false), 1500)
    } catch {
      toast.error('링크 복사에 실패했습니다.')
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleCopy}
      title="클라이언트 링크 복사"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
      <span className="sr-only">링크 복사</span>
    </Button>
  )
}
