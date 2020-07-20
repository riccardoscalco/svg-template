import {style} from '../style';

export function draw(context, seed) {
	context
		.append('circle')
			.attr('r', 200)
			.style('fill', style.color);
}
