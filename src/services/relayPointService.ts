export interface RelayPoint {
    id: string;
    relayPointName: string;
    address?: string;
    relay_point_address?: string;
    locality?: string;
    relay_point_locality?: string;
    latitude: number;
    longitude: number;
}

const MOCK_RELAY_POINTS: RelayPoint[] = [
    {
        id: 'uuid-1',
        relayPointName: 'Agence Centrale',
        address: 'Centre Ville',
        locality: 'Yaoundé',
        latitude: 3.8480,
        longitude: 11.5021
    },
    {
        id: 'uuid-2',
        relayPointName: 'Agence Bastos',
        address: 'Quartier Bastos',
        locality: 'Yaoundé',
        latitude: 3.8700,
        longitude: 11.5150
    },
    {
        id: 'uuid-3',
        relayPointName: 'Agence Biyem-Assi',
        address: 'Biyem-Assi',
        locality: 'Yaoundé',
        latitude: 3.8300,
        longitude: 11.4900
    }
];

export const relayPointService = {
    getAllRelayPoints: async (): Promise<RelayPoint[]> => {
        // Simulation d'un appel API pour les besoins de l'interface
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MOCK_RELAY_POINTS);
            }, 500);
        });
    }
};
