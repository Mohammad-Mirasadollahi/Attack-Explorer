'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Play } from 'lucide-react';
import {
  ANIME_3D_STAGE_STANDARD,
  type Section3DKey,
} from '@/lib/section-3d-registry';
import { hasTechnicalClip } from '@/lib/section-technical-clip-registry';
import { useHeavyMediaSlot } from '@/components/media/useHeavyMediaSlot';

function ClipLoading() {
  return (
    <div
      className="flex aspect-[16/10] w-full items-center justify-center rounded-xl border-2 border-indigo-900/80 bg-[#0f172a]"
      data-testid="technical-clip-loading"
    >
      <div className="font-mono text-sm text-indigo-200">Loading technical clip…</div>
    </div>
  );
}

const PROCESS_HOLLOWING_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(() => import('./clips/Step1SuspendClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-2': dynamic(() => import('./clips/Step2UnmapClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-3': dynamic(() => import('./clips/Step3AllocInjectClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-4': dynamic(() => import('./clips/Step4ContextClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'step-5': dynamic(() => import('./clips/Step5BeaconClip'), { ssr: false, loading: () => <ClipLoading /> }),
  'memory-forensics': dynamic(() => import('./clips/MemoryDiffClip'), { ssr: false, loading: () => <ClipLoading /> }),
};

const AMSI_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep1LookupClip').then(
        (m) => m.AmsiStep1LookupClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep2VirtualProtectClip').then(
        (m) => m.AmsiStep2VirtualProtectClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep3PatchPrologueClip').then(
        (m) => m.AmsiStep3PatchPrologueClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiStep4ReflectiveLoadClip').then(
        (m) => m.AmsiStep4ReflectiveLoadClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/amsi-reflective-dll/AmsiMemoryDiffClip').then(
        (m) => m.AmsiMemoryDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const LOCKBIT_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/ransomware-shadow-wipe/LockbitStep1PsexecClip').then(
        (m) => m.LockbitStep1PsexecClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/ransomware-shadow-wipe/LockbitStep2VssWipeClip').then(
        (m) => m.LockbitStep2VssWipeClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/ransomware-shadow-wipe/LockbitStep3IocpEncryptClip').then(
        (m) => m.LockbitStep3IocpEncryptClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/ransomware-shadow-wipe/LockbitStep4RansomNoteClip').then(
        (m) => m.LockbitStep4RansomNoteClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const THREECX_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/3cx-desktopapp-supply-chain-lazarus/ThreeCxStep1BuildSignClip').then(
        (m) => m.ThreeCxStep1BuildSignClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/3cx-desktopapp-supply-chain-lazarus/ThreeCxStep2FeedfaceRc4Clip').then(
        (m) => m.ThreeCxStep2FeedfaceRc4Clip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/3cx-desktopapp-supply-chain-lazarus/ThreeCxStep3IconDeadDropClip').then(
        (m) => m.ThreeCxStep3IconDeadDropClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/3cx-desktopapp-supply-chain-lazarus/ThreeCxStep4StealerGopuramClip').then(
        (m) => m.ThreeCxStep4StealerGopuramClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/3cx-desktopapp-supply-chain-lazarus/ThreeCxMemoryDiffClip').then(
        (m) => m.ThreeCxMemoryDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const XZ_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/xz-utils-cve-2024-3094-backdoor/XzStep1TestFixtureInjectClip').then(
        (m) => m.XzStep1TestFixtureInjectClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/xz-utils-cve-2024-3094-backdoor/XzStep2IfuncGotHijackClip').then(
        (m) => m.XzStep2IfuncGotHijackClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/xz-utils-cve-2024-3094-backdoor/XzStep3Ed448AuthBypassClip').then(
        (m) => m.XzStep3Ed448AuthBypassClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/xz-utils-cve-2024-3094-backdoor/XzStep4LatencyForensicsClip').then(
        (m) => m.XzStep4LatencyForensicsClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/xz-utils-cve-2024-3094-backdoor/XzMemoryGotPltDiffClip').then(
        (m) => m.XzMemoryGotPltDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const LSASS_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/dfir-lsass-minidump-comsvcs-sysmon-eid10/LsassStep1SeDebugClip').then(
        (m) => m.LsassStep1SeDebugClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/dfir-lsass-minidump-comsvcs-sysmon-eid10/LsassStep2ComsvcsOpenProcessClip').then(
        (m) => m.LsassStep2ComsvcsOpenProcessClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/dfir-lsass-minidump-comsvcs-sysmon-eid10/LsassStep3MiniDumpFileClip').then(
        (m) => m.LsassStep3MiniDumpFileClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/dfir-lsass-minidump-comsvcs-sysmon-eid10/LsassStep4SysmonCallTraceClip').then(
        (m) => m.LsassStep4SysmonCallTraceClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/dfir-lsass-minidump-comsvcs-sysmon-eid10/LsassMemoryPplDiffClip').then(
        (m) => m.LsassMemoryPplDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const KERB_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/ad-kerberoasting/KerbStep1SpnEnumClip').then(
        (m) => m.KerbStep1SpnEnumClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/ad-kerberoasting/KerbStep2Rc4TgsClip').then(
        (m) => m.KerbStep2Rc4TgsClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/ad-kerberoasting/KerbStep3HashcatCrackClip').then(
        (m) => m.KerbStep3HashcatCrackClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/ad-kerberoasting/KerbStep4PthLateralClip').then(
        (m) => m.KerbStep4PthLateralClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/ad-kerberoasting/KerbMemoryRc4AesDiffClip').then(
        (m) => m.KerbMemoryRc4AesDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const ZLOG_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/zerologon-netlogon-cve-2020-1472/ZlogStep1ZeroIvClip').then(
        (m) => m.ZlogStep1ZeroIvClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/zerologon-netlogon-cve-2020-1472/ZlogStep2Eid5805Clip').then(
        (m) => m.ZlogStep2Eid5805Clip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/zerologon-netlogon-cve-2020-1472/ZlogStep3Eid4742Clip').then(
        (m) => m.ZlogStep3Eid4742Clip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/zerologon-netlogon-cve-2020-1472/ZlogStep4SecureRpcClip').then(
        (m) => m.ZlogStep4SecureRpcClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/zerologon-netlogon-cve-2020-1472/ZlogMemoryIvDiffClip').then(
        (m) => m.ZlogMemoryIvDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const DCSYNC_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/dfir-dcsync-drsuapi-replication-eid4662/DcsyncStep1AclClip').then(
        (m) => m.DcsyncStep1AclClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/dfir-dcsync-drsuapi-replication-eid4662/DcsyncStep2DrsrClip').then(
        (m) => m.DcsyncStep2DrsrClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/dfir-dcsync-drsuapi-replication-eid4662/DcsyncStep3Eid4662Clip').then(
        (m) => m.DcsyncStep3Eid4662Clip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/dfir-dcsync-drsuapi-replication-eid4662/DcsyncStep4KrbtgtClip').then(
        (m) => m.DcsyncStep4KrbtgtClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/dfir-dcsync-drsuapi-replication-eid4662/DcsyncMemoryAclDiffClip').then(
        (m) => m.DcsyncMemoryAclDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const LOG4J_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/log4shell-dfir/Log4jStep1IngressClip').then(
        (m) => m.Log4jStep1IngressClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/log4shell-dfir/Log4jStep2LookupClip').then(
        (m) => m.Log4jStep2LookupClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/log4shell-dfir/Log4jStep3EgressClip').then(
        (m) => m.Log4jStep3EgressClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/log4shell-dfir/Log4jStep4AirlockClip').then(
        (m) => m.Log4jStep4AirlockClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/log4shell-dfir/Log4jMemoryClassDiffClip').then(
        (m) => m.Log4jMemoryClassDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const DNSTUN_CLIP_BY_SECTION: Partial<Record<Section3DKey, React.ComponentType>> = {
  'step-1': dynamic(
    () =>
      import('./clips/dns-tunneling-exfil/DnstunStep1ChunkClip').then(
        (m) => m.DnstunStep1ChunkClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-2': dynamic(
    () =>
      import('./clips/dns-tunneling-exfil/DnstunStep2Sysmon22Clip').then(
        (m) => m.DnstunStep2Sysmon22Clip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-3': dynamic(
    () =>
      import('./clips/dns-tunneling-exfil/DnstunStep3TxtBeaconClip').then(
        (m) => m.DnstunStep3TxtBeaconClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'step-4': dynamic(
    () =>
      import('./clips/dns-tunneling-exfil/DnstunStep4RpzClip').then(
        (m) => m.DnstunStep4RpzClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
  'memory-forensics': dynamic(
    () =>
      import('./clips/dns-tunneling-exfil/DnstunMemoryEntropyDiffClip').then(
        (m) => m.DnstunMemoryEntropyDiffClip
      ),
    { ssr: false, loading: () => <ClipLoading /> }
  ),
};

const SCENARIO_TECHNICAL_CLIPS_BY_ID: Record<
  string,
  Partial<Record<Section3DKey, React.ComponentType>>
> = {
  'process-hollowing': PROCESS_HOLLOWING_CLIP_BY_SECTION,
  'amsi-reflective-dll': AMSI_CLIP_BY_SECTION,
  'ransomware-shadow-wipe': LOCKBIT_CLIP_BY_SECTION,
  '3cx-desktopapp-supply-chain-lazarus': THREECX_CLIP_BY_SECTION,
  'xz-utils-cve-2024-3094-backdoor': XZ_CLIP_BY_SECTION,
  'dfir-lsass-minidump-comsvcs-sysmon-eid10': LSASS_CLIP_BY_SECTION,
  'ad-kerberoasting': KERB_CLIP_BY_SECTION,
  'zerologon-netlogon-cve-2020-1472': ZLOG_CLIP_BY_SECTION,
  'dfir-dcsync-drsuapi-replication-eid4662': DCSYNC_CLIP_BY_SECTION,
  'log4shell-dfir': LOG4J_CLIP_BY_SECTION,
  'dns-tunneling-exfil': DNSTUN_CLIP_BY_SECTION,
};

export interface TechnicalClipEmbedProps {
  scenarioId: string;
  sectionKey: Section3DKey;
  className?: string;
}

/**
 * Cinematic SVG+GSAP teaching clip surface.
 * Not the Excalidraw whiteboard — keep these products separate.
 */
export function TechnicalClipEmbed({
  scenarioId,
  sectionKey,
  className = '',
}: TechnicalClipEmbedProps) {
  const { ref, active, activate } = useHeavyMediaSlot('clip');
  if (!hasTechnicalClip(scenarioId, sectionKey)) return null;

  const ClipComponent = SCENARIO_TECHNICAL_CLIPS_BY_ID[scenarioId]?.[sectionKey];
  if (!ClipComponent) return null;

  return (
    <div
      ref={ref}
      className={className}
      data-testid={`technical-clip-embed-${sectionKey}`}
      data-clip-active={active ? 'true' : 'false'}
    >
      {active ? (
        <ClipComponent />
      ) : (
        <button
          type="button"
          onClick={activate}
          className={`anime-3d-stage-frame flex w-full cursor-pointer items-center justify-center bg-[#0B0F17] ${ANIME_3D_STAGE_STANDARD.viewportHeightClasses}`}
        >
          <span className="inline-flex items-center gap-2 rounded-lg border-2 border-slate-700 bg-amber-400 px-4 py-2 font-mono text-xs font-extrabold text-slate-950">
            <Play className="h-3.5 w-3.5 fill-current" />
            Play technical clip
          </span>
        </button>
      )}
    </div>
  );
}
