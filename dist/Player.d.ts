declare class Player {
    version: string;
    constructor();
    play(member: any, stream: string, options?: any): Promise<any>;
}
export default Player;
