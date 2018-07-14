const DEF_HANDLE_RATE = 1.7;
const DEF_NODE_SCALE = 30;
const DEF_V = 0.6;
const DEF_MAX_DISTANCE = 65;
const DEF_BIG_CIRCLE_RADIUS = 15;

module.exports = {
  get handleLengthRate() {
    return this._handleLengthRate || DEF_HANDLE_RATE;
  },
  set handleLengthRate(_handleLengthRate) {
    this._handleLengthRate = _handleLengthRate;
  },
  get nodeScale() {
    return this._nodeScale || DEF_NODE_SCALE;
  },
  set nodeScale(_nodeScale) {
    this._nodeScale = _nodeScale;
  },
  get v() {
    return this._v || DEF_V;
  },
  set v(_v) {
    this._v = _v;
  },
  get maxDistance() {
    return this._maxDistance || DEF_MAX_DISTANCE;
  },
  set maxDistance(_maxDistance) {
    this._maxDistance = _maxDistance;
  },
  get bigCircleRadius() {
    return this._bigCircleRadius || DEF_BIG_CIRCLE_RADIUS;
  },
  set bigCircleRadius(_bigCircleRadius) {
    this._bigCircleRadius = _bigCircleRadius;
  }
};
