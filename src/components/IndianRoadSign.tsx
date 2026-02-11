
import React from 'react';

export type SignType =
    | 'stop' | 'give-way' | 'no-entry' | 'speed-50' | 'compulsory-left' | 'sound-horn'
    | 'right-curve' | 'narrow-bridge' | 'school' | 'pedestrian' | 'roundabout' | 'slippery'
    | 'hospital' | 'petrol' | 'eating' | 'parking';

interface IndianRoadSignProps {
    type: SignType;
    className?: string;
}

export default function IndianRoadSign({ type, className = "w-16 h-16" }: IndianRoadSignProps) {

    const getSignImage = (type: SignType) => {
        switch (type) {
            case 'stop': return '/signs/stop.png';
            case 'give-way': return '/signs/give-way.png';
            case 'no-entry': return '/signs/no-entry.png';
            case 'speed-50': return '/signs/speed-50.png';
            case 'compulsory-left': return '/signs/compulsory-left.png';
            case 'sound-horn': return '/signs/sound-horn.png';
            case 'right-curve': return '/signs/right-curve.png';
            case 'narrow-bridge': return '/signs/narrow-bridge.png';
            case 'school': return '/signs/school.png';
            case 'pedestrian': return '/signs/pedestrian.png';
            case 'roundabout': return '/signs/roundabout.png';
            case 'slippery': return '/signs/slippery.png';
            case 'hospital': return '/signs/hospital.png';
            case 'petrol': return '/signs/petrol.png';
            case 'eating': return '/signs/eating.png';
            case 'parking': return '/signs/parking.png';
            default: return '/signs/stop.png';
        }
    };

    return (
        <img
            src={getSignImage(type)}
            alt={type.replace('-', ' ')}
            className={`${className} object-contain`}
        />
    );
}
