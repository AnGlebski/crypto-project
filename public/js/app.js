gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

if (ScrollTrigger.isTouch !== 1) {

	// ScrollSmoother.create({
	// 	wrapper: '.wrapper',
	// 	content: '.content',
	// 	smooth: 1.5,
	// 	effects: true
	// })

	gsap.fromTo('.moon', { scale: 1, y: -100, duration: 0, bottom: -805 }, {
		scale: 1.5, y: -300, duration: 1.5, bottom: -950,
		scrollTrigger: {
			trigger: '.moon',
			start: '-700',
			end: 'top',
			scrub: true
		}
	})
}
