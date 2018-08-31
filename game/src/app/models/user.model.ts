export class User {
    key?: string;
    email?: string;
    displayName?: string;
    password?: string;
    rating?: number;
    isOnline?: boolean;
    awaitingForPlay: any;
    isPlaying?: any;
    currentGame?: string;
    timeControl?: number;
    status?: string;
}