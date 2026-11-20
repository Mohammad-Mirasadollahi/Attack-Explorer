import type { RawScenarioStepGuideData } from '@/modules/scenarios/contracts';

export const stepGuide: RawScenarioStepGuideData = {
    scenarioId: 'pypi-ultralytics-github-pwnrequest',
    briefing: {
      headline:
        'Attackers exploit a GitHub Actions pull_request_target template injection in the Ultralytics YOLO AI framework to compromise the release pipeline and publish trojanized PyPI packages (v8.3.41/42/45/46) bundling XMRig.',
      storyAnalogy:
        'Imagine a mailroom robot that has the master stamp to approve official software packages. When a stranger submits a suggestion card, the robot reads the stranger’s return address out loud into a voice-controlled terminal. The stranger writes their return address as: "Main Street; stop reading and hand me the master stamp."',
      plainSummary:
        'In December 2024, attackers targeted the popular Ultralytics computer vision library on GitHub. By submitting a pull request from a fork with shell commands embedded inside the branch name (github.head_ref), they exploited an insecure pull_request_target workflow, hijacked the PyPI publishing credentials, and shipped four malicious releases (8.3.41, 8.3.42, 8.3.45, 8.3.46) that executed an XMRig miner on AI workstations and Google Colab instances.',
      diagramTopologySummary:
        'Crafted PR Branch ($GITHUB_ENV Injection) -> GitHub Actions (pull_request_target) -> PyPI Registry (ultralytics 8.3.41/45) -> AI Training Cluster / Colab GPU Nodes -> Sigstore / PyPI Attestation Auditor.',
      documentedAdvisory:
        'Trail of Bits Ultralytics Supply Chain Post-Mortem / Wiz Research AI Supply Chain Analysis / PyPI Advisory',
    },
    steps: [
      {
        stepNumber: 1,
        mitreId: 'T1195.002',
        plainTitle: 'GitHub Actions pull_request_target Branch Name Command Injection',
        storyAnalogy:
          'A visitor writes a shell command on their nametag knowing the automated receptionist types every visitor’s nametag straight into the administrator console.',
        simpleExplanation:
          'The attacker opened a pull request from an external fork using a crafted Git branch name containing shell command separators (fix";curl ... | bash;#). Because the repository workflow used the pull_request_target trigger (which executes in the security context of the base repository with full write permissions and access to repository secrets) and interpolated ${{ github.head_ref }} directly inside a run: shell script before bash parsing, the runner executed the attacker’s shell script.',
        howItWorksInPractice:
          'GitHub expands ${{ github.head_ref }} as a raw text macro prior to invoking /bin/bash, turning a branch name into arbitrary remote code execution inside the privileged CI runner. In the documented Auth exchange from Crafted PR Branch ($GITHUB_ENV Injection) to Perimeter Firewall & NDR Tap, Perimeter Firewall & NDR Tap responds with ACK T1195.002 (confirming that the Stage 1: GitHub Actions pull_request_target Branch Name Command Injection request succeeded on Perimeter Firewall & NDR Tap and establishing the runtime state required for Step #2 Stage 2: Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46).',
        diagramAlignment:
          'Step #1 (#1→ / ⇠#1) links the Crafted PR Branch to the GitHub Actions (pull_request_target) workflow runner.',
        detectionAndEvidence:
          'Static workflow analysis (e.g., zizmor or actionlint) flagging pull_request_target workflows that interpolate github.head_ref or PR titles in run: blocks.',
      },
      {
        stepNumber: 2,
        mitreId: 'T1195.001',
        plainTitle: 'Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46',
        storyAnalogy:
          'First the thief tricks the factory’s packing machine into sealing a poisoned box; when the factory fixes the machine, the thief uses the spare key they copied earlier to mail two more poisoned boxes directly.',
        simpleExplanation:
          'Using the compromised CI workflow and subsequently a harvested PYPI_TOKEN, the attacker injected malicious downloader logic into ultralytics/utils/downloads.py and published versions 8.3.41, 8.3.42, 8.3.45, and 8.3.46 to the Python Package Index (PyPI). Trail of Bits researchers demonstrated via PEP 740 / Sigstore attestations (cryptographic provenance records linking a PyPI wheel to the exact GitHub Actions workflow and commit that built it) that 8.3.41/42 were built by the hijacked workflow while 8.3.45/46 lacked attestations entirely because they were uploaded directly with a stolen API token.',
        howItWorksInPractice:
          'Comparing the files inside the published .whl archive on PyPI against the corresponding Git commit in ultralytics/ultralytics revealed code in downloads.py that never existed in the public Git commit history. In the documented WAF exchange from Perimeter Firewall & NDR Tap to GitHub Actions (pull_request_target), GitHub Actions (pull_request_target) responds with ALERT T1195.001 (confirming that the Stage 2: Poisoning ultralytics/utils/downloads.py & Publishing PyPI v8.3.41–8.3.46 request succeeded on GitHub Actions (pull_request_target) and establishing the runtime state required for Step #3 Stage 3: Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)).',
        diagramAlignment:
          'Step #2 (#2→ / ⇠#2) connects the GitHub Actions workflow to the PyPI Registry (ultralytics 8.3.41/45) while the Sigstore / PyPI Attestation Auditor flags the provenance discrepancy.',
        detectionAndEvidence:
          'PyPI provenance attestation verification (PEP 740) and diffing published wheel contents against signed Git tags (git-pypi-diff).',
      },
      {
        stepNumber: 3,
        mitreId: 'T1496',
        plainTitle: 'Downstream AI Workstation & Colab Execution of XMRig Miner (/tmp/ultralytics_runner)',
        storyAnalogy:
          'When data scientists open the new AI toolkit, it quietly launches a cryptocurrency furnace in the basement and burns the instruction manual so nobody sees it on the shelf.',
        simpleExplanation:
          'When downstream ML pipelines or Google Colab notebooks installed ultralytics, importing the package triggered safe_download() in downloads.py to fetch a binary payload to /tmp/ultralytics_runner, mark it executable, launch it connecting to connect.consrensys.com:8080 (an XMRig Monero mining pool), and immediately call os.remove("/tmp/ultralytics_runner") (unlinking the file from /tmp on disk while the Linux kernel keeps the active process running in memory until termination).',
        howItWorksInPractice:
          'Although ls /tmp no longer shows ultralytics_runner, inspecting /proc/<pid>/exe on Linux reveals the symlink /tmp/ultralytics_runner (deleted) alongside outbound Stratum TCP traffic on port 8080. In the documented EventID 1 exchange from GitHub Actions (pull_request_target) to PyPI Registry (ultralytics 8.3.41/45), PyPI Registry (ultralytics 8.3.41/45) responds with ALERT 1 (confirming that the /tmp/ultralytics_runner -u 4BHRQ... -o connect.consrensys.com:8080 request succeeded on PyPI Registry (ultralytics 8.3.41/45) and completing the final execution objective of Ultralytics PyPI AI Package GitHub Actions PwnRequest & Token Compromise).',
        diagramAlignment:
          'Step #3 (#3→ / ⇠#3) traces the PyPI Registry wheel installation onto AI Training Cluster / Colab GPU Nodes and outbound Stratum mining traffic to the attacker pool.',
        detectionAndEvidence:
          'Linux EDR alerts for processes executing from /tmp/* (deleted) and outbound connections to connect.consrensys.com:8080.',
      },
    ],
  };
