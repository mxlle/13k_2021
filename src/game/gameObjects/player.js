import { getGoal, updateScoreboard } from '../score/score';
import { MovingObject } from './movingObject';

export class Player extends MovingObject {
  _score = 0;
  isPlayer = true;

  constructor(properties) {
    super(properties);

    const { leftKey, rightKey } = properties;

    this.controls.setupKeys(leftKey, rightKey);
  }

  controlManually() {
    if (this.isBot) {
      this.isBot = false;
      this.markers.human?.show();
      this.resetScore(); // when switching from bot to human, reset score
    }
  }

  incScore() {
    this._score++;
    updateScoreboard();
  }

  resetScore() {
    this._score = 0;
    this.markers.trophy?.hide();
    updateScoreboard();
  }

  getScoreOutput() {
    const score = getGoal() <= 9 || this._score > 9 ? this._score : '0' + this._score;
    const keys = this.controls.getKeysString(this.isBot);
    return `<div class="result ${this.isBot ? 'bot' : 'human'}">
                ${keys}
                <span class="player">${this.emoji}</span>
                <span>Score:&nbsp;${score}</span>
            </div>`;
  }

  hasWon() {
    const hasWon = this._score >= getGoal();
    if (hasWon) this.markers.trophy?.show();
    return hasWon;
  }

  get isHuman() {
    return !this.isBot;
  }
}
