/* =============================================================== */
/* SPIS TREŚCI - PLIK MAIN.JS                                      */
/* =============================================================== */
/* 
1. INICJALIZACJA - ustawienia początkowe, stałe i zmienne
2. NAWIGACJA - obsługa menu, płynne przewijanie, nagłówek sticky
3. ANIMACJE - efekty fade-in, balony, Intersection Observer
4. PORTFOLIO - obsługa galerii i lightboxa
5. FORMULARZ - walidacja i obsługa formularza kontaktowego
6. TESTIMONIALS - obsługa slajdera z opiniami
7. PARTNERS - obsługa sekcji partnerów
8. UTILITIES - funkcje pomocnicze, np. scroll-to-top
*/

document.addEventListener('DOMContentLoaded', function () {
	/* =============================================================== */
	/* 1. INICJALIZACJA - ustawienia początkowe, stałe i zmienne       */
	/* =============================================================== */

	// Zapisz często używane elementy DOM jako stałe
	const header = document.querySelector('header')
	const hamburger = document.querySelector('.hamburger')
	const navMenu = document.querySelector('.nav-menu')
	const navigationLinks = document.querySelectorAll('.nav-links li a')
	const hero = document.querySelector('.hero')
	const scrollToTopButton = document.getElementById('scrollToTop')
	const logo = document.querySelector('.logo')
	const isMobile = window.innerWidth <= 768

	/* =============================================================== */
	/* 2. NAWIGACJA - obsługa menu, płynne przewijanie, nagłówek sticky */
	/* =============================================================== */

	// Obsługa menu hamburgerowego na urządzeniach mobilnych
	if (hamburger) {
		hamburger.addEventListener('click', () => {
			// Toggle menu
			hamburger.classList.toggle('active')
			navMenu.classList.toggle('active')
			// Prevent body scrolling when menu is open
			document.body.classList.toggle('menu-open')
		})
	}

	// Zamykanie menu po kliknięciu w link
	navigationLinks.forEach(link => {
		link.addEventListener('click', () => {
			hamburger.classList.remove('active')
			navMenu.classList.remove('active')
			document.body.classList.remove('menu-open')
		})
	})

	// Zamykanie menu po kliknięciu poza obszar menu
	document.addEventListener('click', e => {
		// Check if menu is active and the click is outside the menu and hamburger
		if (
			navMenu &&
			navMenu.classList.contains('active') &&
			!navMenu.contains(e.target) &&
			!hamburger.contains(e.target)
		) {
			hamburger.classList.remove('active')
			navMenu.classList.remove('active')
			document.body.classList.remove('menu-open')
		}
	})

	// Płynne przewijanie dla linków kotwicznych
	const links = document.querySelectorAll('a[href^="#"]')

	for (const link of links) {
		link.addEventListener('click', smoothScroll)
	}

	// Funkcja realizująca płynne przewijanie do elementu
	function smoothScroll(e) {
		e.preventDefault()

		const targetId = this.getAttribute('href')
		if (targetId === '#') return

		const targetElement = document.querySelector(targetId)
		const headerOffset = 80
		const elementPosition = targetElement.getBoundingClientRect().top
		const offsetPosition = elementPosition + window.pageYOffset - headerOffset

		window.scrollTo({
			top: offsetPosition,
			behavior: 'smooth',
		})
	}

	// Nagłówek sticky podczas przewijania
	window.addEventListener('scroll', function () {
		if (window.scrollY > 100) {
			header.classList.add('sticky')
		} else {
			header.classList.remove('sticky')
		}
	})

	/**
	 * Scroll Spy dla strony Ewy Jakubas
	 * Śledzi pozycję przewijania i aktualizuje aktywne linki w menu
	 */

	// Pobranie wszystkich sekcji, które będziemy śledzić
	const sections = document.querySelectorAll('section[id]')

	// Pobranie linków nawigacyjnych - używam istniejącej klasy .nav-links li a
	const navLinks = document.querySelectorAll('.nav-links li a')

	// Funkcja do obsługi przewijania
	function scrollSpy() {
		// Aktualna pozycja przewijania
		const scrollPosition = window.scrollY

		// Sprawdzanie każdej sekcji
		sections.forEach(section => {
			// Dodanie offsetu, aby uwzględnić wysokość nagłówka
			const navHeight = document.querySelector('header').offsetHeight
			const offsetTop = section.offsetTop - navHeight - 100
			const offsetBottom = offsetTop + section.offsetHeight

			// Sprawdzenie, czy jesteśmy w danej sekcji
			if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
				// Usunięcie klasy 'active' ze wszystkich linków
				navLinks.forEach(link => {
					link.classList.remove('active')
				})

				// Dodanie klasy 'active' do odpowiedniego linku
				const correspondingLink = document.querySelector(`.nav-links li a[href="#${section.id}"]`)
				if (correspondingLink) {
					correspondingLink.classList.add('active')
				}
			}
		})
	}

	// Dodanie nasłuchiwania na zdarzenie przewijania
	window.addEventListener('scroll', scrollSpy)

	// Wywołanie funkcji przy załadowaniu, aby ustawić początkowy stan
	scrollSpy()

	/* =============================================================== */
	/* 3. ANIMACJE - efekty fade-in, balony, Intersection Observer     */
	/* =============================================================== */

	// Intersection Observer dla animacji fade-in
	const fadeObserverOptions = {
		threshold: 0.1,
	}

	const fadeObserver = new IntersectionObserver(entries => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible')
			}
		})
	}, fadeObserverOptions)

	// Obserwuj wszystkie sekcje dla efektu fade-in
	document.querySelectorAll('section').forEach(section => {
		section.classList.add('fade-in')
		fadeObserver.observe(section)
	})

	// Animacja kart usług
	const serviceCards = document.querySelectorAll('.service-card')
	const cardObserverOptions = {
		threshold: 0.2,
		rootMargin: '0px',
	}

	const cardObserver = new IntersectionObserver(function (entries, observer) {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
				entry.target.classList.add('visible')
			}
		})
	}, cardObserverOptions)

	serviceCards.forEach(card => {
		card.classList.add('fade-in')
		cardObserver.observe(card)
	})

	// Funkcja tworząca animowane balony w sekcji hero
	function createBalloon() {
		if (!hero || isMobile) return

		// Limit liczby balonów
		const balloons = document.querySelectorAll('.hero-balloon')
		if (balloons.length >= 10) return

		const colors = ['#ff69b4', '#8a2be2', '#00bfff', '#ff6347', '#32cd32']
		const balloon = document.createElement('div')
		const size = Math.random() * 30 + 20
		const color = colors[Math.floor(Math.random() * colors.length)]
		const animationDuration = Math.random() * 10 + 15
		const floatDelay = Math.random() * 2

		balloon.classList.add('hero-balloon')
		balloon.style.position = 'absolute'
		balloon.style.bottom = '-50px'
		balloon.style.left = Math.random() * 90 + 5 + '%'
		balloon.style.width = size + 'px'
		balloon.style.height = size * 1.2 + 'px'
		balloon.style.borderRadius = '50% 50% 50% 50% / 40% 40% 60% 60%'
		balloon.style.background = color
		balloon.style.opacity = '0.7'
		balloon.style.zIndex = '10'

		// Add shadow for 3D effect
		balloon.style.boxShadow = `inset -2px -2px 4px rgba(0,0,0,0.2), inset 2px 2px 4px rgba(255,255,255,0.2)`

		// Add animation
		balloon.style.animation = `
            float-up ${animationDuration}s ease-in-out ${floatDelay}s forwards,
            sway-balloon ${3 + Math.random() * 2}s ease-in-out infinite alternate,
            wobble-balloon ${2 + Math.random() * 2}s ease-in-out infinite
        `

		// Create string
		const string = document.createElement('div')
		string.classList.add('balloon-string')
		string.style.position = 'absolute'
		string.style.width = '1px'
		string.style.height = size * 1.5 + 'px'
		string.style.background = 'rgba(255,255,255,0.7)'
		string.style.top = '100%'
		string.style.left = '50%'
		string.style.transformOrigin = 'top'
		string.style.animation = `string-wave ${2 + Math.random()}s ease-in-out infinite alternate`

		balloon.appendChild(string)
		hero.appendChild(balloon)

		// Remove balloon after animation completes
		setTimeout(() => {
			if (balloon.parentNode === hero) {
				hero.removeChild(balloon)
			}
		}, (animationDuration + floatDelay) * 1000)
	}

	// Inicjalizacja balonów (tylko na desktopach)
	if (hero && !isMobile) {
		// Początkowe balony
		for (let i = 0; i < 3; i++) {
			setTimeout(createBalloon, i * 1500)
		}

		// Kontynuuj tworzenie balonów z rzadszym interwałem
		setInterval(createBalloon, 3000 + Math.random() * 2000)
	}

	/* =============================================================== */
	/* 4. PORTFOLIO - obsługa galerii i lightboxa                      */
	/* =============================================================== */

	// Interaktywna galeria portfolio
	const portfolioItems = document.querySelectorAll('.portfolio-container .portfolio-item')
	const hiddenPortfolioItems = document.querySelectorAll('.hidden-portfolio-items .portfolio-item')
	const portfolioData = []

	// Elementy lightboxa
	const lightbox = document.getElementById('portfolioLightbox')
	const lightboxImg = lightbox.querySelector('.lightbox-image')
	const lightboxTitle = lightbox.querySelector('.lightbox-title')
	const lightboxDesc = lightbox.querySelector('.lightbox-description')
	const lightboxClose = lightbox.querySelector('.lightbox-close')
	const lightboxNext = lightbox.querySelector('.lightbox-next')
	const lightboxPrev = lightbox.querySelector('.lightbox-prev')

	let currentIndex = 0

	// Zbierz dane o wszystkich elementach portfolio (widocznych i ukrytych)
	function collectPortfolioData() {
		portfolioData.length = 0 // Wyczyszczenie tablicy

		// Dodaj widoczne elementy
		portfolioItems.forEach((item, index) => {
			const img = item.querySelector('img')
			const overlay = item.querySelector('.portfolio-overlay')
			const title = overlay.querySelector('h3')?.textContent || img.alt
			const description = overlay.querySelector('p')?.textContent || ''

			portfolioData.push({
				src: img.src,
				alt: img.alt,
				title: title,
				description: description,
			})

			// Dodaj obsługę kliknięcia
			item.addEventListener('click', function () {
				openLightbox(index)
			})
		})

		// Dodaj ukryte elementy
		hiddenPortfolioItems.forEach((item, hiddenIndex) => {
			const img = item.querySelector('img')
			const overlay = item.querySelector('.portfolio-overlay')
			const title = overlay.querySelector('h3')?.textContent || img.alt
			const description = overlay.querySelector('p')?.textContent || ''

			// Dodaj do tablicy z indeksem po widocznych elementach
			portfolioData.push({
				src: img.src,
				alt: img.alt,
				title: title,
				description: description,
			})
		})
	}

	// Wywołaj funkcję zbierającą dane podczas inicjalizacji
	collectPortfolioData()

	// Funkcja otwierająca lightbox
	function openLightbox(index) {
		if (index >= 0 && index < portfolioData.length) {
			currentIndex = index
			updateLightboxContent()
			lightbox.classList.add('active')
			document.body.classList.add('lightbox-open')
		}
	}

	// Funkcja aktualizująca zawartość lightboxa
	function updateLightboxContent() {
		const item = portfolioData[currentIndex]
		lightboxImg.src = item.src
		lightboxImg.alt = item.alt
		lightboxTitle.textContent = item.title
		lightboxDesc.textContent = item.description
	}

	// Zamykanie lightboxa
	lightboxClose.addEventListener('click', closeLightbox)
	lightbox.addEventListener('click', function (e) {
		if (e.target === lightbox) {
			closeLightbox()
		}
	})

	// Funkcja zamykająca lightbox
	function closeLightbox() {
		lightbox.classList.remove('active')
		document.body.classList.remove('lightbox-open')
	}

	// Obsługa klawiatury dla lightboxa
	document.addEventListener('keydown', function (e) {
		if (!lightbox.classList.contains('active')) return

		if (e.key === 'Escape') {
			closeLightbox()
		} else if (e.key === 'ArrowRight') {
			nextImage()
		} else if (e.key === 'ArrowLeft') {
			prevImage()
		}
	})

	// Nawigacja do następnego obrazu
	lightboxNext.addEventListener('click', nextImage)

	function nextImage() {
		currentIndex = (currentIndex + 1) % portfolioData.length
		updateLightboxContent()
	}

	// Nawigacja do poprzedniego obrazu
	lightboxPrev.addEventListener('click', prevImage)

	function prevImage() {
		currentIndex = (currentIndex - 1 + portfolioData.length) % portfolioData.length
		updateLightboxContent()
	}

	// Obsługa gestów dotykowych dla lightboxa
	let touchStartX = 0
	let touchEndX = 0

	lightbox.addEventListener('touchstart', function (e) {
		touchStartX = e.changedTouches[0].screenX
	})

	lightbox.addEventListener('touchend', function (e) {
		touchEndX = e.changedTouches[0].screenX
		handleSwipeLightbox()
	})

	function handleSwipeLightbox() {
		if (touchEndX < touchStartX - 50) {
			nextImage() // przesunięcie w lewo, pokaż następny
		}
		if (touchEndX > touchStartX + 50) {
			prevImage() // przesunięcie w prawo, pokaż poprzedni
		}
	}

	/* =============================================================== */
	/* 5. FORMULARZ - walidacja i obsługa formularza kontaktowego      */
	/* =============================================================== */

	// Obsługa formularza kontaktowego
	const contactForm = document.querySelector('.contact-form form')

	if (contactForm) {
		contactForm.addEventListener('submit', function (e) {
			e.preventDefault()

			// Create FormData object
			const formData = new FormData(this)
			const formDataObj = {}

			// Convert FormData to object
			for (let [key, value] of formData.entries()) {
				formDataObj[key] = value
			}

			// Walidacja danych
			let isValid = true
			const nameInput = this.querySelector('input[name="name"]')
			const emailInput = this.querySelector('input[name="email"]')
			const messageInput = this.querySelector('textarea[name="message"]')

			// Prosta walidacja email
			function validateEmail(email) {
				const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
				return re.test(String(email).toLowerCase())
			}

			if (nameInput.value.trim() === '') {
				isValid = false
				nameInput.classList.add('error')
			} else {
				nameInput.classList.remove('error')
			}

			if (!validateEmail(emailInput.value)) {
				isValid = false
				emailInput.classList.add('error')
			} else {
				emailInput.classList.remove('error')
			}

			if (messageInput.value.trim() === '') {
				isValid = false
				messageInput.classList.add('error')
			} else {
				messageInput.classList.remove('error')
			}

			if (!isValid) {
				// Pokaż komunikat o błędzie
				alert('Proszę wypełnić poprawnie wszystkie wymagane pola formularza.')
				return
			}

			// Tutaj byłoby wysłanie formularza - przykład z użyciem fetch
			// fetch('https://example.com/submit-form', {
			//   method: 'POST',
			//   headers: {
			//     'Content-Type': 'application/json',
			//   },
			//   body: JSON.stringify(formDataObj),
			// })
			// .then(response => response.json())
			// .then(data => {
			//   console.log('Success:', data);
			//   // Pokazanie komunikatu sukcesu
			//   this.reset();
			//   alert('Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.');
			// })
			// .catch((error) => {
			//   console.error('Error:', error);
			//   alert('Wystąpił błąd podczas wysyłania formularza. Prosimy spróbować później.');
			// });

			// Tymczasowo symulujemy sukces
			console.log('Form data:', formDataObj)
			this.reset()
			alert('Dziękujemy za wiadomość! Odpowiemy najszybciej jak to możliwe.')
		})
	}

	/* =============================================================== */
	/* 6. TESTIMONIALS - obsługa slajdera z opiniami                   */
	/* =============================================================== */

	// Elementy slajdera z opiniami
	const testimonialsSlider = document.querySelector('.testimonials-slider')
	const testimonialsWrapper = document.querySelector('.testimonials-wrapper')
	const testimonialCards = document.querySelectorAll('.testimonial-card')
	const prevButton = document.querySelector('.slider-prev')
	const nextButton = document.querySelector('.slider-next')
	const dotsContainer = document.querySelector('.testimonials-dots')

	if (testimonialsSlider && testimonialsWrapper && testimonialCards.length > 0) {
		let currentIndex = 0
		let cardWidth
		let cardsPerView
		let totalSlides
		let autoPlayInterval

		// Funkcja do aktualizacji wymiarów slajdera
		function updateSliderDimensions() {
			const sliderWidth = testimonialsSlider.offsetWidth

			// Określenie ile kart wyświetlać jednocześnie w zależności od szerokości ekranu
			if (window.innerWidth >= 992) {
				cardsPerView = 3
			} else if (window.innerWidth >= 768) {
				cardsPerView = 2
			} else {
				cardsPerView = 1
			}

			// Obliczanie szerokości karty z uwzględnieniem marginesów
			cardWidth = sliderWidth / cardsPerView
			totalSlides = Math.ceil(testimonialCards.length / cardsPerView)

			// Aktualizacja szerokości kart
			testimonialCards.forEach(card => {
				card.style.flex = `0 0 ${cardWidth - 30}px`
			})

			// Resetowanie pozycji slajdera
			currentIndex = 0
			updateSliderPosition()
			createDots()
		}

		// Funkcja do przechodzenia do następnego slajdu
		function goToNextSlide() {
			currentIndex = (currentIndex + 1) % totalSlides
			updateSliderPosition()
		}

		// Funkcja do przechodzenia do poprzedniego slajdu
		function goToPrevSlide() {
			currentIndex = (currentIndex - 1 + totalSlides) % totalSlides
			updateSliderPosition()
		}

		// Funkcja do aktualizacji pozycji slajdera
		function updateSliderPosition() {
			// Płynne przejście do żądanej pozycji
			testimonialsWrapper.style.transition = 'transform 0.5s ease'

			// Obliczanie przesunięcia na podstawie aktualnego indeksu i szerokości karty
			const offset =
				-currentIndex * cardWidth * Math.min(cardsPerView, testimonialCards.length - (totalSlides - 1) * cardsPerView)
			testimonialsWrapper.style.transform = `translateX(${offset}px)`

			updateDots()
		}

		// Tworzenie kropek nawigacyjnych
		function createDots() {
			dotsContainer.innerHTML = ''

			for (let i = 0; i < totalSlides; i++) {
				const dot = document.createElement('span')
				dot.classList.add('dot')
				if (i === 0) dot.classList.add('active')

				dot.addEventListener('click', () => {
					currentIndex = i
					updateSliderPosition()
					resetAutoPlay()
				})

				dotsContainer.appendChild(dot)
			}
		}

		// Aktualizacja aktywnej kropki
		function updateDots() {
			const dots = document.querySelectorAll('.dot')
			dots.forEach((dot, index) => {
				if (index === currentIndex) {
					dot.classList.add('active')
				} else {
					dot.classList.remove('active')
				}
			})
		}

		// Obsługa przycisków nawigacyjnych slajdera
		prevButton.addEventListener('click', () => {
			goToPrevSlide()
			resetAutoPlay()
		})

		nextButton.addEventListener('click', () => {
			goToNextSlide()
			resetAutoPlay()
		})

		// Obsługa przewijania dotykowego dla slajdera
		let testimonialsTouchStartX = 0
		let testimonialsTouchEndX = 0

		testimonialsSlider.addEventListener('touchstart', e => {
			testimonialsTouchStartX = e.changedTouches[0].screenX
			// Wstrzymaj automatyczne przewijanie podczas dotyku
			clearInterval(autoPlayInterval)
		})

		testimonialsSlider.addEventListener('touchend', e => {
			testimonialsTouchEndX = e.changedTouches[0].screenX
			handleTestimonialsSwipe()
			// Wznów automatyczne przewijanie po zakończeniu dotyku
			startAutoPlay()
		})

		function handleTestimonialsSwipe() {
			if (testimonialsTouchEndX < testimonialsTouchStartX - 50) {
				// Przesunięcie w lewo - następna opinia
				goToNextSlide()
			}

			if (testimonialsTouchEndX > testimonialsTouchStartX + 50) {
				// Przesunięcie w prawo - poprzednia opinia
				goToPrevSlide()
			}
		}

		// Automatyczne przewijanie slajdera
		function startAutoPlay() {
			autoPlayInterval = setInterval(() => {
				goToNextSlide()
			}, 5000) // Przewijaj co 5 sekund
		}

		function resetAutoPlay() {
			clearInterval(autoPlayInterval)
			startAutoPlay()
		}

		// Wstrzymanie/wznowienie automatycznego przewijania przy najechaniu myszą
		testimonialsSlider.addEventListener('mouseenter', () => {
			clearInterval(autoPlayInterval)
		})

		testimonialsSlider.addEventListener('mouseleave', () => {
			startAutoPlay()
		})

		// Inicjalizacja slajdera
		updateSliderDimensions()
		startAutoPlay()

		// Aktualizacja przy zmianie rozmiaru okna
		window.addEventListener('resize', () => {
			updateSliderDimensions()
			resetAutoPlay()
		})

		// Dodawanie kart opinii do listy elementów z animacją fade-in
		testimonialCards.forEach(card => {
			card.classList.add('fade-in')
			fadeObserver.observe(card)
		})
	}

	/* =============================================================== */
	/* 7. PARTNERS - obsługa sekcji partnerów                          */
	/* =============================================================== */

	// Obsługa sekcji z partnerami
	const partnersSection = document.querySelector('.partners')

	if (partnersSection) {
		const partnersTrack = document.querySelector('.partners-track')
		const partnerLogos = document.querySelectorAll('.partner-logo')

		// Obserwator Intersection Observer dla animacji partnerów
		const partnersObserver = new IntersectionObserver(entries => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					// Aktywuj animację tylko gdy sekcja jest widoczna
					partnersTrack.style.animationPlayState = 'running'
				} else {
					// Zatrzymaj animację gdy sekcja nie jest widoczna (oszczędność zasobów)
					partnersTrack.style.animationPlayState = 'paused'
				}
			})
		})

		// Obserwuj sekcję partnerów
		partnersObserver.observe(partnersSection)

		// Dynamicznie dostosuj szerokość paska do liczby logotypów
		function updatePartnersTrackWidth() {
			const logoWidth = partnerLogos[0].offsetWidth
			const totalWidth = logoWidth * partnerLogos.length
			partnersTrack.style.width = `${totalWidth}px`
		}

		// Aktualizuj przy załadowaniu i zmianie rozmiaru okna
		window.addEventListener('load', updatePartnersTrackWidth)
		window.addEventListener('resize', updatePartnersTrackWidth)
	}

	/* =============================================================== */
	/* 8. UTILITIES - funkcje pomocnicze, np. scroll-to-top            */
	/* =============================================================== */

	// Obsługa przycisku Scroll to Top
	window.addEventListener('scroll', () => {
		if (window.pageYOffset > 1000) {
			scrollToTopButton.classList.add('visible')
		} else {
			scrollToTopButton.classList.remove('visible')
		}
	})

	// Przewijanie do góry po kliknięciu przycisku
	scrollToTopButton.addEventListener('click', () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	})
})
