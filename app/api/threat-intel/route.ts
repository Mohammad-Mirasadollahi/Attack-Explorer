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
    const knownAdvisories = curated.realWorldAdvisories.join(' | ');

    const prompt = `Search across MULTIPLE independent cybersecurity research sources (such as Mandiant, Microsoft Threat Intelligence, Palo Alto Networks Unit 42, Elastic Security Labs, Cisco Talos, Kaspersky GReAT, Volexity, Splunk SURGe, Huntress, Rapid7, Assetnote, ProjectDiscovery, Avast, ESET, NCSC, and CISA) to provide a synthesized, multi-source cyber threat intelligence briefing for the attack scenario "${scenario.name}" (MITRE ATT&CK: ${scenario.code}; stages: ${techniques}; known references: ${knownAdvisories}).
Synthesize complementary technical details from at least 3 distinct research vantage points:
1. Initial access / exploit root-cause mechanics (exact protocol, header, URI, or syscall flaw).
2. In-memory loader, rootkit, or post-exploitation tradecraft and APT actor attribution.
3. Defender SIEM / Sysmon / EDR forensic detection artifacts and CISA KEV remediation mandates.
Keep the synthesized briefing under 125 words in clear, technical DFIR prose.`;

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
    const seenUris = new Set<string>();

    for (const chunk of rawChunks) {
      const uri = chunk?.web?.uri;
      const title = chunk?.web?.title;
      if (uri && typeof uri === 'string' && !seenUris.has(uri)) {
        seenUris.add(uri);
        groundedSources.push({
          title:
            title && typeof title === 'string'
              ? title
              : new URL(uri).hostname.replace(/^www\./, ''),
          uri,
        });
      }
    }

    // Merge with curated multi-vendor sources so at least 3 independent sources are always preserved
    for (const fallbackSrc of curated.groundedSources) {
      if (!seenUris.has(fallbackSrc.uri)) {
        seenUris.add(fallbackSrc.uri);
        groundedSources.push(fallbackSrc);
      }
    }

    const payload: ThreatIntelContextData = {
      ...curated,
      summary: liveText || curated.summary,
      groundedSources: groundedSources.slice(0, 6),
      sourceMode: 'LIVE_SEARCH_GROUNDING',
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload);
  } catch {
    return NextResponse.json(curated);
  }
}
