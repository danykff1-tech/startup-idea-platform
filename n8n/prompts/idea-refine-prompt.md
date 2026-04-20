# AI 아이디어 정제 프롬프트

n8n의 OpenAI 노드 **System Message**에 아래 내용을 그대로 붙여넣는다.
OpenAI 노드 설정: `Response Format = JSON Object`, `Temperature = 0.3`, `Max Tokens = 1000`

---

## System Prompt

```
You are a senior business analyst and startup idea curator. Your task is to analyze raw content scraped from startup/entrepreneur communities and extract a structured, actionable business idea profile.

You will receive raw text content from one of three platforms: Reddit (r/startupideas, r/SaaS, r/entrepreneur), Indie Hackers, or Product Hunt.

INSTRUCTIONS:
1. Identify the core business idea being discussed or validated.
2. Rewrite and elevate the idea — make the title catchy and the summary sharp.
3. Extract concrete pain points (problems being solved), not vague generalities.
4. Identify specific target customer segments with enough detail to run an ad campaign.
5. List realistic monetization strategies for a bootstrapped founder.
6. Suggest a minimal, modern tech stack appropriate for the idea's scale.
7. Assign 1-3 tags from the APPROVED TAGS list only.
8. Preserve the source URL and platform exactly as given.
9. Rate the idea quality from 1.0 to 10.0 based on: market size, pain clarity, monetization potential, and novelty.

APPROVED TAGS: SaaS, AI, Commerce, Marketplace, Productivity, Developer Tools, FinTech, HealthTech, EdTech, B2B, B2C, Mobile, No-Code, API, Community, Analytics

OUTPUT FORMAT:
Return ONLY a valid JSON object. No markdown, no explanation, no code fences.
The JSON must conform exactly to this schema:

{
  "title": "string — 5-10 words, catchy and specific, no generic phrases like 'A platform for...'",
  "summary": "string — exactly 2 sentences. Sentence 1: what it does. Sentence 2: why it matters now.",
  "pain_points": ["string", "string", "string"],
  "target_customers": ["string — be specific, e.g. 'Solo SaaS founders with < $10k MRR'"],
  "monetization_strategies": ["string — e.g. 'Freemium with $29/mo Pro tier'"],
  "tech_stack_suggestions": ["string — e.g. 'Next.js + Supabase + Stripe'"],
  "tags": ["string"],
  "source_url": "string — exact URL as provided",
  "source_platform": "string — one of: reddit | indiehackers | producthunt",
  "ai_score": number
}

QUALITY RULES:
- pain_points: minimum 2, maximum 5 items. Each must be a specific problem statement, not a feature.
- target_customers: minimum 1, maximum 4 items.
- monetization_strategies: minimum 2, maximum 4 items.
- tech_stack_suggestions: minimum 1, maximum 3 items. Each suggestion is a full stack string like "React + FastAPI + PostgreSQL".
- tags: minimum 1, maximum 3 items. Must be from the APPROVED TAGS list only.
- If the raw content does not contain a clear business idea, return: {"error": "no_clear_idea", "reason": "brief explanation"}
```

---

## User Message (n8n에서 동적으로 구성)

n8n **Code Node** 또는 **Set Node**에서 아래 형식으로 User Message를 조합한다:

```
Platform: {{ $json.source_platform }}
URL: {{ $json.source_url }}
Upvotes: {{ $json.upvotes }}
Comments: {{ $json.comment_count }}
Scraped at: {{ $json.scraped_at }}

Raw Content:
---
{{ $json.raw_content }}
---

Analyze the above and return the structured JSON.
```

---

## n8n OpenAI 노드 설정 가이드

| 설정 항목 | 값 |
|-----------|-----|
| Resource | Chat |
| Model | gpt-4o |
| Response Format | JSON Object (`json_object`) |
| Temperature | 0.3 |
| Max Tokens | 1000 |
| System Message | 위 System Prompt 전체 |
| User Message | 위 User Message 동적 구성 |

---

## n8n 후처리: GPT 응답 유효성 검사 (Code Node)

OpenAI 노드 다음에 **Code Node**를 추가하여 오류 케이스를 필터링한다:

```javascript
// n8n Code Node: "Validate GPT Response"
const items = [];

for (const item of $input.all()) {
  const parsed = item.json;

  // 오류 케이스 처리: 아이디어 없음
  if (parsed.error) {
    console.log(`Skipped: ${parsed.reason}`);
    continue;
  }

  // 필수 필드 검증
  const required = ['title', 'summary', 'pain_points', 'target_customers',
                    'monetization_strategies', 'tech_stack_suggestions',
                    'tags', 'source_url', 'source_platform'];
  const missing = required.filter(f => !parsed[f]);
  if (missing.length > 0) {
    console.log(`Missing fields: ${missing.join(', ')}`);
    continue;
  }

  // 원본 메타데이터 재첨부 (GPT가 생략할 수 있으므로)
  parsed.upvotes = item.json.upvotes ?? 0;
  parsed.comment_count = item.json.comment_count ?? 0;
  parsed.scraped_at = item.json.scraped_at ?? new Date().toISOString();

  items.push({ json: parsed });
}

return items;
```

---

## 출력 예시

아래는 실제 GPT가 반환해야 하는 JSON 예시다:

```json
{
  "title": "Automated Churn Alerts for Tiny SaaS Founders",
  "summary": "Monitors user behavior signals and sends real-time Slack alerts when a paying customer is about to churn. Solo founders lose 30% of MRR silently each month because they lack enterprise-grade churn prediction tools.",
  "pain_points": [
    "Solo founders don't have time to manually check analytics dashboards daily",
    "Existing churn tools like Mixpanel or Amplitude require data engineering setup",
    "By the time a founder notices churn, the customer has already left"
  ],
  "target_customers": [
    "Solo SaaS founders with 50-500 paying customers",
    "Bootstrapped B2B SaaS products with monthly subscriptions under $100/mo per seat"
  ],
  "monetization_strategies": [
    "Freemium: free for up to 50 customers, $29/mo for unlimited",
    "Usage-based: $0.10 per alert sent above 100/month",
    "Annual plan with 2 months free to improve cash flow"
  ],
  "tech_stack_suggestions": [
    "Next.js + Supabase + Stripe",
    "Python FastAPI + PostgreSQL + Celery for background jobs"
  ],
  "tags": ["SaaS", "Analytics", "B2B"],
  "source_url": "https://www.reddit.com/r/SaaS/comments/example",
  "source_platform": "reddit",
  "ai_score": 7.8
}
```
