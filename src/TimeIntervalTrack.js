import { format } from 'd3-format';

const SECS_TO_MILLIS = 1000;

function formatTime(seconds, tickDiff) {
  // tickDiff specifies the number of significant digits for values between ticks
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  let ss = s;

  if (tickDiff && tickDiff < 0) {
    const f = format('.' + (-tickDiff) + 'f');
    ss = f(s);
  }

  if (s <= 9) {
    ss = '0' + ss;
  }

  return [
    h,
    m > 9 ? m : (h ? '0' + m : m || '0'),
    ss,
  ].filter(a => a).join(':');
}

const TimeIntervalTrack = (HGC, ...args) => {
  if (!new.target) {
    throw new Error(
      'Uncaught TypeError: Class constructor cannot be invoked without "new"',
    );
  }

  // HiGlass Code
  const { PIXI } = HGC.libraries;

  class TimeIntervalTrackClass extends HGC.tracks.TiledPixiTrack {
    constructor(context, options) {
      super(context, options);

      this.axisTexts = [];
      this.axisTextFontFamily = 'Arial';
      this.axisTextFontSize = 14;
      this.tickFormat = format('.2');
    }

    createAxisTexts(valueScale, axisHeight) {
      this.tickValues = this.calculateAxisTickValues(valueScale, axisHeight);
      let i = 0;

      // const color = getDarkTheme() ? '#cccccc' : 'black';
      const color = 'black';
      let tickDiff = null;

      if (this.tickValues.length >= 2) {
        tickDiff = (this.tickValues[1] - this.tickValues[0]) / SECS_TO_MILLIS;
        tickDiff = Math.floor(Math.log(tickDiff) / Math.log(10));
      }

      while (i < this.tickValues.length) {
        const tick = this.tickValues[i];

        while (this.axisTexts.length <= i) {
          const newText = new PIXI.Text(
            tick,
            {
              fontSize: `${this.axisTextFontSize}px`,
              fontFamily: this.axisTextFontFamily,
              fill: color,
            },
          );
          this.axisTexts.push(newText);

          this.pMain.addChild(newText);
        }

        this.axisTexts[i].text = formatTime(
          tick / SECS_TO_MILLIS, tickDiff,
        );
        this.axisTexts[i].anchor.y = 0.5;
        this.axisTexts[i].anchor.x = 0.5;
        i++;
      }

      while (this.axisTexts.length > this.tickValues.length) {
        const lastText = this.axisTexts.pop();
        this.pMain.removeChild(lastText);
      }
    }

    calculateAxisTickValues() {
      const scale = (+this.tilesetInfo.end_value - +this.tilesetInfo.start_value)
        / +this.tilesetInfo.max_width;
      const tickWidth = 200;
      const tickCount = Math.max(
        Math.ceil((this._xScale.range()[1] - this._xScale.range()[0]) / tickWidth), 1,
      );

      const newScale = this._xScale.copy().domain(
        [(this._xScale.domain()[0] * scale),
          (this._xScale.domain()[1] * scale)],
      );

      return newScale.ticks(tickCount).filter(
        t => t >= 0 && t <= (this.tilesetInfo.end_value - this.tilesetInfo.start_value),
      );
    }


    draw() {
      const graphics = this.pMain;

      if (!this.tilesetInfo) return;

      const scale = (+this.tilesetInfo.end_value - +this.tilesetInfo.start_value)
        / +this.tilesetInfo.max_width;

      const tickHeight = 10;
      const textHeight = 10;
      const betweenTickAndText = 5;

      const tickStartY = (this.dimensions[1] - tickHeight - textHeight - betweenTickAndText) / 2;
      const tickEndY = tickStartY + tickHeight;

      const ticks = this.calculateAxisTickValues();

      graphics.clear();
      graphics.lineStyle(1, 0x000000, 1);

      this.createAxisTexts();

      ticks.forEach((tick, i) => {
        const xPos = this.position[0] +
          this._xScale(tick / scale);

        graphics.moveTo(xPos, this.position[1] + tickStartY);
        graphics.lineTo(xPos, this.position[1] + tickEndY);

        this.axisTexts[i].x = xPos;
        this.axisTexts[i].y = this.position[1] + tickEndY + betweenTickAndText;
      });
    }

    calculateVisibleTiles() { }

    /* --------------------------- Getter / Setter ---------------------------- */

    zoomed(newXScale, newYScale) {
      this.xScale(newXScale);
      this.yScale(newYScale);

      this.draw();
    }
  }

  return new TimeIntervalTrackClass(...args);
};

TimeIntervalTrack.config = {
  type: 'time-interval-track',
  datatype: ['time-interval'],
  orientation: '1d-horizontal',
  name: 'TimeInterval',
  availableOptions: [
  ],
  defaultOptions: {
  },
};

export default TimeIntervalTrack;
