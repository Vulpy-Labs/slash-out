import { SWORD_STATES } from "@/config/constants";
import { SwordHandlerUpdateProp } from "../types.p";


class SwordStateHandler {
    update({ entity }: SwordHandlerUpdateProp) {
        const { input, state, sprite } = entity;
        let newState = '';

        if (!input || !state || !sprite) return;

        // Do not interrupt the slash animation if it is currently playing
        if (state.current === SWORD_STATES.SLASH && sprite.anims?.isPlaying) {
            return;
        }

        if (input.sword) newState = SWORD_STATES.SLASH;
        else newState = SWORD_STATES.IDLE;

        state.current = newState;
    }
}


export { SwordStateHandler };