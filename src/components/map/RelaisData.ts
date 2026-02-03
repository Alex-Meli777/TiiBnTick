export interface PointRelais {
    id: number;
    nom: string;
    description: string;
    lat: number;
    lng: number;
}

export const YAOUNDE_CENTER: [number, number] = [3.8480, 11.5021];

const yaoundePointsRelais: PointRelais[] = [];

export default yaoundePointsRelais;
