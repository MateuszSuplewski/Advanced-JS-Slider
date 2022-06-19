export default class JSSlider {

    constructor(imagesSelector, sliderRootSelector = '.js-slider') {

        this.imagesSelector = imagesSelector;
        this.sliderRootSelector = sliderRootSelector;
        this.imagesList = document.querySelectorAll(this.imagesSelector);
        this.sliderRootElement = document.querySelector(this.sliderRootSelector);

        this.currentClassName = 'js-slider__thumbs-image--current';
        this.sliderPrototypeClassName = 'js-slider__thumbs-item--prototype';
        this.sliderPrototypeElement = document.querySelector(`.${this.sliderPrototypeClassName}`); // dodać przekształconą implementacje niżej dla currClassname,element i sliderprot!
        console.log(this.sliderPrototypeElement);
    }


    run() {
        this.initEvents();
        this.initCustomEvents();
    }

    AddClickEventToExistingElement(element, event) {
        if (element) {
            element.addEventListener('click', e => this.fireCustomEvent(this.sliderRootElement, event));
        }
    }

    initEvents() {
        this.imagesList.forEach(item => {
            item.addEventListener('click', e => {
                this.fireCustomEvent(e.currentTarget, 'js-slider-img-click');
            });
        });


        // todo: 
        // utwórz event o nazwie [click], który ma uruchomić event [js-slider-img-next]
        // na elemencie [.js-slider__nav--next]
        const navNext = this.sliderRootElement.querySelector('.js-slider__nav--next'); // być może this?
        this.AddClickEventToExistingElement(navNext, 'js-slider-img-next');

        // todo:
        // utwórz event o nazwie [click], który ma uruchomić event [js-slider-img-prev]
        // na elemencie [.js-slider__nav--prev]
        const navPrev = this.sliderRootElement.querySelector('.js-slider__nav--prev');
        this.AddClickEventToExistingElement(navPrev, 'js-slider-img-prev');

        // todo:
        // utwórz event o nazwie [click], który ma uruchomić event [js-slider-close]
        // tylko wtedy gdy użytkownik kliknie w [.js-slider__zoom]
        const zoom = this.sliderRootElement.querySelector('.js-slider__zoom'); // zrobic FIND in root slider element

        if (zoom) {
            zoom.addEventListener('click', e => {
                if (e.target === e.currentTarget) {
                    this.fireCustomEvent(this.sliderRootElement, 'js-slider-close');
                }
            })
        }
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
            img.addEventListener('js-slider-img-click', event => {
                this.onImageClick(event);
            });
        });

        this.sliderRootElement.addEventListener('js-slider-img-next', () => this.onImageNext());
        this.sliderRootElement.addEventListener('js-slider-img-prev', () => this.onImagePrev());
        this.sliderRootElement.addEventListener('js-slider-close', this.onClose);
    }

    makeSliderContentFromPrototype(clickedElementSrc, thumbsList, prototype) {
        thumbsList.forEach(item => {

            const thumbElement = prototype.cloneNode(true);
            thumbElement.classList.remove(this.sliderPrototypeClassName);

            const thumbImg = thumbElement.querySelector('img');
            thumbImg.src = item.querySelector('img').src;

            if (thumbImg.src === clickedElementSrc) {
                thumbImg.classList.add(this.currentClassName); // 6
            }

            document.querySelector('.js-slider__thumbs').appendChild(thumbElement);
        })
    }

    onImageClick(event) {
        // todo:  
        // 1. dodać klasę [js-slider--active], aby pokazać całą sekcję
        // 2. wyszukać ściężkę do klikniętego elementu i wstawić do [.js-slider__image]
        // 3. pobrać nazwę grupy zapisaną w dataset klikniętego elementu
        // 4. wyszukać wszystkie zdjęcia należące do danej grupy
        // 5. utworzyć na podstawie elementu [.js-slider__thumbs-item--prototype] zawartość dla [.js-slider__thumbs]
        // 6. zaznaczyć przy pomocy klasy [.js-slider__thumbs-image--current], który element jest aktualnie wyświetlany
        this.sliderRootElement.classList.add('js-slider--active'); // 1

        const src = event.currentTarget.querySelector('img').src;
        this.sliderRootElement.querySelector('.js-slider__image').src = src; // 2

        const groupName = event.currentTarget.dataset.sliderGroupName; // 3

        const thumbsList = document.querySelectorAll(`${this.imagesSelector}[data-slider-group-name=${groupName}]`); // 4

        this.makeSliderContentFromPrototype(src, thumbsList, this.sliderPrototypeElement); // 5  // 6
    }

    isNotPrototype(prevElement) {
        return prevElement && !prevElement.className.includes(this.sliderPrototypeClassName); // 3
    }

    changeCurrentImage(element, currentClassName, previouslyCurrentElement) {
        const img = element.querySelector('img')
        img.classList.add(currentClassName);

        this.sliderRootElement.querySelector('.js-slider__image').src = img.src; // 5
        previouslyCurrentElement.classList.remove(currentClassName); // 4
    }


    onImageNext() {
        console.log(this, 'onImageNext');
        // [this] wskazuje na element [.js-slider] // czyli na sliderRootElement!
        // todo:
        // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
        // 2. znaleźć element następny do wyświetlenie względem drzewa DOM
        // 3. sprawdzić czy ten element istnieje
        // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
        // 5. podmienić atrybut src dla [.js-slider__image]
        const current = this.sliderRootElement.querySelector(`.${this.currentClassName}`); // 1

        const parentCurrent = current.parentElement;
        const nextElement = parentCurrent.nextElementSibling;

        if (this.isNotPrototype(nextElement)) this.changeCurrentImage(nextElement, this.currentClassName, current);
    }



    onImagePrev() {
        console.log(this, 'onImagePrev');
        // [this] wskazuje na element [.js-slider]

        // todo:
        // 1. wyszukać aktualny wyświetlany element przy pomocy [.js-slider__thumbs-image--current]
        // 2. znaleźć element poprzedni do wyświetlenie względem drzewa DOM
        // 3. sprawdzić czy ten element istnieje i czy nie posiada klasy [.js-slider__thumbs-item--prototype]
        // 4. przełączyć klasę [.js-slider__thumbs-image--current] do odpowiedniego elementu
        // 5. podmienić atrybut src dla [.js-slider__image]
        const current = this.sliderRootElement.querySelector(`.${this.currentClassName}`); // 1

        const parentCurrent = current.parentElement;
        const prevElement = parentCurrent.previousElementSibling; // 2

        if (this.isNotPrototype(prevElement)) this.changeCurrentImage(prevElement, this.currentClassName, current);
    }

    onClose(event) {

        event.currentTarget.classList.remove('js-slider--active');
        const thumbsList = this.querySelectorAll(`.js-slider__thumbs-item:not(${this.sliderPrototypeElement})`);
        thumbsList.forEach(item => item.parentElement.removeChild(item));
    }
}



