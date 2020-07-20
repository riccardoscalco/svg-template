const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const d3 = require('d3');
import {draw} from './src/draw';
import {style} from './style';

const seed = +random.getRandomSeed();

const settings = {
	// For SVG to resize easily we will have to set this to true
	scaleToView: true,
	// Do not append <canvas> element
	parent: false,
	dimensions: [2048, 2048],
	units: "px",
	pixelsPerInch: 300,
	animate: false,
	name: 'commit',
	suffix: `seed-${seed}`,
	prefix: `${Date.now()}`
};

const sketch = ({ width, height }) => {

	// Destroy existing SVG element
	d3.select('body')
		.select('svg')
		.remove();

	// Create a svg element
	const svg = d3.select('body')
		.append('svg')
		.style('box-shadow', '0px 0px 25px #eee');

	// Background
	svg.append('rect')
		.attr('x', 0)
		.attr('y', 0)
		.attr('width', width)
		.attr('height', height)
		.attr('fill', style.bgColor);

	// Draw
	const g = svg
		.append('g')
			.attr('class', 'main-g');

	draw(g, seed);

	// Center
	const bbox = document.querySelector('.main-g').getBBox();
	const dx = (bbox.x + bbox.width / 2) - width / 2;
	const dy = (bbox.y + bbox.height / 2) - height / 2;
	g.attr('transform', `scale(2) translate(${-width / 4 - dx}, ${-height / 4 - dy})`)

	return ({ exporting, width, height, styleWidth, styleHeight }) => {
		// First update the sizes to our viewport
		svg
			.attr('width', styleWidth)
			.attr('height', styleHeight)
			.attr('viewBox', `0 0 ${width} ${height}`);

		// If exporting, serialize SVG to Blob
		if (exporting) {
			// Clone the SVG element and resize to output dimensions
			const copy = d3
				.select(svg.node().cloneNode(true))
				.attr('width', width)
				.attr('height', height);

			// Make a blob out of the SVG and return that
			const data = svgToBlob(copy.node());
			return { data, extension: '.svg' };
		}
	};
};

canvasSketch(sketch, settings);

function svgToBlob (svg) {
	const svgAsXML = new window.XMLSerializer().serializeToString(svg);
	return new window.Blob([ svgAsXML ], { type: 'image/svg+xml' });
}
