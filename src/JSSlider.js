export default class JSSlider {

    constructor(imagesSelector, sliderRootSelector = '.js-slider') {

        this.imagesSelector = imagesSelector;
        this.sliderRootSelector = sliderRootSelector;
        this.imagesList = document.querySelectorAll(this.imagesSelector);
        this.sliderRootElement = document.querySelector(this.sliderRootSelector);

        this.currentImageClassName = 'js-slider__thumbs-image--current';
        this.sliderPrototypeClassName = 'js-slider__thumbs-item--prototype';
        this.sliderPrototypeElement = document.querySelector(`.${this.sliderPrototypeClassName}`);

        this.intervalId = null;
    }


    run() {
        this.initEvents();
        this.initCustomEvents();
    }

    AddClickEventToExistingElement(element, event) {
        if (element) element.addEventListener('click', () => this.fireCustomEvent(this.sliderRootElement, event));
    }

    initEvents() {
        this.imagesList.forEach(item => {
            item.addEventListener('click', e => {
                this.fireCustomEvent(e.currentTarget, 'js-slider-img-click');
                this.fireCustomEvent(e.currentTarget, 'js-slider-start');
            });
        });

        const navNext = this.sliderRootElement.querySelector('.js-slider__nav--next');
        this.AddClickEventToExistingElement(navNext, 'js-slider-img-next');

        const navPrev = this.sliderRootElement.querySelector('.js-slider__nav--prev');
        this.AddClickEventToExistingElement(navPrev, 'js-slider-img-prev');

        const zoom = this.sliderRootElement.querySelector('.js-slider__zoom'); // zrobic FIND in root slider element
        if (zoom) {
            zoom.addEventListener('click', e => {
                if (e.target === e.currentTarget) {
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-close');
                }
            })
        }

        const sliderArrows = this.sliderRootElement.querySelectorAll('.js-slider__nav');
        sliderArrows.forEach((arrow) => {
            arrow.addEventListener('mouseout', e => this.fireCustomEvent(arrow, 'js-slider-start'));
            arrow.addEventListener('mouseover', e => this.fireCustomEvent(arrow, 'js-slider-stop'));
        });
    }

    fireCustomEvent(element, name) {
        console.log(element.className, '=>', name);

        const event = new CustomEvent(name, {
            bubbles: true,
        });

        element.dispatchEvent(event);
    }

    initCustomEvents() {
        this.imagesList.forEach(img => {
            img.addEventListener('js-slider-img-click', event => this.onImageClick(event));
            img.addEventListener('js-slider-start', event => this.runAutoSlide(event));
        });

        this.sliderRootElement.addEventListener('js-slider-img-next', () => this.onImageNext());
        this.sliderRootElement.addEventListener('js-slider-img-prev', () => this.onImagePrev());
        this.sliderRootElement.addEventListener('js-slider-close', (e) => this.onClose(e));
        this.sliderRootElement.addEventListener('js-slider-start', () => this.runAutoSlide());
        this.sliderRootElement.addEventListener('js-slider-stop', () => this.stopAutoSlide());
    }

    makeSliderContentFromPrototype(clickedElementSrc, thumbsList, prototype) {
        thumbsList.forEach(item => {

            const thumbElement = prototype.cloneNode(true);
            thumbElement.classList.remove(this.sliderPrototypeClassName);
            const thumbImg = thumbElement.querySelector('img');
            thumbImg.src = item.querySelector('img').src;

            if (thumbImg.src === clickedElementSrc) thumbImg.classList.add(this.currentImageClassName);

            document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
        })
    }

    onImageClick(event) {
        this.sliderRootElement.classList.add('js-slider--active');
        const src = event.currentTarget.querySelector('img').src;
        this.sliderRootElement.querySelector('.js-slider__image').src = src;
        const groupName = event.currentTarget.dataset.sliderGroupName;
        const thumbsList = document.querySelectorAll(`${this.imagesSelector}[data-slider-group-name=${groupName}]`);

        this.makeSliderContentFromPrototype(src, thumbsList, this.sliderPrototypeElement);
    }

    isNotPrototype(prevElement) {
        return prevElement && !prevElement.className.includes(this.sliderPrototypeClassName);
    }

    changeCurrentImage(element, currentImageClassName, previouslyCurrentElement) {
        const img = element.querySelector('img')
        img.classList.add(currentImageClassName);

        this.sliderRootElement.querySelector('.js-slider__image').src = img.src;
        previouslyCurrentElement.classList.remove(currentImageClassName);
    }

    onImageNext() {

        const current = this.sliderRootElement.querySelector(`.${this.currentImageClassName}`);
        const parentCurrent = current.parentElement;
        let nextElement = parentCurrent.nextElementSibling;

        if (this.isNotPrototype(nextElement)) this.changeCurrentImage(nextElement, this.currentImageClassName, current);
    }

    onImagePrev() {
        const current = this.sliderRootElement.querySelector(`.${this.currentImageClassName}`);
        const parentCurrent = current.parentElement;
        const prevElement = parentCurrent.previousElementSibling;

        if (this.isNotPrototype(prevElement)) this.changeCurrentImage(prevElement, this.currentImageClassName, current);
    }

    onClose(event) {
        event.currentTarget.classList.remove('js-slider--active');
        const thumbsList = this.sliderRootElement.querySelectorAll(`.js-slider__thumbs-item:not(.${this.sliderPrototypeClassName})`);
        thumbsList.forEach(item => item.parentElement.removeChild(item));

        this.fireCustomEvent(this.sliderRootElement, 'js-slider-stop');
    }

    runAutoSlide() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.fireCustomEvent(this.sliderRootElement, 'js-slider-img-next'), 2000);
    }

    stopAutoSlide() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

}



