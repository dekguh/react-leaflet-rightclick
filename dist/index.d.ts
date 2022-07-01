import React, { ReactNode } from 'react';
import { LeafletMouseEvent } from 'leaflet';
export declare const LeafletRightClickContext: React.Context<{
    [key: string]: any;
}>;
export declare const LeafletRightClickProvider: React.FC<{
    children: ReactNode | JSX.Element;
}>;
export declare const useLeafletRightClick: () => LeafletMouseEvent | null;
declare const ReactLeafletRightClick: React.FC<{
    onRightClick?: (event: LeafletMouseEvent) => void;
    customComponent: ReactNode | JSX.Element;
}>;
export default ReactLeafletRightClick;
