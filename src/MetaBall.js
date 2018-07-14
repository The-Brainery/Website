const _ = require('lodash');
const paper = require('paper');
const params = require('./metaBallParams.js');

// Ported from original Metaball script by SATO Hiroyuki
// http://park12.wakwak.com/~shp/lc/et/en_aics_script.html

const {project, Path, Point, Group} = paper;

const init = () => {
  var canvas = document.getElementById('paperCanvas');
  paper.setup(canvas);

  paper.project.currentStyle = {
    fillColor: 'rgb(20, 33, 66)'
  };
}

let listener, largeCircle;
const render = () => {

  var canvas = document.getElementById('paperCanvas');
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, canvas.width, canvas.height);
  if (listener) {
    document.removeEventListener("mousemove", listener);
    listener = undefined;
  }
  // Retrieve parameters
  let {handleLengthRate, nodeScale, v,
     maxDistance, bigCircleRadius} = params;

  // Load SVG
  var xmlHTTP, svgDoc
  xmlHTTP = new XMLHttpRequest();
  xmlHTTP.open("GET", "/logo.svg", false);
  xmlHTTP.send();
  svgDoc = xmlHTTP.responseText;

  let domNode = document.createElement("div");
  domNode.innerHTML = svgDoc;

  var circleNodes = domNode.querySelectorAll("circle");

  const minX = _.min(_.map(circleNodes, (n)=>parseFloat(n.getAttribute("cx"))));
  const maxX = _.max(_.map(circleNodes, (n)=>parseFloat(n.getAttribute("cx"))));
  const minY = _.min(_.map(circleNodes, (n)=>parseFloat(n.getAttribute("cy"))));
  const maxY = _.max(_.map(circleNodes, (n)=>parseFloat(n.getAttribute("cy"))));
  const margin = 100;
  const bounds = canvas.getBoundingClientRect();


  // ((objectX - minX) / (maxX-minX)) * (bounds.maxX-bounds.minX) + bounds.minX
  // Map in relation to bounds of the canvas
  var circleData = [...circleNodes].map((c) => {

    let x = parseFloat(c.getAttribute("cx"));
    let y = parseFloat(c.getAttribute("cy"));
    let r = parseFloat(c.getAttribute("r"));

    x -= minX;
    x *= ((bounds.width-margin) / (maxX-minX));
    // x += bounds.left;
    x += margin/2;

    y -= minY;
    y *= ((bounds.height-margin) / (maxY-minY));
    // y += bounds.top;
    y += margin/2;

    r *= nodeScale;

    return {
      x:  x,
      y:  y,
      r:  r
    }
  });

  var circlePaths = [];
  for (var i = 0, l = circleData.length; i < l; i++) {
    var circlePath = new Path.Circle({
      center: [circleData[i].x, circleData[i].y],
      radius: circleData[i].r/100
    });
    circlePaths.push(circlePath);
  }

  if (!largeCircle) {
    largeCircle = new Path.Circle({
      center: [676, 433],
      radius: bigCircleRadius
    });
    console.log({largeCircle});
  }

  circlePaths.push(largeCircle);

  listener = (event) => {
    if (event.target == canvas) {
      largeCircle.fillColor = "rgb(20, 33, 66)";
    } else {
      largeCircle.fillColor = "rgba(164, 255, 228,0)";
      return;
    }
    largeCircle.position = new Point(event.offsetX, event.offsetY);
    generateConnections(circlePaths);
    paper.view.draw();
  };

  document.addEventListener("mousemove", listener);

  var connections = new Group();
  function generateConnections(paths) {
    // Remove the last connection paths:
    connections.children = [];

    for (var i = 0, l = paths.length; i < l; i++) {
      for (var j = i - 1; j >= 0; j--) {
        var path = metaball(paths[i], paths[j], v, handleLengthRate, maxDistance);
        if (path) {
          connections.appendTop(path);
          path.removeOnMove();
        }
      }
    }
  }

  generateConnections(circlePaths);
  paper.view.draw();

  // ---------------------------------------------
  function metaball(ball1, ball2, v, handleLengthRate, maxDistance) {
    var center1 = ball1.position;
    var center2 = ball2.position;
    var radius1 = ball1.bounds.width / 2;
    var radius2 = ball2.bounds.width / 2;
    var pi2 = Math.PI / 2;
    var d = center1.getDistance(center2);
    var u1, u2;

    if (radius1 == 0 || radius2 == 0)
      return;

    if (d > maxDistance || d <= Math.abs(radius1 - radius2)) {
      return;
    } else if (d < radius1 + radius2) { // case circles are overlapping
      u1 = Math.acos((radius1 * radius1 + d * d - radius2 * radius2) /
          (2 * radius1 * d));
      u2 = Math.acos((radius2 * radius2 + d * d - radius1 * radius1) /
          (2 * radius2 * d));
    } else {
      u1 = 0;
      u2 = 0;
    }

    var point = new paper.Point(center2.x - center1.x, center2.y - center1.y);

    var an  = point.getAngleInRadians();
    var angle1 = an;

    var angle2 = Math.acos((radius1 - radius2) / d);
    var angle1a = angle1 + u1 + (angle2 - u1) * v;
    var angle1b = angle1 - u1 - (angle2 - u1) * v;
    var angle2a = angle1 + Math.PI - u2 - (Math.PI - u2 - angle2) * v;
    var angle2b = angle1 - Math.PI + u2 + (Math.PI - u2 - angle2) * v;
    var p1a = new Point(center1.x + getVector(angle1a, radius1).x , center1.y + getVector(angle1a, radius1).y);
    var p1b = new Point(center1.x + getVector(angle1b, radius1).x , center1.y + getVector(angle1b, radius1).y);
    var p2a = new Point(center2.x + getVector(angle2a, radius2).x , center2.y + getVector(angle2a, radius2).y);
    var p2b = new Point(center2.x + getVector(angle2b, radius2).x , center2.y + getVector(angle2b, radius2).y);

    // define handle length by the distance between
    // both ends of the curve to draw
    var totalRadius = (radius1 + radius2);
    var pd2 = new Point(p2a.x - p1a.x, p2a.y - p1a.y);
    var d2 = Math.min(v * handleLengthRate, pd2.length / totalRadius);

    // case circles are overlapping:
    d2 *= Math.min(1, d * 2 / (radius1 + radius2));

    radius1 *= d2;
    radius2 *= d2;


    var path = new Path({
      segments: [p1a, p2a, p2b, p1b],
      style: ball1.style,
      closed: true
    });
    var segments = path.segments;
    segments[0].handleOut = getVector(angle1a - pi2, radius1);
    segments[1].handleIn = getVector(angle2a + pi2, radius2);
    segments[2].handleOut = getVector(angle2b - pi2, radius2);
    segments[3].handleIn = getVector(angle1b + pi2, radius1);
    return path;
  }

  // ------------------------------------------------
  function getVector(radians, length) {
    return new Point({
      // Convert radians to degrees:
      angle: radians * 180 / Math.PI,
      length: length
    });
  }
};

module.exports.init = init;
module.exports.render = render;
module.exports.params = params;
