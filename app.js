const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];


// If this key doesn't work
// Find the name in the url and go to their website
// to create your own api key
const KEY = '15674931-a9d714b6e9d654524df198e00&q';

// show images  and Alert Box
const showImages = (images) => {
    if (images.length != 0) {
        imagesArea.style.display = 'block';
        gallery.innerHTML = '';
        spinnerToggle();
        // show gallery title
        galleryHeader.style.display = 'flex';
        images.forEach(image => {
            let div = document.createElement('div');
            div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
            div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
            gallery.appendChild(div)
        })
    } else {
        document.getElementById("unsuccessAlert").style.display = "block"
        spinnerToggle();
        document.getElementById('imgContainer').style.display = 'none'
    }
    document.getElementById('cancel').addEventListener("click", function() {
        document.getElementById("unsuccessAlert").style.display = "none"
    })

}

const getImages = (query) => {
    fetch(`https://pixabay.com/api/?key=${KEY}=${query}&image_type=photo&pretty=true`)
        .then(response => response.json())
        .then(data => showImages(data.hits))
        .catch(err => console.log(err))
}

let slideIndex = 0;
const selectItem = (event, img) => {
    let element = event.target;
    element.classList.toggle('added');

    let imgIndex = sliders.indexOf(img);
    if (imgIndex === -1) {
        sliders.push(img);
    } else {
        sliders.splice(imgIndex, 1);
    }
}
var timer
const createSlider = () => {
    // check slider image length
    if (sliders.length < 2) {
        alert('Select at least 2 image.')
        return;
    }

    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
    <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
    <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
    `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    //Taking the Absolute value
    const duration = Math.abs(document.getElementById('duration').value) || 1000;
    sliders.forEach(slide => {
        let item = document.createElement('div')
        item.className = "slider-item";
        item.innerHTML = `<img class="w-100"
      src="${slide}"
      alt="">`;
        sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function() {
        slideIndex++;
        changeSlide(slideIndex);
    }, duration);

    document.getElementById('duration').value = "";

}

// change slider index 
const changeItem = index => {
    changeSlide(slideIndex += index);
}

// change slide item
const changeSlide = (index) => {

    const items = document.querySelectorAll('.slider-item');
    if (index < 0) {
        slideIndex = items.length - 1
        index = slideIndex;
    };

    if (index >= items.length) {
        index = 0;
        slideIndex = 0;
    }

    items.forEach(item => {
        item.style.display = "none"
    })

    items[index].style.display = "block"
}

//Display Spinner
const spinnerToggle = () => {
    const toggleSpinner = document.getElementById('loading-spinner');
    toggleSpinner.classList.toggle('d-none');
}

//Search the images
const search = document.getElementById('search');
searchBtn.addEventListener('click', function() {
    spinnerToggle();
    document.querySelector('.main').style.display = 'none';
    clearInterval(timer);
    const searchText = search.value.trim()
    if (searchText.length != 0) {
        getImages(searchText);
    }
    sliders.length = 0;
    search.value = '';
})

//Searching by enter KeyPress
search.addEventListener("keypress", event => {
    if (event.key === 'Enter') {
        searchBtn.click();
    }
})

//Taking Duration and Creating Slider by enter KeyPress
document.getElementById('duration').addEventListener("keypress", event => {
    if (event.key === 'Enter') {
        sliderBtn.click();
    }
})

sliderBtn.addEventListener('click', function() {
    createSlider()
})


/**** 
Extra Features
1. Snipper show
while loading
2. Alert Box show when don 't find search related images

 */