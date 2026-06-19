/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TreeStatus {
  id: string;
  type: 'Sehat' | 'Kecil' | 'Kuning' | 'Mati';
  latitude: number;
  longitude: number;
  healthScore: number;
  lastUpdated: string;
}

export interface Metric {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}
