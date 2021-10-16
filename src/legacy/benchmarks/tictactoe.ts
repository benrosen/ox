/**
 * Tic Tac Toe
 *
 * One 3x3 board
 * Two agents
 * Two distinct types of token: one for each agent
 * Agents take turns placing their tokens on the board
 * The first agent to create a straight line of three of their own tokens wins
 * The game may also end in a draw
 */

import Game, { SplashScene } from "../ox";

export default () => {
  const game = new Game({
    clockConfig: { hertz: 2, range: { max: 10, min: 0 } },
    initialScene: new SplashScene(() => {
      console.log("Tic Tac Toe");
    }),
  });
  game.clock.start();
};
