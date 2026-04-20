# Idealike Pipeline v2 – Setup Guide

## 1. Supabase Migration

Supabase 대시보드 → SQL Editor에서 순서대로 실행:

```
supabase/migrations/001_initial_schema.sql
supabase/migrations/002_email_subscribers.sql
supabase/migrations/003_ranking_columns.sql   ← 신규
```

`003`은 `hackernews` 플랫폼 허용, ranking_score / is_pro_pick / competitive_edge / why_now / market_gap 컬럼 추가.

---

## 2. Anthropic API Key 발급

1. https://console.anthropic.com → API Keys → Create Key
2. 복사해 둘 것 (다시 볼 수 없음)

---

## 3. n8n Variables 설정

n8n UI → Settings → Variables → 아래 4개 생성:

| 변수명                 | 값 예시                                      |
|----------------------|----------------------------------------------|
| `ANTHROPIC_API_KEY`  | `sk-ant-api03-xxxxxxxxxxxx`                  |
| `CLAUDE_SYSTEM_PROMPT` | (아래 ③ 참고)                              |
| `NEXT_BASE_URL`      | `https://idealike.xyz` (또는 로컬 ngrok URL) |
| `INGEST_SECRET`      | `.env`의 `INGEST_SECRET` 값과 동일           |

③ `CLAUDE_SYSTEM_PROMPT` 값: `n8n/claude-system-prompt.txt` 파일의 전체 내용을 붙여넣기.

---

## 4. 워크플로우 Import

1. n8n → Workflows → Import from File
2. `n8n/idealike-pipeline.json` 선택
3. 워크플로우 열기 → Variables가 올바르게 설정됐는지 확인
4. **Test** 버튼으로 수동 실행 → 각 노드 확인
5. 이상 없으면 **Active** 토글 켜기 (매일 오전 6시 UTC 실행)

---

## 5. 노드 구조 요약

```
Daily Trigger (매일 06:00 UTC)
  ├── HN Algolia Fetch → Parse HN Items ──┐
  └── Product Hunt Fetch → Parse PH Items ─┤
                                            ▼
                                      Merge Sources
                                            ▼
                                    Pre-filter & Dedup
                                            ▼
                                       Skip Check
                                            ▼
                                    Split In Batches (3개씩)
                                            ▼
                                    Claude Analysis (Anthropic API)
                                            ▼
                                    Parse Claude Response
                                            ▼
                                      Ranking Score
                                            ▼
                                       Skip Check 2
                                      ↙           ↘
                                 Ingest API      (skip)
                                      ↘           ↙
                                       Wait 2s
                                            ▼
                                  (Split In Batches 루프백)
```

---

## 6. 랭킹 알고리즘

```
ranking_score = (mentions × 0.3) + (freshness × 0.2) + (market_potential × 0.3) + (llm_quality × 0.2)
```

| 요소              | 계산 방식                              | 범위    |
|-----------------|--------------------------------------|---------|
| mentions        | upvotes × 2 (최대 100)               | 0–100  |
| freshness       | 100 - (경과일수 × 10)                | 0–100  |
| market_potential| Claude ai_score                      | 0–100  |
| llm_quality     | 50 + 완성도 보너스 (competitive_edge +15, why_now +15, market_gap +10, pain_points +10) | 50–100 |

**Pro Pick**: ranking_score ≥ 80 (전체 아이디어의 약 5%)

Pro Pick 임계값을 동적으로 재계산하려면 Supabase에서 주기적으로 실행:
```sql
SELECT recompute_pro_picks();
```

---

## 7. 테스트 데이터 (샘플 3개)

아래 JSON을 `/api/ingest` 엔드포인트로 직접 POST해 테스트할 수 있음:

```bash
curl -X POST https://your-app.vercel.app/api/ingest \
  -H "Authorization: Bearer YOUR_INGEST_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Slack Audit Trail SaaS for SOC 2 Compliance",
    "summary": "Automatically captures and archives every Slack message, file, and permission change in an immutable audit log. Enables one-click compliance reports for SOC 2, HIPAA, and ISO 27001 audits.",
    "pain_points": ["Manual log exports take hours", "Slack deletes messages after plan limit", "Auditors require searchable immutable records"],
    "target_customers": ["Series B+ SaaS startups", "Financial services companies", "Healthcare tech companies"],
    "monetization_strategies": ["$199/month per workspace", "Enterprise custom pricing with SLA"],
    "tech_stack_suggestions": ["Slack Events API", "AWS S3 + Glacier", "Next.js", "PostgreSQL"],
    "tags": ["SaaS", "B2B", "Enterprise", "Automation"],
    "competitive_edge": "No existing tool combines real-time Slack archiving with automated compliance report generation in a single product.",
    "why_now": "SOC 2 has become table stakes for enterprise SaaS sales, and Slack is now the primary communication layer for 750k+ organizations.",
    "market_gap": "Current solutions either archive email or require expensive professional services — no lightweight Slack-native option exists.",
    "ai_score": 82,
    "source_url": "https://news.ycombinator.com/item?id=test001",
    "source_platform": "hackernews",
    "upvotes": 187,
    "comment_count": 43,
    "ranking_score": 81.4,
    "is_pro_pick": true
  }'
```

**샘플 2:**
```json
{
  "title": "AI Receipt Parser for Small Business Accounting",
  "summary": "Mobile app that uses Claude Vision to extract line items from receipts and automatically categorizes expenses in real-time. Syncs with QuickBooks and Xero with zero manual entry.",
  "pain_points": ["Receipts pile up until tax season", "Manual categorization errors cost money", "Accountants charge extra for cleanup"],
  "target_customers": ["Freelancers and consultants", "Small business owners (1-10 employees)"],
  "monetization_strategies": ["$15/month flat fee", "Accountant partner referral commission"],
  "tech_stack_suggestions": ["Claude Vision API", "React Native", "QuickBooks API", "Xero API"],
  "tags": ["AI", "FinTech", "Mobile", "B2C"],
  "competitive_edge": "Claude Vision outperforms OCR-based competitors on handwritten and foreign receipts by 40%.",
  "why_now": "Claude 3.5's vision capabilities now achieve >95% accuracy on receipts, making this viable without expensive human review.",
  "market_gap": "Existing apps either require manual correction or charge per-receipt fees that add up fast for active businesses.",
  "ai_score": 75,
  "source_url": "https://news.ycombinator.com/item?id=test002",
  "source_platform": "hackernews",
  "upvotes": 94,
  "comment_count": 28,
  "ranking_score": 73.6,
  "is_pro_pick": false
}
```

**샘플 3:**
```json
{
  "title": "Codebase Onboarding Tool for New Engineers",
  "summary": "Generates an interactive, always-up-to-date codebase tour from your git history and code comments. New engineers go from zero to first PR in 2 days instead of 2 weeks.",
  "pain_points": ["Onboarding docs go stale in weeks", "Senior engineers spend 4h/week answering repeated questions", "New hires take 3-6 months to become productive"],
  "target_customers": ["Engineering teams of 20-200 engineers", "Fast-growing startups with high hiring velocity"],
  "monetization_strategies": ["$500/month per team (up to 50 engineers)", "$2000/month enterprise unlimited"],
  "tech_stack_suggestions": ["GitHub/GitLab API", "Claude API for explanation generation", "React", "Postgres"],
  "tags": ["DevTools", "AI", "B2B", "SaaS"],
  "competitive_edge": "Unlike static wikis, this tool regenerates automatically on every merge and uses the actual diff history as context.",
  "why_now": "Remote-first hiring has made async onboarding critical, and LLMs are now good enough to generate accurate code explanations.",
  "market_gap": "No tool currently connects live git activity to structured onboarding flows — companies spend $12k+ per hire on lost productivity.",
  "ai_score": 78,
  "source_url": "https://www.producthunt.com/posts/test003",
  "source_platform": "producthunt",
  "upvotes": 312,
  "comment_count": 67,
  "ranking_score": 79.2,
  "is_pro_pick": false
}
```
