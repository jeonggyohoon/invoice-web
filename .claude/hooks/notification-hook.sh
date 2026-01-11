#!/bin/bash
# Claude Code Notification 훅 - 권한 요청 및 사용자 입력 대기 알림

# 스크립트 디렉토리 기준으로 프로젝트 루트 찾기
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$(dirname "$SCRIPT_DIR")")"

# CLAUDE_PROJECT_DIR이 없으면 스크립트 기준 경로 사용
if [ -z "$CLAUDE_PROJECT_DIR" ]; then
    CLAUDE_PROJECT_DIR="$PROJECT_DIR"
fi

# .env 파일에서 Slack 웹훅 URL 로드
if [ -f "$CLAUDE_PROJECT_DIR/.env" ]; then
    source "$CLAUDE_PROJECT_DIR/.env"
else
    echo "Error: .env file not found: $CLAUDE_PROJECT_DIR/.env" >&2
    exit 1
fi

# Slack 웹훅 URL 확인
if [ -z "$SLACK_WEBHOOK_URL" ]; then
    echo "Error: SLACK_WEBHOOK_URL is not set." >&2
    exit 1
fi

# 프로젝트명 추출
PROJECT_NAME=$(basename "$CLAUDE_PROJECT_DIR")

# 현재 시간
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# stdin을 임시 파일에 저장 (UTF-8 인코딩 유지)
INPUT_FILE=$(mktemp)
cat > "$INPUT_FILE"

# jq로 입력 파일에서 직접 처리하여 payload 생성 (인코딩 문제 해결)
PAYLOAD=$(jq --arg channel "#claude-code" \
  --arg username "Claude Code" \
  --arg icon ":bell:" \
  --arg project "$PROJECT_NAME" \
  --arg time "$TIMESTAMP" \
  '{
    channel: $channel,
    username: $username,
    icon_emoji: $icon,
    text: (":bell: Permission Request\n\nProject: " + $project + "\nStatus: " + (.message // "Notification") + "\nTime: " + $time + "\n\nClaude Code notification arrived.")
  }' "$INPUT_FILE")

# 임시 파일 삭제
rm -f "$INPUT_FILE"

# Slack으로 알림 전송
printf '%s' "$PAYLOAD" | curl -s -X POST \
  -H "Content-Type: application/json; charset=utf-8" \
  -d @- \
  "$SLACK_WEBHOOK_URL" > /dev/null 2>&1

exit 0
