#!/usr/bin/env bash
set -euo pipefail

# SignalOps Mobile — operational command center upgrade
# Run from the repository root:
#   bash apply-signalops-command-center-upgrade.sh

if [[ ! -f "package.json" ]] || ! grep -q '"name": "SignalOpsMobile"' package.json; then
  echo "Error: run this from the root of signalops-mobile."
  exit 1
fi

echo "==> Upgrading SignalOps into an incident-response command center"

mkdir -p \
  src/features/incidents/lib \
  .github/workflows

# ---------------------------------------------------------------------------
# 1. Rich incident domain model
# ---------------------------------------------------------------------------
cat > src/features/incidents/model/types.ts <<'EOF'
export type IncidentSeverity = 'P1' | 'P2' | 'P3';

export type IncidentStatus =
  | 'ongoing'
  | 'investigating'
  | 'monitoring'
  | 'resolved';

export type IncidentEventType =
  | 'detected'
  | 'acknowledged'
  | 'status-changed'
  | 'assignment'
  | 'note'
  | 'runbook'
  | 'resolved'
  | 'live-update';

export type IncidentTimelineEvent = {
  id: string;
  type: IncidentEventType;
  message: string;
  createdAt: string;
};

export type RunbookItem = {
  id: string;
  label: string;
  completed: boolean;
};

export type Incident = {
  id: string;
  title: string;
  summary: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  service: string;
  detectedAt: string;
  createdAt: string;
  owner: string;
  team: string;
  impact: string;
  affectedUsers: number;
  acknowledgedAt?: string;
  monitoringAt?: string;
  resolvedAt?: string;
  resolutionSummary?: string;
  runbook: RunbookItem[];
  timeline: IncidentTimelineEvent[];
};

export type CreateIncidentPayload = {
  id: string;
  title: string;
  summary: string;
  severity: IncidentSeverity;
  service: string;
  owner: string;
  team: string;
  impact: string;
  affectedUsers: number;
  createdAt: string;
};
EOF

# ---------------------------------------------------------------------------
# 2. Real operational calculations: SLA, metrics, service health, postmortem
# ---------------------------------------------------------------------------
cat > src/features/incidents/lib/operations.ts <<'EOF'
import type {
  Incident,
  IncidentSeverity,
} from '../model/types';

const slaMinutes: Record<
  IncidentSeverity,
  { acknowledge: number; resolve: number }
> = {
  P1: { acknowledge: 15, resolve: 120 },
  P2: { acknowledge: 30, resolve: 240 },
  P3: { acknowledge: 60, resolve: 480 },
};

export type IncidentSla = {
  acknowledgeTargetMinutes: number;
  resolutionTargetMinutes: number;
  minutesOpen: number;
  acknowledgeMinutes: number | null;
  resolutionMinutes: number | null;
  acknowledgeRemainingMinutes: number;
  resolutionRemainingMinutes: number;
  acknowledgeBreached: boolean;
  resolutionBreached: boolean;
};

function minutesBetween(
  start: string,
  endMs: number,
) {
  return Math.max(
    0,
    Math.round(
      (endMs - Date.parse(start)) / 60_000,
    ),
  );
}

export function getIncidentSla(
  incident: Incident,
  nowMs = Date.now(),
): IncidentSla {
  const target = slaMinutes[incident.severity];
  const createdMs = Date.parse(incident.createdAt);

  const acknowledgeEndMs = incident.acknowledgedAt
    ? Date.parse(incident.acknowledgedAt)
    : nowMs;

  const resolutionEndMs = incident.resolvedAt
    ? Date.parse(incident.resolvedAt)
    : nowMs;

  const minutesOpen = minutesBetween(
    incident.createdAt,
    resolutionEndMs,
  );

  const acknowledgeMinutes =
    incident.acknowledgedAt
      ? minutesBetween(
          incident.createdAt,
          acknowledgeEndMs,
        )
      : null;

  const resolutionMinutes =
    incident.resolvedAt
      ? minutesBetween(
          incident.createdAt,
          resolutionEndMs,
        )
      : null;

  const currentAckMinutes = minutesBetween(
    incident.createdAt,
    acknowledgeEndMs,
  );

  const currentResolutionMinutes = minutesBetween(
    incident.createdAt,
    resolutionEndMs,
  );

  return {
    acknowledgeTargetMinutes: target.acknowledge,
    resolutionTargetMinutes: target.resolve,
    minutesOpen,
    acknowledgeMinutes,
    resolutionMinutes,
    acknowledgeRemainingMinutes:
      target.acknowledge - currentAckMinutes,
    resolutionRemainingMinutes:
      target.resolve - currentResolutionMinutes,
    acknowledgeBreached:
      currentAckMinutes > target.acknowledge,
    resolutionBreached:
      currentResolutionMinutes > target.resolve,
  };
}

export function formatDuration(minutes: number) {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  return remaining === 0
    ? `${hours}h`
    : `${hours}h ${remaining}m`;
}

export function getOperationalMetrics(
  incidents: Incident[],
  nowMs = Date.now(),
) {
  const active = incidents.filter(
    incident => incident.status !== 'resolved',
  );

  const resolved = incidents.filter(
    incident => incident.status === 'resolved',
  );

  const critical = active.filter(
    incident => incident.severity === 'P1',
  ).length;

  const breached = active.filter(incident => {
    const sla = getIncidentSla(incident, nowMs);

    return (
      (!incident.acknowledgedAt &&
        sla.acknowledgeBreached) ||
      sla.resolutionBreached
    );
  }).length;

  const acknowledged = incidents.filter(
    incident => incident.acknowledgedAt,
  );

  const mtta =
    acknowledged.length === 0
      ? 0
      : Math.round(
          acknowledged.reduce((sum, incident) => {
            const value = getIncidentSla(
              incident,
              nowMs,
            ).acknowledgeMinutes;

            return sum + (value ?? 0);
          }, 0) / acknowledged.length,
        );

  const mttr =
    resolved.length === 0
      ? 0
      : Math.round(
          resolved.reduce((sum, incident) => {
            const value = getIncidentSla(
              incident,
              nowMs,
            ).resolutionMinutes;

            return sum + (value ?? 0);
          }, 0) / resolved.length,
        );

  return {
    active: active.length,
    resolved: resolved.length,
    critical,
    breached,
    mtta,
    mttr,
  };
}

export type ServiceHealthStatus =
  | 'healthy'
  | 'degraded'
  | 'down';

export type DerivedServiceHealth = {
  service: string;
  status: ServiceHealthStatus;
  activeIncidentCount: number;
  highestSeverity?: IncidentSeverity;
};

const severityWeight: Record<IncidentSeverity, number> = {
  P1: 3,
  P2: 2,
  P3: 1,
};

export function deriveServiceHealth(
  incidents: Incident[],
): DerivedServiceHealth[] {
  const services = Array.from(
    new Set(
      incidents.map(incident => incident.service),
    ),
  );

  return services
    .map(service => {
      const active = incidents.filter(
        incident =>
          incident.service === service &&
          incident.status !== 'resolved',
      );

      const highestSeverity = active
        .map(incident => incident.severity)
        .sort(
          (a, b) =>
            severityWeight[b] - severityWeight[a],
        )[0];

      const status: ServiceHealthStatus =
        highestSeverity === 'P1'
          ? 'down'
          : highestSeverity
            ? 'degraded'
            : 'healthy';

      return {
        service,
        status,
        activeIncidentCount: active.length,
        highestSeverity,
      };
    })
    .sort((first, second) => {
      const statusWeight: Record<
        ServiceHealthStatus,
        number
      > = {
        down: 3,
        degraded: 2,
        healthy: 1,
      };

      return (
        statusWeight[second.status] -
        statusWeight[first.status]
      );
    });
}

export function generatePostmortem(
  incident: Incident,
) {
  const sla = getIncidentSla(incident);

  const timeline = [...incident.timeline]
    .reverse()
    .map(
      event =>
        `- ${new Date(
          event.createdAt,
        ).toLocaleString()}: ${event.message}`,
    )
    .join('\n');

  const runbookDone = incident.runbook.filter(
    item => item.completed,
  ).length;

  return [
    `SignalOps Incident Report — ${incident.id}`,
    '',
    `Title: ${incident.title}`,
    `Severity: ${incident.severity}`,
    `Service: ${incident.service}`,
    `Status: ${incident.status}`,
    `Owner: ${incident.owner}`,
    `Team: ${incident.team}`,
    `Impact: ${incident.impact}`,
    `Affected users: ${incident.affectedUsers.toLocaleString()}`,
    '',
    `Time to acknowledge: ${
      sla.acknowledgeMinutes === null
        ? 'Not acknowledged'
        : formatDuration(sla.acknowledgeMinutes)
    }`,
    `Time to resolve: ${
      sla.resolutionMinutes === null
        ? 'Not resolved'
        : formatDuration(sla.resolutionMinutes)
    }`,
    `Runbook completed: ${runbookDone}/${incident.runbook.length}`,
    '',
    'Resolution summary:',
    incident.resolutionSummary ||
      'No resolution summary was recorded.',
    '',
    'Timeline:',
    timeline || '- No timeline events',
  ].join('\n');
}
EOF

# ---------------------------------------------------------------------------
# 3. Upgrade sample data with ownership, timestamps, impact, runbooks
# ---------------------------------------------------------------------------
cat > src/features/incidents/data/mockIncidents.ts <<'EOF'
import type {
  Incident,
  IncidentTimelineEvent,
  RunbookItem,
} from '../model/types';

function isoMinutesAgo(minutes: number) {
  return new Date(
    Date.now() - minutes * 60_000,
  ).toISOString();
}

function createRunbook(): RunbookItem[] {
  return [
    {
      id: 'verify-monitoring',
      label: 'Verify monitoring signal',
      completed: true,
    },
    {
      id: 'check-deployments',
      label: 'Check recent deployments',
      completed: false,
    },
    {
      id: 'notify-stakeholders',
      label: 'Notify stakeholders',
      completed: false,
    },
    {
      id: 'apply-mitigation',
      label: 'Apply mitigation',
      completed: false,
    },
    {
      id: 'monitor-recovery',
      label: 'Monitor recovery',
      completed: false,
    },
  ];
}

function createDetectedEvent(
  incidentId: string,
  createdAt: string,
): IncidentTimelineEvent {
  return {
    id: `${incidentId}-detected`,
    type: 'detected',
    message: 'Incident detected by monitoring rules.',
    createdAt,
  };
}

const incident1CreatedAt = isoMinutesAgo(8);
const incident2CreatedAt = isoMinutesAgo(34);
const incident3CreatedAt = isoMinutesAgo(78);
const incident4CreatedAt = isoMinutesAgo(150);
const incident5CreatedAt = isoMinutesAgo(320);

export const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Checkout latency spike',
    summary:
      'Checkout requests are taking longer than the configured performance threshold.',
    severity: 'P1',
    status: 'ongoing',
    service: 'Checkout API',
    detectedAt: '8 minutes ago',
    createdAt: incident1CreatedAt,
    owner: 'Unassigned',
    team: 'Commerce',
    impact: 'Customers may experience slow checkout confirmation.',
    affectedUsers: 1840,
    runbook: createRunbook(),
    timeline: [
      createDetectedEvent(
        'INC-2026-001',
        incident1CreatedAt,
      ),
    ],
  },
  {
    id: 'INC-2026-002',
    title: 'Payment gateway timeouts',
    summary:
      'Some payment requests are timing out before receiving a gateway response.',
    severity: 'P2',
    status: 'investigating',
    service: 'Payments',
    detectedAt: '34 minutes ago',
    createdAt: incident2CreatedAt,
    acknowledgedAt: isoMinutesAgo(22),
    owner: 'Alex Morgan',
    team: 'Payments',
    impact: 'A subset of card payments require retry.',
    affectedUsers: 620,
    runbook: createRunbook().map(item =>
      item.id === 'check-deployments'
        ? { ...item, completed: true }
        : item,
    ),
    timeline: [
      {
        id: 'INC-2026-002-ack',
        type: 'acknowledged',
        message: 'Alex Morgan acknowledged the incident.',
        createdAt: isoMinutesAgo(22),
      },
      createDetectedEvent(
        'INC-2026-002',
        incident2CreatedAt,
      ),
    ],
  },
  {
    id: 'INC-2026-003',
    title: 'Search responses are slow',
    summary:
      'Search response time has increased for users in multiple regions.',
    severity: 'P3',
    status: 'monitoring',
    service: 'Search Service',
    detectedAt: '78 minutes ago',
    createdAt: incident3CreatedAt,
    acknowledgedAt: isoMinutesAgo(62),
    monitoringAt: isoMinutesAgo(18),
    owner: 'Sam Lee',
    team: 'Discovery',
    impact: 'Search results load more slowly than the target latency.',
    affectedUsers: 430,
    runbook: createRunbook().map(item => ({
      ...item,
      completed:
        item.id !== 'monitor-recovery',
    })),
    timeline: [
      {
        id: 'INC-2026-003-monitor',
        type: 'status-changed',
        message: 'Sam Lee moved the incident to monitoring.',
        createdAt: isoMinutesAgo(18),
      },
      {
        id: 'INC-2026-003-ack',
        type: 'acknowledged',
        message: 'Sam Lee acknowledged the incident.',
        createdAt: isoMinutesAgo(62),
      },
      createDetectedEvent(
        'INC-2026-003',
        incident3CreatedAt,
      ),
    ],
  },
  {
    id: 'INC-2026-004',
    title: 'Email delivery delays',
    summary:
      'Transactional emails are being delivered later than expected.',
    severity: 'P3',
    status: 'monitoring',
    service: 'Notification Worker',
    detectedAt: '2h 30m ago',
    createdAt: incident4CreatedAt,
    acknowledgedAt: isoMinutesAgo(128),
    monitoringAt: isoMinutesAgo(45),
    owner: 'Priya Shah',
    team: 'Messaging',
    impact: 'Password-reset and receipt emails may arrive late.',
    affectedUsers: 210,
    runbook: createRunbook(),
    timeline: [
      {
        id: 'INC-2026-004-monitor',
        type: 'status-changed',
        message:
          'Priya Shah moved the incident to monitoring.',
        createdAt: isoMinutesAgo(45),
      },
      createDetectedEvent(
        'INC-2026-004',
        incident4CreatedAt,
      ),
    ],
  },
  {
    id: 'INC-2026-005',
    title: 'User profile update errors',
    summary:
      'A small percentage of profile updates were failing validation.',
    severity: 'P2',
    status: 'resolved',
    service: 'User Service',
    detectedAt: '5h 20m ago',
    createdAt: incident5CreatedAt,
    acknowledgedAt: isoMinutesAgo(300),
    monitoringAt: isoMinutesAgo(235),
    resolvedAt: isoMinutesAgo(205),
    owner: 'Jordan Kim',
    team: 'Identity',
    impact: 'Some users could not save profile changes.',
    affectedUsers: 96,
    resolutionSummary:
      'Rolled back the validation rule and confirmed normal profile update success rates.',
    runbook: createRunbook().map(item => ({
      ...item,
      completed: true,
    })),
    timeline: [
      {
        id: 'INC-2026-005-resolved',
        type: 'resolved',
        message:
          'Jordan Kim resolved the incident after rollback validation.',
        createdAt: isoMinutesAgo(205),
      },
      createDetectedEvent(
        'INC-2026-005',
        incident5CreatedAt,
      ),
    ],
  },
];
EOF

# ---------------------------------------------------------------------------
# 4. Reducer: creation, full lifecycle, assignment, notes, runbook, hydration
# ---------------------------------------------------------------------------
cat > src/features/incidents/incidentsSlice.ts <<'EOF'
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

import { mockIncidents } from './data/mockIncidents';
import type {
  CreateIncidentPayload,
  Incident,
  IncidentEventType,
  IncidentStatus,
} from './model/types';

type IncidentsState = {
  items: Incident[];
  simulationCursor: number;
};

type StatusUpdatePayload = {
  incidentId: string;
  status: IncidentStatus;
  eventId: string;
  changedAt: string;
  actor: string;
  resolutionSummary?: string;
};

type SimulationPayload = {
  eventId: string;
  receivedAt: string;
};

type NotePayload = {
  incidentId: string;
  note: string;
  eventId: string;
  createdAt: string;
  actor: string;
};

type AssignmentPayload = {
  incidentId: string;
  owner: string;
  team: string;
  eventId: string;
  createdAt: string;
};

type RunbookPayload = {
  incidentId: string;
  runbookItemId: string;
  eventId: string;
  createdAt: string;
  actor: string;
};

const initialState: IncidentsState = {
  items: mockIncidents,
  simulationCursor: 0,
};

function getEventType(
  status: IncidentStatus,
): IncidentEventType {
  switch (status) {
    case 'investigating':
      return 'acknowledged';

    case 'resolved':
      return 'resolved';

    default:
      return 'status-changed';
  }
}

function getStatusMessage(
  status: IncidentStatus,
  actor: string,
) {
  switch (status) {
    case 'investigating':
      return `${actor} acknowledged the incident.`;

    case 'monitoring':
      return `${actor} moved the incident to monitoring.`;

    case 'resolved':
      return `${actor} resolved the incident.`;

    default:
      return `${actor} updated the incident.`;
  }
}

function buildDefaultRunbook() {
  return [
    {
      id: 'verify-monitoring',
      label: 'Verify monitoring signal',
      completed: false,
    },
    {
      id: 'check-deployments',
      label: 'Check recent deployments',
      completed: false,
    },
    {
      id: 'notify-stakeholders',
      label: 'Notify stakeholders',
      completed: false,
    },
    {
      id: 'apply-mitigation',
      label: 'Apply mitigation',
      completed: false,
    },
    {
      id: 'monitor-recovery',
      label: 'Monitor recovery',
      completed: false,
    },
  ];
}

const incidentsSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    hydrateIncidents: (
      state,
      action: PayloadAction<Incident[]>,
    ) => {
      if (action.payload.length > 0) {
        state.items = action.payload;
      }
    },

    resetIncidents: state => {
      state.items = mockIncidents;
      state.simulationCursor = 0;
    },

    createIncident: (
      state,
      action: PayloadAction<CreateIncidentPayload>,
    ) => {
      const payload = action.payload;

      state.items.unshift({
        ...payload,
        status: 'ongoing',
        detectedAt: 'Just now',
        runbook: buildDefaultRunbook(),
        timeline: [
          {
            id: `${payload.id}-detected`,
            type: 'detected',
            message:
              'Incident created in the SignalOps command center.',
            createdAt: payload.createdAt,
          },
        ],
      });
    },

    updateIncidentStatus: (
      state,
      action: PayloadAction<StatusUpdatePayload>,
    ) => {
      const incident = state.items.find(
        item => item.id === action.payload.incidentId,
      );

      if (
        !incident ||
        incident.status === action.payload.status
      ) {
        return;
      }

      incident.status = action.payload.status;

      if (
        action.payload.status === 'investigating' &&
        !incident.acknowledgedAt
      ) {
        incident.acknowledgedAt =
          action.payload.changedAt;
      }

      if (action.payload.status === 'monitoring') {
        incident.monitoringAt =
          action.payload.changedAt;
      }

      if (action.payload.status === 'resolved') {
        incident.resolvedAt =
          action.payload.changedAt;
        incident.resolutionSummary =
          action.payload.resolutionSummary ||
          incident.resolutionSummary ||
          'Incident resolved after mitigation and monitoring.';
      }

      incident.timeline.unshift({
        id: action.payload.eventId,
        type: getEventType(action.payload.status),
        message: getStatusMessage(
          action.payload.status,
          action.payload.actor,
        ),
        createdAt: action.payload.changedAt,
      });
    },

    addIncidentNote: (
      state,
      action: PayloadAction<NotePayload>,
    ) => {
      const incident = state.items.find(
        item => item.id === action.payload.incidentId,
      );

      if (!incident) {
        return;
      }

      incident.timeline.unshift({
        id: action.payload.eventId,
        type: 'note',
        message: `${action.payload.actor}: ${action.payload.note}`,
        createdAt: action.payload.createdAt,
      });
    },

    assignIncident: (
      state,
      action: PayloadAction<AssignmentPayload>,
    ) => {
      const incident = state.items.find(
        item => item.id === action.payload.incidentId,
      );

      if (!incident) {
        return;
      }

      incident.owner = action.payload.owner;
      incident.team = action.payload.team;

      incident.timeline.unshift({
        id: action.payload.eventId,
        type: 'assignment',
        message: `Incident assigned to ${action.payload.owner} · ${action.payload.team}.`,
        createdAt: action.payload.createdAt,
      });
    },

    toggleRunbookItem: (
      state,
      action: PayloadAction<RunbookPayload>,
    ) => {
      const incident = state.items.find(
        item => item.id === action.payload.incidentId,
      );

      if (!incident) {
        return;
      }

      const runbookItem = incident.runbook.find(
        item =>
          item.id === action.payload.runbookItemId,
      );

      if (!runbookItem) {
        return;
      }

      runbookItem.completed =
        !runbookItem.completed;

      incident.timeline.unshift({
        id: action.payload.eventId,
        type: 'runbook',
        message: `${action.payload.actor} ${
          runbookItem.completed
            ? 'completed'
            : 'reopened'
        } runbook step: ${runbookItem.label}.`,
        createdAt: action.payload.createdAt,
      });
    },

    simulateIncidentUpdate: (
      state,
      action: PayloadAction<SimulationPayload>,
    ) => {
      const activeIncidentIndexes = state.items
        .map((incident, index) => ({
          incident,
          index,
        }))
        .filter(
          item => item.incident.status !== 'resolved',
        );

      if (activeIncidentIndexes.length === 0) {
        return;
      }

      const candidate =
        activeIncidentIndexes[
          state.simulationCursor %
            activeIncidentIndexes.length
        ];

      const incident = state.items[candidate.index];

      incident.detectedAt = 'Just now';

      incident.timeline.unshift({
        id: action.payload.eventId,
        type: 'live-update',
        message:
          'A new monitoring signal was received for this incident.',
        createdAt: action.payload.receivedAt,
      });

      const [updatedIncident] = state.items.splice(
        candidate.index,
        1,
      );

      state.items.unshift(updatedIncident);
      state.simulationCursor += 1;
    },
  },
});

export const {
  addIncidentNote,
  assignIncident,
  createIncident,
  hydrateIncidents,
  resetIncidents,
  simulateIncidentUpdate,
  toggleRunbookItem,
  updateIncidentStatus,
} = incidentsSlice.actions;

export default incidentsSlice.reducer;
EOF

# ---------------------------------------------------------------------------
# 5. Persist the entire incident workspace
# ---------------------------------------------------------------------------
cat > src/shared/storage/appStorage.ts <<'EOF'
import {
  createAsyncStorage,
} from '@react-native-async-storage/async-storage';

export const appStorage =
  createAsyncStorage('signalOpsDatabase');

export const storageKeys = {
  preferences: 'preferences',
  incidents: 'incidents-v2',
} as const;
EOF

cat > src/app/hooks/usePersistedIncidents.ts <<'EOF'
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  useAppDispatch,
  useAppSelector,
} from '../store/hooks';
import {
  hydrateIncidents,
} from '../../features/incidents/incidentsSlice';
import type {
  Incident,
} from '../../features/incidents/model/types';
import {
  appStorage,
  storageKeys,
} from '../../shared/storage/appStorage';

type WorkspaceStatus =
  | 'loading'
  | 'ready'
  | 'error';

function isStoredIncidentArray(
  value: unknown,
): value is Incident[] {
  return (
    Array.isArray(value) &&
    value.every(
      item =>
        typeof item === 'object' &&
        item !== null &&
        'id' in item &&
        'title' in item &&
        'status' in item &&
        'timeline' in item,
    )
  );
}

export function usePersistedIncidents() {
  const dispatch = useAppDispatch();
  const incidents = useAppSelector(
    state => state.incidents.items,
  );

  const [status, setStatus] =
    useState<WorkspaceStatus>('loading');
  const [error, setError] = useState<
    string | undefined
  >();
  const [loadAttempt, setLoadAttempt] =
    useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadWorkspace() {
      setStatus('loading');
      setError(undefined);

      try {
        const storedValue =
          await appStorage.getItem(
            storageKeys.incidents,
          );

        if (cancelled) {
          return;
        }

        if (storedValue) {
          const parsed: unknown =
            JSON.parse(storedValue);

          if (isStoredIncidentArray(parsed)) {
            dispatch(hydrateIncidents(parsed));
          }
        }

        setStatus('ready');
      } catch {
        if (cancelled) {
          return;
        }

        setError(
          'SignalOps could not load the saved incident workspace.',
        );
        setStatus('error');
      }
    }

    void loadWorkspace();

    return () => {
      cancelled = true;
    };
  }, [dispatch, loadAttempt]);

  useEffect(() => {
    if (status !== 'ready') {
      return;
    }

    void appStorage
      .setItem(
        storageKeys.incidents,
        JSON.stringify(incidents),
      )
      .catch(storageError => {
        console.warn(
          'Unable to save the SignalOps incident workspace.',
          storageError,
        );
      });
  }, [incidents, status]);

  const retry = useCallback(() => {
    setLoadAttempt(current => current + 1);
  }, []);

  return {
    status,
    error,
    retry,
  };
}
EOF

cat > src/app/AppRoot.tsx <<'EOF'
import React from 'react';
import { StatusBar } from 'react-native';
import {
  NavigationContainer,
} from '@react-navigation/native';
import { Provider } from 'react-redux';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';

import { colors } from '../design-system/theme/colors';
import { navigationTheme } from '../design-system/theme/navigationTheme';
import { useIncidentSimulation } from '../features/incidents/hooks/useIncidentSimulation';
import { AppBootstrapScreen } from '../shared/components/app/AppBootstrapScreen';
import { usePersistedIncidents } from './hooks/usePersistedIncidents';
import { usePersistedPreferences } from './hooks/usePersistedPreferences';
import { RootNavigator } from './navigation/RootNavigator';
import { store } from './store/store';

function AppContent() {
  const preferences =
    usePersistedPreferences();
  const workspace =
    usePersistedIncidents();

  useIncidentSimulation();

  const loading =
    preferences.status === 'loading' ||
    workspace.status === 'loading';

  if (loading) {
    return <AppBootstrapScreen />;
  }

  if (preferences.status === 'error') {
    return (
      <AppBootstrapScreen
        error={preferences.error}
        onRetry={preferences.retry}
      />
    );
  }

  if (workspace.status === 'error') {
    return (
      <AppBootstrapScreen
        error={workspace.error}
        onRetry={workspace.retry}
      />
    );
  }

  return (
    <NavigationContainer
      theme={navigationTheme}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle="light-content"
      />

      <RootNavigator />
    </NavigationContainer>
  );
}

export function AppRoot() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </Provider>
  );
}
EOF

# ---------------------------------------------------------------------------
# 6. Create Incident workflow
# ---------------------------------------------------------------------------
cat > src/features/incidents/screens/CreateIncidentScreen.tsx <<'EOF'
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../../../app/navigation/types';
import {
  useAppDispatch,
} from '../../../app/store/hooks';
import { colors } from '../../../design-system/theme/colors';
import { spacing } from '../../../design-system/theme/spacing';
import { Screen } from '../../../shared/components/Screen';
import {
  createIncident,
} from '../incidentsSlice';
import type {
  IncidentSeverity,
} from '../model/types';

type Navigation =
  NativeStackNavigationProp<RootStackParamList>;

const severities: IncidentSeverity[] = [
  'P1',
  'P2',
  'P3',
];

export function CreateIncidentScreen() {
  const dispatch = useAppDispatch();
  const navigation = useNavigation<Navigation>();

  const [title, setTitle] = useState('');
  const [service, setService] = useState('');
  const [summary, setSummary] = useState('');
  const [impact, setImpact] = useState('');
  const [owner, setOwner] =
    useState('On-call engineer');
  const [team, setTeam] =
    useState('Platform');
  const [affectedUsers, setAffectedUsers] =
    useState('0');
  const [severity, setSeverity] =
    useState<IncidentSeverity>('P2');

  const canSubmit = useMemo(
    () =>
      title.trim().length >= 4 &&
      service.trim().length >= 2 &&
      summary.trim().length >= 8 &&
      impact.trim().length >= 8,
    [impact, service, summary, title],
  );

  const submit = () => {
    if (!canSubmit) {
      return;
    }

    const now = new Date().toISOString();
    const suffix = String(Date.now()).slice(-6);
    const incidentId = `INC-2026-${suffix}`;

    dispatch(
      createIncident({
        id: incidentId,
        title: title.trim(),
        service: service.trim(),
        summary: summary.trim(),
        impact: impact.trim(),
        owner: owner.trim() || 'Unassigned',
        team: team.trim() || 'Platform',
        severity,
        affectedUsers:
          Number.parseInt(affectedUsers, 10) || 0,
        createdAt: now,
      }),
    );

    navigation.replace('IncidentDetails', {
      incidentId,
    });
  };

  return (
    <Screen
      title="Create incident"
      subtitle="Start an operational response with ownership and impact."
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.label}>
          Severity
        </Text>

        <View style={styles.severityRow}>
          {severities.map(item => (
            <Pressable
              accessibilityRole="button"
              key={item}
              onPress={() => setSeverity(item)}
              style={[
                styles.severityButton,
                severity === item &&
                  styles.severityButtonActive,
              ]}
            >
              <Text
                style={[
                  styles.severityText,
                  severity === item &&
                    styles.severityTextActive,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        <Field
          label="Incident title"
          value={title}
          onChangeText={setTitle}
          placeholder="Checkout error rate spike"
        />

        <Field
          label="Affected service"
          value={service}
          onChangeText={setService}
          placeholder="Checkout API"
        />

        <Field
          label="Summary"
          value={summary}
          onChangeText={setSummary}
          placeholder="Describe what monitoring or users are reporting."
          multiline
        />

        <Field
          label="Customer impact"
          value={impact}
          onChangeText={setImpact}
          placeholder="Describe the user-facing impact."
          multiline
        />

        <View style={styles.twoColumns}>
          <View style={styles.column}>
            <Field
              label="Owner"
              value={owner}
              onChangeText={setOwner}
              placeholder="On-call engineer"
            />
          </View>

          <View style={styles.column}>
            <Field
              label="Team"
              value={team}
              onChangeText={setTeam}
              placeholder="Platform"
            />
          </View>
        </View>

        <Field
          label="Affected users"
          value={affectedUsers}
          onChangeText={setAffectedUsers}
          placeholder="0"
          keyboardType="number-pad"
        />

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>
            Operational workflow
          </Text>
          <Text style={styles.infoBody}>
            A runbook, SLA targets and incident timeline
            will be created automatically.
          </Text>
        </View>

        <Pressable
          accessibilityRole="button"
          disabled={!canSubmit}
          onPress={submit}
          style={({ pressed }) => [
            styles.submitButton,
            !canSubmit && styles.disabled,
            pressed && canSubmit && styles.pressed,
          ]}
        >
          <Text style={styles.submitLabel}>
            Create incident
          </Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
};

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  keyboardType = 'default',
}: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        accessibilityLabel={label}
        keyboardType={keyboardType}
        multiline={multiline}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={[
          styles.input,
          multiline && styles.multilineInput,
        ]}
        value={value}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  field: {
    marginTop: spacing.lg,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 14,
    minHeight: 50,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  multilineInput: {
    minHeight: 104,
    textAlignVertical: 'top',
  },
  severityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  severityButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  severityButtonActive: {
    backgroundColor: `${colors.accent}20`,
    borderColor: colors.accent,
  },
  severityText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '800',
  },
  severityTextActive: {
    color: colors.accent,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  column: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: spacing.xl,
    padding: spacing.lg,
  },
  infoTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  infoBody: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.xs,
  },
  submitButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: spacing.lg,
    minHeight: 54,
  },
  submitLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '800',
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
EOF

# ---------------------------------------------------------------------------
# 7. Navigation for Create Incident
# ---------------------------------------------------------------------------
cat > src/app/navigation/types.ts <<'EOF'
export type MainTabParamList = {
  Overview: undefined;
  Incidents: undefined;
  Activity: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;

  IncidentDetails: {
    incidentId: string;
  };

  CreateIncident: undefined;
};
EOF

cat > src/app/navigation/RootNavigator.tsx <<'EOF'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { colors } from '../../design-system/theme/colors';
import { CreateIncidentScreen } from '../../features/incidents/screens/CreateIncidentScreen';
import { IncidentDetailsScreen } from '../../features/incidents/screens/IncidentDetailsScreen';

import { MainTabs } from './MainTabs';
import type { RootStackParamList } from './types';

const Stack =
  createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.textPrimary,
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="IncidentDetails"
        component={IncidentDetailsScreen}
        options={{
          title: 'Incident command',
        }}
      />

      <Stack.Screen
        name="CreateIncident"
        component={CreateIncidentScreen}
        options={{
          title: 'Create incident',
        }}
      />
    </Stack.Navigator>
  );
}
EOF

# ---------------------------------------------------------------------------
# 8. Dynamic service health
# ---------------------------------------------------------------------------
cat > src/features/overview/components/ServiceHealthCard.tsx <<'EOF'
import React, { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../../design-system/theme/colors';
import { spacing } from '../../../design-system/theme/spacing';
import type { Incident } from '../../incidents/model/types';
import {
  deriveServiceHealth,
  type ServiceHealthStatus,
} from '../../incidents/lib/operations';

const statusColors: Record<
  ServiceHealthStatus,
  string
> = {
  healthy: colors.success,
  degraded: colors.warning,
  down: colors.danger,
};

const statusLabels: Record<
  ServiceHealthStatus,
  string
> = {
  healthy: 'Healthy',
  degraded: 'Degraded',
  down: 'Critical',
};

type Props = {
  incidents: Incident[];
};

export const ServiceHealthCard = React.memo(
  function ServiceHealthCard({
    incidents,
  }: Props) {
    const services = useMemo(
      () => deriveServiceHealth(incidents),
      [incidents],
    );

    return (
      <View style={styles.card}>
        {services.map(service => {
          const statusColor =
            statusColors[service.status];

          return (
            <View
              key={service.service}
              style={styles.serviceRow}
            >
              <View style={styles.rowHeader}>
                <View style={styles.nameContainer}>
                  <View
                    style={[
                      styles.statusDot,
                      {
                        backgroundColor: statusColor,
                      },
                    ]}
                  />

                  <View>
                    <Text style={styles.serviceName}>
                      {service.service}
                    </Text>

                    <Text style={styles.serviceMeta}>
                      {service.activeIncidentCount === 0
                        ? 'No active incidents'
                        : `${service.activeIncidentCount} active · ${service.highestSeverity}`}
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.status,
                    { color: statusColor },
                  ]}
                >
                  {statusLabels[service.status]}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.lg,
  },
  serviceRow: {
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingVertical: spacing.md,
  },
  rowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    paddingRight: spacing.md,
  },
  statusDot: {
    borderRadius: 5,
    height: 10,
    marginRight: spacing.md,
    width: 10,
  },
  serviceName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  serviceMeta: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  status: {
    fontSize: 12,
    fontWeight: '800',
  },
});
EOF

# ---------------------------------------------------------------------------
# 9. Overview: meaningful operational metrics + create workflow
# ---------------------------------------------------------------------------
cat > src/features/overview/screens/OverviewScreen.tsx <<'EOF'
import React, {
  useCallback,
  useMemo,
} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../../../app/navigation/types';
import { useAppSelector } from '../../../app/store/hooks';
import { colors } from '../../../design-system/theme/colors';
import { spacing } from '../../../design-system/theme/spacing';
import { IncidentListItem } from '../../incidents/components/IncidentListItem';
import {
  formatDuration,
  getOperationalMetrics,
} from '../../incidents/lib/operations';
import type { Incident } from '../../incidents/model/types';
import { Screen } from '../../../shared/components/Screen';
import { MetricCard } from '../components/MetricCard';
import { ServiceHealthCard } from '../components/ServiceHealthCard';

type Navigation =
  NativeStackNavigationProp<RootStackParamList>;

export function OverviewScreen() {
  const navigation = useNavigation<Navigation>();

  const incidents = useAppSelector(
    state => state.incidents.items,
  );

  const metrics = useMemo(
    () => getOperationalMetrics(incidents),
    [incidents],
  );

  const recentIncidents = useMemo(
    () => incidents.slice(0, 4),
    [incidents],
  );

  const openIncident = useCallback(
    (incidentId: string) => {
      navigation.navigate('IncidentDetails', {
        incidentId,
      });
    },
    [navigation],
  );

  const renderIncident: ListRenderItem<Incident> =
    useCallback(
      ({ item }) => (
        <IncidentListItem
          incident={item}
          onPress={openIncident}
        />
      ),
      [openIncident],
    );

  const keyExtractor = useCallback(
    (item: Incident) => item.id,
    [],
  );

  const dashboardHeader = useMemo(
    () => (
      <View>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.sectionTitle}>
              Operations
            </Text>
            <Text style={styles.sectionSubtitle}>
              Live incident workspace
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() =>
              navigation.navigate('CreateIncident')
            }
            style={styles.createButton}
          >
            <Text style={styles.createButtonLabel}>
              + New incident
            </Text>
          </Pressable>
        </View>

        <View style={styles.metricsRow}>
          <MetricCard
            label="Active"
            value={metrics.active}
            tone="danger"
          />

          <MetricCard
            label="P1 critical"
            value={metrics.critical}
            tone="danger"
          />
        </View>

        <View style={styles.metricsRowSecondary}>
          <MetricCard
            label="SLA breached"
            value={metrics.breached}
            tone={
              metrics.breached > 0
                ? 'danger'
                : 'success'
            }
          />

          <MetricCard
            label="MTTR"
            value={formatDuration(metrics.mttr)}
            tone="success"
          />
        </View>

        <Text style={styles.sectionTitle}>
          Service health
        </Text>

        <Text style={styles.sectionSubtitle}>
          Derived from active incident severity
        </Text>

        <ServiceHealthCard
          incidents={incidents}
        />

        <Text style={styles.sectionTitle}>
          Recent incidents
        </Text>
      </View>
    ),
    [incidents, metrics, navigation],
  );

  return (
    <Screen
      title="SignalOps"
      subtitle="Incident response command center."
    >
      <FlatList
        data={recentIncidents}
        renderItem={renderIncident}
        keyExtractor={keyExtractor}
        ListHeaderComponent={dashboardHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={5}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: spacing.xxl,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  sectionSubtitle: {
    color: colors.textMuted,
    fontSize: 12,
    marginBottom: spacing.md,
  },
  createButton: {
    backgroundColor: colors.accent,
    borderRadius: 11,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  createButtonLabel: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '800',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  metricsRowSecondary: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
EOF

# ---------------------------------------------------------------------------
# 10. Incidents list: add New Incident entry point
# ---------------------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

path = Path("src/features/incidents/screens/IncidentsScreen.tsx")
text = path.read_text()

text = text.replace(
    """  FlatList,
  StyleSheet,
  Text,
  View,""",
    """  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,""",
)

old = """  const listHeader = useMemo(
    () => (
      <IncidentFilters
        query={query}
        selectedSeverity={selectedSeverity}
        onQueryChange={setQuery}
        onSeverityChange={setSelectedSeverity}
      />
    ),
    [query, selectedSeverity],
  );"""

new = """  const listHeader = useMemo(
    () => (
      <View>
        <Pressable
          accessibilityRole="button"
          onPress={() =>
            navigation.navigate('CreateIncident')
          }
          style={styles.createButton}
        >
          <Text style={styles.createButtonLabel}>
            + Create incident
          </Text>
        </Pressable>

        <IncidentFilters
          query={query}
          selectedSeverity={selectedSeverity}
          onQueryChange={setQuery}
          onSeverityChange={setSelectedSeverity}
        />
      </View>
    ),
    [navigation, query, selectedSeverity],
  );"""

if old not in text:
    raise SystemExit(
        "Could not find IncidentsScreen listHeader block."
    )

text = text.replace(old, new)

style_anchor = """const styles = StyleSheet.create({
  content: {"""

style_new = """const styles = StyleSheet.create({
  createButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.accent,
    borderRadius: 11,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  createButtonLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  content: {"""

text = text.replace(style_anchor, style_new)

path.write_text(text)
PY

# ---------------------------------------------------------------------------
# 11. Incident command center detail screen
# ---------------------------------------------------------------------------
cat > src/features/incidents/screens/IncidentDetailsScreen.tsx <<'EOF'
import React, { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type {
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../../../app/navigation/types';
import {
  useAppDispatch,
  useAppSelector,
} from '../../../app/store/hooks';
import { colors } from '../../../design-system/theme/colors';
import { spacing } from '../../../design-system/theme/spacing';
import { Screen } from '../../../shared/components/Screen';
import {
  addIncidentNote,
  assignIncident,
  toggleRunbookItem,
  updateIncidentStatus,
} from '../incidentsSlice';
import {
  formatDuration,
  generatePostmortem,
  getIncidentSla,
} from '../lib/operations';
import type {
  IncidentStatus,
  IncidentTimelineEvent,
} from '../model/types';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'IncidentDetails'
>;

const actor = 'On-call engineer';

function formatTimestamp(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function TimelineItem({
  event,
}: {
  event: IncidentTimelineEvent;
}) {
  return (
    <View style={styles.timelineItem}>
      <View style={styles.timelineRail}>
        <View style={styles.timelineDot} />
        <View style={styles.timelineLine} />
      </View>

      <View style={styles.timelineContent}>
        <Text style={styles.timelineMessage}>
          {event.message}
        </Text>

        <Text style={styles.timelineTime}>
          {formatTimestamp(event.createdAt)}
        </Text>
      </View>
    </View>
  );
}

export function IncidentDetailsScreen({
  route,
}: Props) {
  const dispatch = useAppDispatch();
  const [note, setNote] = useState('');
  const [resolutionSummary, setResolutionSummary] =
    useState('');

  const incident = useAppSelector(state =>
    state.incidents.items.find(
      item => item.id === route.params.incidentId,
    ),
  );

  const sla = useMemo(
    () =>
      incident
        ? getIncidentSla(incident)
        : null,
    [incident],
  );

  const changeStatus = (
    status: IncidentStatus,
  ) => {
    if (!incident) {
      return;
    }

    const now = new Date().toISOString();

    dispatch(
      updateIncidentStatus({
        incidentId: incident.id,
        status,
        eventId: `${incident.id}-${Date.now()}`,
        changedAt: now,
        actor,
        resolutionSummary:
          status === 'resolved'
            ? resolutionSummary.trim() ||
              undefined
            : undefined,
      }),
    );

    if (status === 'resolved') {
      setResolutionSummary('');
    }
  };

  const addNote = () => {
    if (!incident || note.trim().length < 3) {
      return;
    }

    dispatch(
      addIncidentNote({
        incidentId: incident.id,
        note: note.trim(),
        eventId: `${incident.id}-note-${Date.now()}`,
        createdAt: new Date().toISOString(),
        actor,
      }),
    );

    setNote('');
  };

  const assignToMe = () => {
    if (!incident) {
      return;
    }

    dispatch(
      assignIncident({
        incidentId: incident.id,
        owner: actor,
        team: incident.team,
        eventId: `${incident.id}-assign-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }),
    );
  };

  const toggleRunbook = (
    runbookItemId: string,
  ) => {
    if (!incident) {
      return;
    }

    dispatch(
      toggleRunbookItem({
        incidentId: incident.id,
        runbookItemId,
        eventId: `${incident.id}-runbook-${Date.now()}`,
        createdAt: new Date().toISOString(),
        actor,
      }),
    );
  };

  if (!incident || !sla) {
    return (
      <Screen
        title="Incident not found"
        subtitle={route.params.incidentId}
        edges={['left', 'right', 'bottom']}
      >
        <View style={styles.card}>
          <Text style={styles.description}>
            This incident is no longer available.
          </Text>
        </View>
      </Screen>
    );
  }

  const nextStatus:
    | IncidentStatus
    | undefined =
    incident.status === 'ongoing'
      ? 'investigating'
      : incident.status === 'investigating'
        ? 'monitoring'
        : incident.status === 'monitoring'
          ? 'resolved'
          : undefined;

  const nextStatusLabel =
    nextStatus === 'investigating'
      ? 'Acknowledge incident'
      : nextStatus === 'monitoring'
        ? 'Start monitoring'
        : nextStatus === 'resolved'
          ? 'Resolve incident'
          : undefined;

  const completedRunbook =
    incident.runbook.filter(
      item => item.completed,
    ).length;

  const sharePostmortem = () => {
    void Share.share({
      message: generatePostmortem(incident),
      title: `${incident.id} postmortem`,
    });
  };

  return (
    <Screen
      title={incident.title}
      subtitle={incident.id}
      edges={['left', 'right', 'bottom']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.severityBadge}>
              <Text style={styles.severityText}>
                {incident.severity}
              </Text>
            </View>

            <Text style={styles.status}>
              {incident.status.toUpperCase()}
            </Text>
          </View>

          <Text style={styles.description}>
            {incident.summary}
          </Text>

          <View style={styles.commandGrid}>
            <InfoTile
              label="Owner"
              value={incident.owner}
            />
            <InfoTile
              label="Team"
              value={incident.team}
            />
            <InfoTile
              label="Affected users"
              value={incident.affectedUsers.toLocaleString()}
            />
            <InfoTile
              label="Open duration"
              value={formatDuration(
                sla.minutesOpen,
              )}
            />
          </View>

          {incident.owner === 'Unassigned' ? (
            <Pressable
              accessibilityRole="button"
              onPress={assignToMe}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonLabel}>
                Assign to on-call engineer
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            SLA status
          </Text>

          <View style={styles.slaRow}>
            <SlaTile
              label="Acknowledge"
              target={`${sla.acknowledgeTargetMinutes}m target`}
              value={
                sla.acknowledgeMinutes === null
                  ? sla.acknowledgeBreached
                    ? 'Breached'
                    : `${Math.max(
                        0,
                        sla.acknowledgeRemainingMinutes,
                      )}m left`
                  : `${sla.acknowledgeMinutes}m`
              }
              breached={
                sla.acknowledgeBreached &&
                !incident.acknowledgedAt
              }
            />

            <SlaTile
              label="Resolve"
              target={`${sla.resolutionTargetMinutes}m target`}
              value={
                sla.resolutionMinutes === null
                  ? sla.resolutionBreached
                    ? 'Breached'
                    : `${Math.max(
                        0,
                        sla.resolutionRemainingMinutes,
                      )}m left`
                  : formatDuration(
                      sla.resolutionMinutes,
                    )
              }
              breached={
                sla.resolutionBreached &&
                !incident.resolvedAt
              }
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Customer impact
          </Text>

          <Text style={styles.sectionValue}>
            {incident.impact}
          </Text>

          <Text style={styles.sectionLabel}>
            Affected service
          </Text>

          <Text style={styles.sectionValue}>
            {incident.service}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              Response runbook
            </Text>

            <Text style={styles.progressText}>
              {completedRunbook}/{incident.runbook.length}
            </Text>
          </View>

          {incident.runbook.map(item => (
            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{
                checked: item.completed,
              }}
              key={item.id}
              onPress={() =>
                toggleRunbook(item.id)
              }
              style={styles.runbookRow}
            >
              <View
                style={[
                  styles.checkbox,
                  item.completed &&
                    styles.checkboxComplete,
                ]}
              >
                <Text style={styles.checkboxLabel}>
                  {item.completed ? '✓' : ''}
                </Text>
              </View>

              <Text
                style={[
                  styles.runbookText,
                  item.completed &&
                    styles.runbookTextComplete,
                ]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Operator note
          </Text>

          <TextInput
            accessibilityLabel="Operator note"
            multiline
            onChangeText={setNote}
            placeholder="Add mitigation, investigation or stakeholder update..."
            placeholderTextColor={colors.textMuted}
            style={styles.noteInput}
            value={note}
          />

          <Pressable
            accessibilityRole="button"
            disabled={note.trim().length < 3}
            onPress={addNote}
            style={[
              styles.secondaryButton,
              note.trim().length < 3 &&
                styles.disabled,
            ]}
          >
            <Text style={styles.secondaryButtonLabel}>
              Add note to timeline
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Incident timeline
          </Text>

          {incident.timeline.map(event => (
            <TimelineItem
              key={event.id}
              event={event}
            />
          ))}
        </View>

        {nextStatus === 'resolved' ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>
              Resolution summary
            </Text>

            <TextInput
              accessibilityLabel="Resolution summary"
              multiline
              onChangeText={setResolutionSummary}
              placeholder="What fixed the incident?"
              placeholderTextColor={colors.textMuted}
              style={styles.noteInput}
              value={resolutionSummary}
            />
          </View>
        ) : null}

        {nextStatus && nextStatusLabel ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={nextStatusLabel}
            onPress={() =>
              changeStatus(nextStatus)
            }
            style={({ pressed }) => [
              styles.primaryButton,
              nextStatus === 'resolved' &&
                styles.resolveButton,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.primaryButtonLabel}>
              {nextStatusLabel}
            </Text>
          </Pressable>
        ) : null}

        {incident.status === 'resolved' ? (
          <View style={styles.resolvedSection}>
            <View style={styles.resolvedBanner}>
              <Text style={styles.resolvedText}>
                Incident resolved
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>
                Postmortem report
              </Text>

              <Text style={styles.description}>
                {incident.resolutionSummary ||
                  'Resolution recorded.'}
              </Text>

              <View style={styles.reportStats}>
                <InfoTile
                  label="MTTA"
                  value={
                    sla.acknowledgeMinutes === null
                      ? '—'
                      : formatDuration(
                          sla.acknowledgeMinutes,
                        )
                  }
                />
                <InfoTile
                  label="MTTR"
                  value={
                    sla.resolutionMinutes === null
                      ? '—'
                      : formatDuration(
                          sla.resolutionMinutes,
                        )
                  }
                />
              </View>

              <Pressable
                accessibilityRole="button"
                onPress={sharePostmortem}
                style={styles.secondaryButton}
              >
                <Text style={styles.secondaryButtonLabel}>
                  Share incident report
                </Text>
              </Pressable>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

function InfoTile({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoTile}>
      <Text style={styles.infoTileLabel}>
        {label}
      </Text>
      <Text style={styles.infoTileValue}>
        {value}
      </Text>
    </View>
  );
}

function SlaTile({
  label,
  target,
  value,
  breached,
}: {
  label: string;
  target: string;
  value: string;
  breached: boolean;
}) {
  return (
    <View style={styles.slaTile}>
      <Text style={styles.slaLabel}>{label}</Text>
      <Text
        style={[
          styles.slaValue,
          breached && styles.slaValueBreached,
        ]}
      >
        {value}
      </Text>
      <Text style={styles.slaTarget}>
        {target}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.md,
    padding: spacing.lg,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityBadge: {
    backgroundColor: colors.danger,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  severityText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  status: {
    color: colors.warning,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md,
  },
  commandGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  infoTile: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    minWidth: '46%',
    padding: spacing.md,
  },
  infoTileLabel: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  infoTileValue: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  sectionHeaderRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  sectionLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: spacing.lg,
    textTransform: 'uppercase',
  },
  sectionValue: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.xs,
  },
  slaRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  slaTile: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 12,
    flex: 1,
    padding: spacing.md,
  },
  slaLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  slaValue: {
    color: colors.success,
    fontSize: 20,
    fontWeight: '800',
    marginTop: spacing.sm,
  },
  slaValueBreached: {
    color: colors.danger,
  },
  slaTarget: {
    color: colors.textMuted,
    fontSize: 10,
    marginTop: spacing.xs,
  },
  progressText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: '800',
  },
  runbookRow: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 48,
  },
  checkbox: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 6,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginRight: spacing.md,
    width: 24,
  },
  checkboxComplete: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  checkboxLabel: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  runbookText: {
    color: colors.textPrimary,
    flex: 1,
    fontSize: 13,
  },
  runbookTextComplete: {
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  noteInput: {
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 13,
    minHeight: 90,
    padding: spacing.md,
    textAlignVertical: 'top',
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 46,
    paddingHorizontal: spacing.md,
  },
  secondaryButtonLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  timelineItem: {
    flexDirection: 'row',
    minHeight: 66,
  },
  timelineRail: {
    alignItems: 'center',
    width: 24,
  },
  timelineDot: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    height: 12,
    marginTop: 4,
    width: 12,
  },
  timelineLine: {
    backgroundColor: colors.border,
    flex: 1,
    marginVertical: spacing.xs,
    width: 2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: spacing.md,
    paddingLeft: spacing.sm,
  },
  timelineMessage: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  timelineTime: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: spacing.xs,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: spacing.lg,
  },
  resolveButton: {
    backgroundColor: colors.success,
  },
  primaryButtonLabel: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    opacity: 0.45,
  },
  resolvedSection: {
    gap: spacing.md,
  },
  resolvedBanner: {
    alignItems: 'center',
    backgroundColor: `${colors.success}20`,
    borderColor: colors.success,
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.lg,
  },
  resolvedText: {
    color: colors.success,
    fontSize: 14,
    fontWeight: '700',
  },
  reportStats: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
});
EOF

# ---------------------------------------------------------------------------
# 12. Actionable Activity audit trail
# ---------------------------------------------------------------------------
cat > src/features/activity/screens/ActivityScreen.tsx <<'EOF'
import React, {
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  type ListRenderItem,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

import type {
  RootStackParamList,
} from '../../../app/navigation/types';
import { useAppSelector } from '../../../app/store/hooks';
import { colors } from '../../../design-system/theme/colors';
import { spacing } from '../../../design-system/theme/spacing';
import { Screen } from '../../../shared/components/Screen';
import type {
  IncidentEventType,
  IncidentSeverity,
} from '../../incidents/model/types';

type Navigation =
  NativeStackNavigationProp<RootStackParamList>;

type ActivityItem = {
  id: string;
  incidentId: string;
  incidentTitle: string;
  severity: IncidentSeverity;
  type: IncidentEventType;
  message: string;
  createdAt: string;
};

type SeverityFilter =
  | 'all'
  | IncidentSeverity;

const filters: SeverityFilter[] = [
  'all',
  'P1',
  'P2',
  'P3',
];

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
  });
}

function ActivityRow({
  item,
  onPress,
}: {
  item: ActivityItem;
  onPress: (incidentId: string) => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => onPress(item.incidentId)}
      style={({ pressed }) => [
        styles.activityCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.headerRow}>
        <View style={styles.severityBadge}>
          <Text style={styles.severityText}>
            {item.severity}
          </Text>
        </View>

        <Text style={styles.timestamp}>
          {formatTimestamp(item.createdAt)}
        </Text>
      </View>

      <Text style={styles.incidentTitle}>
        {item.incidentTitle}
      </Text>

      <Text style={styles.message}>
        {item.message}
      </Text>

      <View style={styles.footerRow}>
        <Text style={styles.incidentId}>
          {item.incidentId}
        </Text>

        <Text style={styles.openLabel}>
          Open →
        </Text>
      </View>
    </Pressable>
  );
}

export function ActivityScreen() {
  const navigation = useNavigation<Navigation>();
  const incidents = useAppSelector(
    state => state.incidents.items,
  );

  const [filter, setFilter] =
    useState<SeverityFilter>('all');

  const activityItems = useMemo<ActivityItem[]>(
    () =>
      incidents
        .flatMap(incident =>
          incident.timeline.map(event => ({
            ...event,
            incidentId: incident.id,
            incidentTitle: incident.title,
            severity: incident.severity,
          })),
        )
        .filter(
          item =>
            filter === 'all' ||
            item.severity === filter,
        )
        .sort(
          (first, second) =>
            Date.parse(second.createdAt) -
            Date.parse(first.createdAt),
        ),
    [filter, incidents],
  );

  const openIncident = useCallback(
    (incidentId: string) => {
      navigation.navigate('IncidentDetails', {
        incidentId,
      });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<ActivityItem> =
    useCallback(
      ({ item }) => (
        <ActivityRow
          item={item}
          onPress={openIncident}
        />
      ),
      [openIncident],
    );

  const keyExtractor = useCallback(
    (item: ActivityItem) => item.id,
    [],
  );

  const header = useMemo(
    () => (
      <View style={styles.filters}>
        {filters.map(item => (
          <Pressable
            accessibilityRole="button"
            key={item}
            onPress={() => setFilter(item)}
            style={[
              styles.filterButton,
              filter === item &&
                styles.filterButtonActive,
            ]}
          >
            <Text
              style={[
                styles.filterLabel,
                filter === item &&
                  styles.filterLabelActive,
              ]}
            >
              {item === 'all' ? 'All' : item}
            </Text>
          </Pressable>
        ))}
      </View>
    ),
    [filter],
  );

  return (
    <Screen
      title="Activity"
      subtitle="Operational audit trail. Tap an event to open its incident."
    >
      <FlatList
        data={activityItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={header}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xxl,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  filterButtonActive: {
    backgroundColor: `${colors.accent}20`,
    borderColor: colors.accent,
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  filterLabelActive: {
    color: colors.accent,
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: spacing.sm,
    padding: spacing.lg,
  },
  pressed: {
    opacity: 0.75,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  severityBadge: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: 7,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  severityText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
  },
  timestamp: {
    color: colors.textMuted,
    fontSize: 11,
  },
  incidentTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginTop: spacing.md,
  },
  message: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginTop: spacing.sm,
  },
  footerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  incidentId: {
    color: colors.textMuted,
    fontSize: 11,
  },
  openLabel: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '800',
  },
});
EOF

# ---------------------------------------------------------------------------
# 13. Settings: workspace reset
# ---------------------------------------------------------------------------
python3 <<'PY'
from pathlib import Path

path = Path("src/features/settings/screens/SettingsScreen.tsx")
text = path.read_text()

text = text.replace(
    """  StyleSheet,
  Switch,
  Text,
  View,""",
    """  Alert,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,""",
)

text = text.replace(
    """import {
  setLiveUpdatesEnabled,
} from '../../../app/store/appSlice';""",
    """import {
  setLiveUpdatesEnabled,
} from '../../../app/store/appSlice';
import {
  resetIncidents,
} from '../../incidents/incidentsSlice';""",
)

anchor = """  const handleLiveUpdatesChange = (
    value: boolean,
  ) => {
    dispatch(setLiveUpdatesEnabled(value));
  };"""

replacement = """  const handleLiveUpdatesChange = (
    value: boolean,
  ) => {
    dispatch(setLiveUpdatesEnabled(value));
  };

  const resetWorkspace = () => {
    Alert.alert(
      'Reset demo workspace?',
      'This restores bundled incidents and removes local incident changes.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            dispatch(resetIncidents());
          },
        },
      ],
    );
  };"""

if anchor not in text:
    raise SystemExit(
        "Could not find SettingsScreen handler anchor."
    )

text = text.replace(anchor, replacement)

ui_anchor = """      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Application
        </Text>"""

ui_new = """      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Workspace
        </Text>

        <View style={styles.card}>
          <View style={styles.content}>
            <Text style={styles.title}>
              Incident workspace
            </Text>

            <Text style={styles.description}>
              Incident lifecycle changes, notes,
              assignments and runbook progress are
              persisted on this device.
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="button"
          onPress={resetWorkspace}
          style={styles.resetButton}
        >
          <Text style={styles.resetButtonLabel}>
            Reset demo workspace
          </Text>
        </Pressable>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Application
        </Text>"""

text = text.replace(ui_anchor, ui_new)

style_anchor = """  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
  },"""

style_new = """  resetButton: {
    alignItems: 'center',
    borderColor: colors.danger,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: spacing.sm,
    minHeight: 46,
  },
  resetButtonLabel: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  divider: {
    backgroundColor: colors.border,
    height: StyleSheet.hairlineWidth,
  },"""

text = text.replace(style_anchor, style_new)

path.write_text(text)
PY

# ---------------------------------------------------------------------------
# 14. Tests for operational logic and reducer lifecycle
# ---------------------------------------------------------------------------
cat > __tests__/operations.test.ts <<'EOF'
import {
  deriveServiceHealth,
  generatePostmortem,
  getIncidentSla,
  getOperationalMetrics,
} from '../src/features/incidents/lib/operations';
import type {
  Incident,
} from '../src/features/incidents/model/types';

function createIncident(
  overrides: Partial<Incident> = {},
): Incident {
  return {
    id: 'INC-TEST-1',
    title: 'Test incident',
    summary: 'Something failed.',
    severity: 'P1',
    status: 'ongoing',
    service: 'Checkout API',
    detectedAt: '10 minutes ago',
    createdAt: '2026-09-20T08:00:00.000Z',
    owner: 'On-call',
    team: 'Platform',
    impact: 'Checkout is slow.',
    affectedUsers: 100,
    runbook: [
      {
        id: 'step',
        label: 'Verify',
        completed: true,
      },
    ],
    timeline: [
      {
        id: 'event',
        type: 'detected',
        message: 'Detected',
        createdAt:
          '2026-09-20T08:00:00.000Z',
      },
    ],
    ...overrides,
  };
}

describe('incident operations', () => {
  test('calculates SLA breach from real timestamps', () => {
    const incident = createIncident();

    const sla = getIncidentSla(
      incident,
      Date.parse('2026-09-20T08:20:00.000Z'),
    );

    expect(sla.acknowledgeBreached).toBe(true);
    expect(sla.resolutionBreached).toBe(false);
  });

  test('derives service health from active severity', () => {
    const health = deriveServiceHealth([
      createIncident({
        id: '1',
        severity: 'P1',
      }),
      createIncident({
        id: '2',
        service: 'Search',
        severity: 'P3',
      }),
      createIncident({
        id: '3',
        service: 'Users',
        status: 'resolved',
        resolvedAt:
          '2026-09-20T08:15:00.000Z',
      }),
    ]);

    expect(
      health.find(
        item =>
          item.service === 'Checkout API',
      )?.status,
    ).toBe('down');

    expect(
      health.find(
        item => item.service === 'Search',
      )?.status,
    ).toBe('degraded');

    expect(
      health.find(
        item => item.service === 'Users',
      )?.status,
    ).toBe('healthy');
  });

  test('calculates operational metrics', () => {
    const metrics = getOperationalMetrics(
      [
        createIncident({
          id: '1',
          acknowledgedAt:
            '2026-09-20T08:05:00.000Z',
        }),
        createIncident({
          id: '2',
          status: 'resolved',
          createdAt:
            '2026-09-20T07:00:00.000Z',
          acknowledgedAt:
            '2026-09-20T07:10:00.000Z',
          resolvedAt:
            '2026-09-20T08:00:00.000Z',
        }),
      ],
      Date.parse('2026-09-20T08:20:00.000Z'),
    );

    expect(metrics.active).toBe(1);
    expect(metrics.resolved).toBe(1);
    expect(metrics.mttr).toBe(60);
  });

  test('postmortem contains real incident values', () => {
    const report = generatePostmortem(
      createIncident({
        status: 'resolved',
        acknowledgedAt:
          '2026-09-20T08:05:00.000Z',
        resolvedAt:
          '2026-09-20T08:30:00.000Z',
        resolutionSummary:
          'Rolled back the release.',
      }),
    );

    expect(report).toContain('INC-TEST-1');
    expect(report).toContain(
      'Rolled back the release.',
    );
    expect(report).toContain(
      'Runbook completed: 1/1',
    );
  });
});
EOF

cat > __tests__/incidentsSlice.test.ts <<'EOF'
import reducer, {
  addIncidentNote,
  createIncident,
  toggleRunbookItem,
  updateIncidentStatus,
} from '../src/features/incidents/incidentsSlice';

describe('incidents reducer', () => {
  test('supports create -> acknowledge -> monitor -> resolve', () => {
    let state = reducer(
      undefined,
      createIncident({
        id: 'INC-NEW',
        title: 'API outage',
        summary: 'API is returning errors.',
        severity: 'P1',
        service: 'API',
        owner: 'On-call',
        team: 'Platform',
        impact: 'Requests are failing.',
        affectedUsers: 500,
        createdAt:
          '2026-09-20T08:00:00.000Z',
      }),
    );

    state = reducer(
      state,
      updateIncidentStatus({
        incidentId: 'INC-NEW',
        status: 'investigating',
        eventId: 'ack',
        changedAt:
          '2026-09-20T08:05:00.000Z',
        actor: 'On-call',
      }),
    );

    state = reducer(
      state,
      updateIncidentStatus({
        incidentId: 'INC-NEW',
        status: 'monitoring',
        eventId: 'monitor',
        changedAt:
          '2026-09-20T08:20:00.000Z',
        actor: 'On-call',
      }),
    );

    state = reducer(
      state,
      updateIncidentStatus({
        incidentId: 'INC-NEW',
        status: 'resolved',
        eventId: 'resolved',
        changedAt:
          '2026-09-20T08:30:00.000Z',
        actor: 'On-call',
        resolutionSummary:
          'Rolled back the release.',
      }),
    );

    const incident = state.items.find(
      item => item.id === 'INC-NEW',
    );

    expect(incident?.status).toBe('resolved');
    expect(incident?.acknowledgedAt).toBeDefined();
    expect(incident?.monitoringAt).toBeDefined();
    expect(incident?.resolvedAt).toBeDefined();
    expect(incident?.resolutionSummary).toBe(
      'Rolled back the release.',
    );
  });

  test('records notes and runbook actions in timeline', () => {
    let state = reducer(
      undefined,
      createIncident({
        id: 'INC-NOTE',
        title: 'Queue issue',
        summary: 'Queue depth is increasing.',
        severity: 'P2',
        service: 'Worker',
        owner: 'On-call',
        team: 'Platform',
        impact: 'Jobs are delayed.',
        affectedUsers: 30,
        createdAt:
          '2026-09-20T08:00:00.000Z',
      }),
    );

    state = reducer(
      state,
      addIncidentNote({
        incidentId: 'INC-NOTE',
        note: 'Scaled workers to 10.',
        eventId: 'note',
        createdAt:
          '2026-09-20T08:05:00.000Z',
        actor: 'On-call',
      }),
    );

    const runbookItem =
      state.items[0].runbook[0];

    state = reducer(
      state,
      toggleRunbookItem({
        incidentId: 'INC-NOTE',
        runbookItemId: runbookItem.id,
        eventId: 'runbook',
        createdAt:
          '2026-09-20T08:06:00.000Z',
        actor: 'On-call',
      }),
    );

    expect(
      state.items[0].timeline.some(
        event => event.type === 'note',
      ),
    ).toBe(true);

    expect(
      state.items[0].runbook[0].completed,
    ).toBe(true);
  });
});
EOF

# ---------------------------------------------------------------------------
# 15. CI
# ---------------------------------------------------------------------------
cat > .github/workflows/ci.yml <<'EOF'
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  quality:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Use Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Tests
        run: npm test -- --runInBand
EOF

npm pkg set 'scripts.typecheck=tsc --noEmit'

# ---------------------------------------------------------------------------
# 16. README
# ---------------------------------------------------------------------------
cat > README.md <<'EOF'
# SignalOps Mobile

SignalOps is a React Native CLI incident-response command center built to
demonstrate production-oriented mobile architecture, operational workflows and
offline-persistent state.

The repository uses local demo incidents and a deterministic monitoring
simulator. It does **not** claim to connect to a production incident-management
backend.

## Real functionality

- Operational overview with active incidents, P1 count, SLA breaches and MTTR
- Dynamic service health derived from active incident severity
- Create Incident workflow with severity, impact, service, owner and affected users
- Full incident lifecycle: ongoing → investigating → monitoring → resolved
- Assignment / ownership tracking
- Acknowledge and resolution SLA calculations
- Persisted incident workspace with Async Storage
- Incident response runbook / checklist
- Operator notes written into the audit timeline
- Searchable and severity-filtered incident list
- Actionable activity audit trail with incident deep links
- Simulated incoming monitoring signals
- Deterministic postmortem / incident report generation
- Shareable resolved-incident reports
- Persisted monitoring preferences
- Resettable portfolio demo workspace
- Typed React Navigation
- Redux Toolkit state management
- Optimized FlatList rendering
- Jest tests and GitHub Actions CI
- iOS and Android support

## Incident workflow

```text
Create incident
     ↓
Ongoing
     ↓ acknowledge
Investigating
     ↓ mitigation / runbook / notes
Monitoring
     ↓ recovery confirmed
Resolved
     ↓
Postmortem report
```

Each state transition is written into the incident timeline.

## Operational intelligence

SignalOps derives operational metrics from the actual incident timestamps and
state in the device workspace.

### SLA

Targets are deterministic by severity:

| Severity | Acknowledge | Resolve |
| --- | ---: | ---: |
| P1 | 15 min | 2 hours |
| P2 | 30 min | 4 hours |
| P3 | 60 min | 8 hours |

The app calculates acknowledgement breaches, resolution breaches, MTTA and MTTR.

### Service health

Service health is not a static mock percentage.

It is derived from unresolved incidents:

- active P1 → Critical
- active P2/P3 → Degraded
- no active incidents → Healthy

### Postmortem

Resolved incidents can generate a deterministic report containing:

- incident identity and severity
- service and ownership
- customer impact and affected users
- time to acknowledge
- time to resolve
- runbook completion
- resolution summary
- complete incident timeline

The report can be shared through the native share sheet.

## Offline persistence

Incident creation, status transitions, assignments, notes and runbook state are
stored locally with Async Storage. Restarting the app restores the operational
workspace.

Settings includes **Reset demo workspace** for restoring the bundled sample
incidents.

## Architecture

```text
src/
├── app/
│   ├── hooks/           # preference + workspace persistence
│   ├── navigation/      # typed React Navigation
│   └── store/           # Redux Toolkit store
├── design-system/       # colors, spacing, navigation styling
├── features/
│   ├── activity/        # actionable audit trail
│   ├── incidents/
│   │   ├── data/        # bundled demo incidents
│   │   ├── hooks/       # live update simulator
│   │   ├── lib/         # SLA, metrics, service health, postmortem
│   │   ├── model/       # incident domain model
│   │   └── screens/     # list, create, command center
│   ├── overview/        # operational dashboard
│   └── settings/        # preferences + reset
└── shared/
    ├── components/
    └── storage/
```

## Technology

- React Native CLI
- React 19
- TypeScript
- React Navigation
- Redux Toolkit
- Async Storage
- React Native SVG
- Jest
- GitHub Actions

## Run locally

```bash
npm install
npx pod-install ios
npm start
```

In another terminal:

```bash
npm run ios
# or
npm run android
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm test -- --runInBand
```

## Portfolio positioning

SignalOps demonstrates mobile engineering around a realistic operational domain:
state-machine workflows, local persistence, derived metrics, typed navigation,
audit trails, resilient UI state and deterministic reporting.

Production authentication, push notifications, WebSocket connectivity and a
real monitoring backend are intentionally outside the current portfolio build.
EOF

# ---------------------------------------------------------------------------
# 17. Validate everything
# ---------------------------------------------------------------------------
echo "==> Running lint"
npm run lint

echo "==> Running typecheck"
npm run typecheck

echo "==> Running tests"
npm test -- --runInBand

echo
echo "============================================================"
echo "SignalOps command-center upgrade applied."
echo
echo "Major functionality added:"
echo "  - Create Incident"
echo "  - full incident lifecycle"
echo "  - assignment and ownership"
echo "  - SLA timers / breach detection"
echo "  - MTTA / MTTR metrics"
echo "  - dynamic service health"
echo "  - persistent incident workspace"
echo "  - response runbooks"
echo "  - operator notes"
echo "  - actionable activity audit"
echo "  - deterministic postmortem reports"
echo "  - tests + CI"
echo
echo "Run the app:"
echo "  npm start"
echo "  npm run ios"
echo "  # or npm run android"
echo
echo "If everything looks good:"
echo "  git add -A"
echo '  git commit -m "Upgrade SignalOps incident response workflows"'
echo "  git push"
echo "============================================================"
