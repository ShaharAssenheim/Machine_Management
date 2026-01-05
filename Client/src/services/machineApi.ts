import { Machine, MachineStatus, ModelType, TubeType } from '../types';
import { API_CONFIG, AUTH_CONFIG, UI_CONSTANTS } from '../constants';

const { BASE_URL } = API_CONFIG;
const { TOKEN_KEY } = AUTH_CONFIG;
const MACHINE_IMAGE_URL = UI_CONSTANTS.DEFAULT_MACHINE_IMAGE;

// API Response type (matches server DTOs with camelCase)
interface ApiMachine {
  id: number;
  name: string;
  model: string;
  status: string;
  plcVersion: string;
  acsVersion: string;
  tubesNumber: number;
  tubes: Array<{
    tubeIndex: number;
    tubeType: string;
    purgingConnected: boolean;
    shutterExists: boolean;
  }>;
  owner: string;
  teamviewerName: string;
  location: {
    country: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  createdAt: string;
  updatedAt?: string;
}

// Convert server enum string to client enum
const parseStatus = (status: string): MachineStatus => {
  switch (status) {
    case 'Running': return MachineStatus.RUNNING;
    case 'Idle': return MachineStatus.IDLE;
    case 'Maintenance': return MachineStatus.MAINTENANCE;
    case 'Error': return MachineStatus.ERROR;
    default: return MachineStatus.IDLE;
  }
};

const parseModelType = (model: string): ModelType => {
  switch (model) {
    case 'Onyx3000': return ModelType.Onyx3000;
    case 'Onyx3200': return ModelType.Onyx3200;
    default: return ModelType.Onyx3000;
  }
};

const parseTubeType = (tubeType: string): TubeType => {
  switch (tubeType) {
    case 'Petrick': return TubeType.Petrick;
    case 'MXR': return TubeType.MXR;
    case 'ColorsTW': return TubeType.ColorsTW;
    case 'ColorsTCu': return TubeType.ColorsTCu;
    case 'ColorsTAu': return TubeType.ColorsTAu;
    case 'ColorsTMo': return TubeType.ColorsTMo;
    case 'ColorsTWMa': return TubeType.ColorsTWMa;
    default: return TubeType.Petrick;
  }
};

// Convert API response to client Machine type
const mapApiMachineToMachine = (apiMachine: ApiMachine): Machine => {
  return {
    name: apiMachine.name,
    model: parseModelType(apiMachine.model),
    image: MACHINE_IMAGE_URL,
    status: parseStatus(apiMachine.status),
    plc_version: apiMachine.plcVersion,
    acs_version: apiMachine.acsVersion,
    tubes_number: apiMachine.tubesNumber,
    tubes: apiMachine.tubes.map(tube => ({
      tube_index: tube.tubeIndex,
      tube_type: parseTubeType(tube.tubeType),
      purging_connected: tube.purgingConnected,
      shutter_exists: tube.shutterExists,
    })),
    owner: apiMachine.owner,
    teamviewer_name: apiMachine.teamviewerName,
    location: {
      country: apiMachine.location.country,
      city: apiMachine.location.city,
      latitude: apiMachine.location.latitude,
      longitude: apiMachine.location.longitude,
    },
  };
};

// Helper to get auth headers
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API Service
export const machineApi = {
  /**
   * Get all machines
   */
  async getAll(): Promise<Machine[]> {
    const response = await fetch(`${BASE_URL}/machines`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch machines: ${response.statusText}`);
    }

    const apiMachines: ApiMachine[] = await response.json();
    return apiMachines.map(mapApiMachineToMachine);
  },

  /**
   * Get a machine by ID
   */
  async getById(id: number): Promise<Machine | null> {
    const response = await fetch(`${BASE_URL}/machines/${id}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch machine: ${response.statusText}`);
    }

    const apiMachine: ApiMachine = await response.json();
    return mapApiMachineToMachine(apiMachine);
  },

  /**
   * Get a machine by name
   */
  async getByName(name: string): Promise<Machine | null> {
    const response = await fetch(`${BASE_URL}/machines/by-name/${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch machine: ${response.statusText}`);
    }

    const apiMachine: ApiMachine = await response.json();
    return mapApiMachineToMachine(apiMachine);
  },

  /**
   * Get machines by status
   */
  async getByStatus(status: MachineStatus): Promise<Machine[]> {
    // Convert client enum to server enum string
    const serverStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    
    const response = await fetch(`${BASE_URL}/machines/by-status/${serverStatus}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch machines by status: ${response.statusText}`);
    }

    const apiMachines: ApiMachine[] = await response.json();
    return apiMachines.map(mapApiMachineToMachine);
  },

  /**
   * Get machines by location
   */
  async getByLocation(country: string, city?: string): Promise<Machine[]> {
    const params = new URLSearchParams({ country });
    if (city) {
      params.append('city', city);
    }

    const response = await fetch(`${BASE_URL}/machines/by-location?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch machines by location: ${response.statusText}`);
    }

    const apiMachines: ApiMachine[] = await response.json();
    return apiMachines.map(mapApiMachineToMachine);
  },
};

export default machineApi;
