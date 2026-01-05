import React from 'react';

export enum MachineStatus {
  RUNNING = 'Running',
  IDLE = 'Idle',
  MAINTENANCE = 'Maintenance',
  ERROR = 'Error',
}

export enum TubeType {
  Petrick,
  MXR,
  ColorsTW,
  ColorsTCu,
  ColorsTAu,
  ColorsTMo,
  ColorsTWMa
}

export enum ModelType {
  Onyx3000,
 Onyx3200
}

export interface Machine {
  name: string;
  model: ModelType;
  image: string;
  status: MachineStatus;
  plc_version: string;
  acs_version: string;
  tubes_number: number;
  tubes: {
    tube_index: number;
    tube_type: TubeType;
    purging_connected: boolean;
    shutter_exists: boolean;
  }[];
  owner: string;
  teamviewer_name: string;
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  // Optional: for charting/history
  history?: { time: string; value: number }[];
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}