import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ATTACK_SCENARIOS } from '@/lib/attack-scenarios';
import {
  getCuratedThreatIntel,
  GroundedSourceLink,
  ThreatIntelContextData,
} from '@/lib/threat-intel-service';

export async function POST(req: NextRequest) {
  let scenarioId = ATTACK_SCENARIOS[0].id;
  try {
    const body = await req.json();
    if (body?.scenarioId && typeof body.scenarioId === 'string') {
      scenarioId = body.scenarioId;
    }
  } catch {
    // fallback to default scenarioId
  }

  const scenario =
    ATTACK_SCENARIOS.find((s) => s.id === scenarioId) || ATTACK_SCENARIOS[0];
  const curated = getCuratedThreatIntel(scenario);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return NextResponse.json(curated);
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const techniques = scenario.stages
      .map((s) => `${s.mitreTechniqueId} (${s.mitreTechniqueName})`)
      .join(', ');

    const prompt = `Provide a concise, authoritative cyber threat intelligence briefing for the attack scenario "${scenario.name}" (MITRE ATT&CK: ${scenario.code}; stages: ${techniques}).
Include:
1. Real-world context and how this technique is actively exploited in the wild.
2. Recent notable CVEs or CISA Known Exploited Vulnerabilities (KEV) associated with this attack pattern.
3. Known APT threat actor groups or ransomware affiliates observed using these techniques.
Keep the summary under 110 words in clear, technical DFIR prose.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const liveText = response.text?.trim();
    const rawChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const groundedSources: GroundedSourceLink[] = [];

    for (const chunk of rawChunks) {
      const uri = chunk?.web?.uri;
      const title = chunk?.web?.title;
      if (uri && typeof uri === 'string') {
        groundedSources.push({
          title:
            title && typeof title === 'string'
              ? title
              : new URL(uri).hostname.replace(/^www\./, ''),
          uri,
        });
      }
    }

    const payload: ThreatIntelContextData = {
      ...curated,
      summary: liveText || curated.summary,
      groundedSources:
        groundedSources.length > 0
          ? groundedSources.slice(0, 5)
          : curated.groundedSources,
      sourceMode: 'LIVE_SEARCH_GROUNDING',
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(curated);
  }
}
