const WORD_MS = 2000;
const FADE_MS = 500;

const ICONS = {
	investors: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3.5 20V10.2h4.1V20H3.5Zm6.4 0V5.6h4.2V20H9.9Zm6.5 0V2.8H20.5V20h-4.1Z"/></svg>',
	cards: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8.6" y="1.6" width="12.6" height="15.2" rx="1.8" style="fill:none;stroke:currentColor;stroke-width:1.8"/><rect x="2.4" y="7" width="12.6" height="15.2" rx="1.8"/></svg>',
	sports: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>',
	collectors: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5 3.2 9.2 12 22.5 20.8 9.2 12 1.5Z"/></svg>'
};

const PEOPLE = [
	{
		word: 'investors',
		label: 'Investors',
		short: 'Investors',
		bg: '#2a0a3d',
		fg: '#dcb3ff',
		avatar: '#b46cf8',
		icon: 'investors',
		wash: 'radial-gradient(52% 46% at 100% 100%, #7ed2fb 0%, rgba(126,210,251,.85) 40%, rgba(126,210,251,0) 74%), radial-gradient(46% 44% at 0% 100%, #f2ca8e 0%, rgba(242,202,142,.82) 40%, rgba(242,202,142,0) 72%), radial-gradient(64% 46% at 44% 6%, #b298ee 0%, rgba(178,152,238,.9) 34%, rgba(178,152,238,0) 72%), linear-gradient(178deg, #e285a5 0%, #ec8c9d 40%, #eda092 72%, #efb98a 100%)'
	},
	{
		word: 'card enthusiasts',
		label: 'Card enthusiasts',
		short: 'Cards',
		bg: '#29230f',
		fg: '#ffeaaf',
		avatar: '#ffdf87',
		icon: 'cards',
		wash: 'radial-gradient(70% 80% at 20% 0%, rgba(255,234,104,.96) 0%, rgba(255,234,104,0) 70%), radial-gradient(60% 70% at 100% 100%, rgba(255,187,152,.7) 0%, rgba(255,187,152,0) 72%), linear-gradient(160deg, #f0c56a, #e7a15a 70%, #f3d7a2)'
	},
	{
		word: 'sports fans',
		label: 'Sports fans',
		short: 'Sports',
		bg: '#032030',
		fg: '#a6e2fe',
		avatar: '#67cffd',
		icon: 'sports',
		wash: 'radial-gradient(60% 70% at 0% 0%, rgba(126,221,255,.91) 0%, rgba(126,221,255,0) 70%), radial-gradient(50% 60% at 100% 100%, rgba(97,88,229,.7) 0%, rgba(97,88,229,0) 74%), linear-gradient(160deg, #7ed2fb, #6d8ef0 55%, #c98cff)'
	},
	{
		word: 'collectors',
		label: 'Collectors',
		short: 'Collectors',
		bg: '#2d0d0e',
		fg: '#ffc4c5',
		avatar: '#ffa7a9',
		icon: 'collectors',
		wash: 'radial-gradient(32% 30% at 10% -2%, rgba(242,202,142,.95) 0%, rgba(242,202,142,0) 100%), radial-gradient(46% 52% at 92% 104%, rgba(178,152,238,.9) 0%, rgba(178,152,238,0) 78%), linear-gradient(96deg, #ff8b8d 0%, #f6a08a 52%, #f0ab89 100%)'
	}
];

const face = (person, classes) =>
	`<span class="hero__face ${classes}">${ICONS[person.icon]}<span>${person.word}</span></span>`;

export const initHero = () => {
	const hero = document.querySelector('.hero');
	if (!hero) return;
	const chip = hero.querySelector('.hero__chip');
	const stage = hero.querySelector('.hero__chip-stage');
	const live = document.getElementById('hero-live');
	const line = hero.querySelector('.hero__line');
	const where = hero.querySelector('.hero__where');
	const tail = hero.querySelector('.hero__tail');
	const wash = hero.querySelector('.hero__wash');
	const more = hero.querySelector('.hero__dl-more');
	const menu = hero.querySelector('.hero__platforms');
	if (!chip || !stage || !live || !wash) return;

	const measurer = document.createElement('span');
	measurer.className = 'hero__face';
	measurer.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none;';
	chip.appendChild(measurer);

	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let index = 0;
	let timer = 0;
	let generation = 0;

	const widthFor = (person) => {
		measurer.innerHTML = `${ICONS[person.icon]}<span>${person.word}</span>`;
		return Math.ceil(measurer.getBoundingClientRect().width);
	};

	const fitLine = () => {
		where.classList.remove('is-wrapped');
		tail.classList.remove('is-wrapped');
		const limit = line.clientWidth + 0.5;
		if (line.scrollWidth > limit) tail.classList.add('is-wrapped');
		if (line.scrollWidth > limit) where.classList.add('is-wrapped');
	};

	const setWidth = (width, immediate) => {
		if (immediate) stage.style.transition = 'none';
		stage.style.width = `${width}px`;
		if (immediate) {
			void stage.offsetWidth;
			stage.style.transition = '';
		}
	};

	const show = (next, animate) => {
		const person = PEOPLE[next];
		const gen = ++generation;
		chip.style.backgroundColor = person.bg;
		chip.style.color = person.fg;
		live.textContent = `Where ${person.word} connect together`;
		setWidth(widthFor(person), !animate || reduced);

		if (!animate || reduced) {
			stage.innerHTML = face(person, '');
		} else {
			stage.querySelectorAll('.hero__face').forEach((current) => {
				current.classList.remove('is-in');
				current.classList.add('is-out');
			});
			stage.insertAdjacentHTML('beforeend', face(person, 'is-in'));
			window.setTimeout(() => {
				if (gen !== generation) return;
				stage.querySelectorAll('.hero__face.is-out').forEach((node) => node.remove());
			}, FADE_MS + 60);
		}
		window.requestAnimationFrame(fitLine);
	};

	const advance = () => {
		index = (index + 1) % PEOPLE.length;
		show(index, true);
	};

	const start = () => {
		if (reduced || timer) return;
		timer = window.setInterval(advance, WORD_MS);
	};

	const stop = () => {
		window.clearInterval(timer);
		timer = 0;
	};

	show(0, false);
	start();
	window.addEventListener('resize', () => {
		setWidth(widthFor(PEOPLE[index]), true);
		fitLine();
	});
	document.addEventListener('visibilitychange', () => {
		if (document.hidden) {
			stop();
			return;
		}
		show(index, false);
		start();
	});

	if (more && menu) {
		more.addEventListener('click', () => {
			const open = menu.hasAttribute('hidden');
			menu.toggleAttribute('hidden', !open);
			more.setAttribute('aria-expanded', open ? 'true' : 'false');
		});
	}
};
