/**override to add loopable capability */
class CustomAudio extends Audio {
    resumeWhenActive = false;
    isPlaying = false;
    constructor(path, loop = false) {
        super(path);
        loop && this.loopInit();
        this.checkActivity();
    }

    /**Initialize loop as the audio ends */
    loopInit() {
        this.addEventListener('ended', () => {
            this.currentText = 0;
            this.play();
        })
    }

    /**play or pause on inactive tab */
    checkActivity() {
        window.addEventListener('focus', () => {
            this.resumeWhenActive && this.play();

        });
        window.addEventListener('blur', () => {
            this.resumeWhenActive = this.isPlaying;
            this.pause();
        });
    }

    /**override to determine if an audio is running or not  */
    play(){
        super.play();
        this.isPlaying = true;
    }

    /**override to determine if an audio is running or not  */
    pause(){
        super.pause();
        this.isPlaying = false;
    }
}
const data = [
    "India, officially the Republic of India, is a country in South Asia. It is the seventh-largest country by area, the second-most populous country, and the most populous democracy in the world. Bounded by the Indian Ocean on the south, the Arabian Sea on the southwest, and the Bay of Bengal on the southeast, it shares land borders with Pakistan to the west; China, Nepal, and Bhutan to the north; and Bangladesh and Myanmar to the east. In the Indian Ocean, India is in the vicinity of Sri Lanka and the Maldives; its Andaman and Nicobar Islands share a maritime border with Thailand, Myanmar and Indonesia.",
    "The English Wikipedia is the English-language edition of the free online encyclopedia Wikipedia. It was founded on 15 January 2001 as Wikipedia's first edition and, as of October 2021, has the most articles of any edition, at 6,402,766. As of October 2021, 11% of articles in all Wikipedias belong to the English-language edition. This share has gradually declined from more than 50 percent in 2003, due to the growth of Wikipedias in other languages. The edition's one-billionth edit was made on 13 January 2021. The English Wikipedia has received praise for its enablement of democratization of knowledge and extent of coverage.",
    "The cheetah is a large cat native to Africa and central Iran. It is the fastest land animal, estimated to be capable of running at 80 to 128 km/h (50 to 80 mph) with the fastest reliably recorded speeds being 93 and 98 km/h (58 and 61 mph), and as such has several adaptations for speed, including a light build, long thin legs and a long tail. It typically reaches 67-94 cm (26-37 in) at the shoulder, and the head-and-body length is between 1.1 and 1.5 m (3 ft 7 in and 4 ft 11 in). Adults weigh between 21 and 72 kg (46 and 159 lb). Its head is small, rounded, and has a short snout and black tear-like facial streaks.",
    "Tesla, Inc. is an American electric vehicle and clean energy company based in Palo Alto, California, United States. The company announced plans to move its headquarters to Austin, Texas. Tesla designs and manufactures electric cars, battery energy storage from home to grid-scale, solar panels and solar roof tiles, and related products and services. In 2020, Tesla had the most sales of battery electric vehicles and plug-in electric vehicles, capturing 16% of the plug-in market (which includes plug-in hybrids) and 23% of the battery-electric (purely electric) market. Through its subsidiary Tesla Energy, the company develops and is a major installer of photovoltaic systems in the United States.",
    "A crossover, crossover SUV, or crossover utility vehicle (CUV) is a type of sport utility vehicle-like vehicle built with unibody frame construction. A term that originated from North America, crossovers are based on a platform shared with a passenger car, as opposed to a platform shared with a pickup truck. Because of that, crossovers may also be referred as 'car-based SUVs'. Compared to truck-based SUVs, they typically have better interior comfort, a more comfortable ride, better fuel economy, and lower manufacturing costs, but also inferior off-road and towing capability. Forerunners of the modern crossover include the 1977 Matra Rancho and the AMC Eagle introduced in 1979.",
    "Christianity remains culturally diverse in its Western and Eastern branches, as well as in its doctrines concerning justification and the nature of salvation, ecclesiology, ordination, and Christology. The creeds of various Christian denominations generally hold in common Jesus as the Son of God-the Logos incarnated-who ministered, suffered, and died on a cross, but rose from the dead for the salvation of mankind; and referred to as the gospel, meaning the 'good news'. Describing Jesus' life and teachings are the four canonical gospels of Matthew, Mark, Luke and John, with the Old Testament as the gospel's respected background.",
    "Norse or Scandinavian mythology is the body of myths of the North Germanic peoples, stemming from Norse paganism and continuing after the Christianization of Scandinavia, and into the Scandinavian folklore of the modern period. The northernmost extension of Germanic mythology and stemming from Proto-Germanic folklore, Norse mythology consists of tales of various deities, beings, and heroes derived from numerous sources from both before and after the pagan period, including medieval manuscripts, archaeological representations, and folk tradition."
   , "and for myself"
]
let firstWord = true;
let stopwatch;
let currentText = data[Math.floor(Math.random() * data.length)];
let seek = 0;
const stats = {
    wrongs: 0,
    rights: 0,
    accuracy: 0,
    time: 0,
    wpm: 0,
    words: 0,
}
let runAnimation;
let idleAnimation;
let deadAnimation;
const runAudio = new CustomAudio('assets/running.mp3', true);
const fallAudio = new CustomAudio('assets/fall.mp3', true);
/**update the typing reference paragraph. */
var updateText = () => {
    document.querySelector('#type').innerHTML = `<span style="
    position: absolute;
    background: transparent;
">${currentText.slice(0, seek)}_</span>` + (currentText.slice(0, seek) + '<strong>' +currentText.slice(seek, currentText.length) + '</strong>');
}

/**@argument showAnim is played; while @argument hideAnim is stopped. */
var showHideAnim = (showAnim, hideAnim) => {
    hideAnim.visible = false;
    showAnim.visible = true;
    idleAnimation.visible = false;
    hideAnim.stop();
    showAnim.play();
    idleAnimation.stop();
}

/**generate an array of file name strings to be used to make animationbase */
var generateAnimArray = (animName) => {
    const textures = [];
    for (let index = 0; index < 10; index++) {
        textures.push(`${animName}__00${index}.png`);
    }
    return textures;
}

/**Initializes the stopwatch measuring the elapsed time */
var startTimer = () => {
    if (firstWord) {
        runAudio.play();
        firstWord = false;
    }
    stopwatch = setInterval(() => {
        stats.time = stats.time + 50;
        this.updateMeters();
    }, 50)
}

/**update meters and statistics */
var updateMeters = () => {
    let totalseconds = Math.floor(stats.time / 1000);
    let minutes = Math.floor(totalseconds / 60);
    let seconds = totalseconds - (60 * minutes);
    let mili = stats.time - (totalseconds * 1000);
    stats.elapsedTime = (minutes && `${minutes} minutes, `) + (seconds && `${seconds} seconds, `) + (mili && `${mili} miliseconds`);
    stats.wpm = Math.floor((stats.words * 1000 * 60) / stats.time);
    stats.accuracy = ((stats.rights) / (stats.rights + stats.wrongs)) * 100 + '%';
    document.querySelector('#time').innerHTML = `0${minutes}:${seconds > 9 ? "" : "0"}${seconds}`
    document.querySelector('#wpm').innerHTML = stats.wpm;
}
/**handler for button down event */
var startTyping = (char) => {
    switch (char.key) {
        case 'Shift': break;
        case 'Control': break;
        default:
            (firstWord) && (this.startTimer())
            if (currentText[seek] == char.key) {
                if(stats.words > 2){
                currentText = currentText.slice(1);
                }
                else{
                    seek++;
                }
                stats.rights++;
                (char.key == " ") && stats.words++;
                this.showHideAnim(runAnimation, deadAnimation);
                runAudio.play();
                fallAudio.pause();
            }
            else {
                this.showHideAnim(deadAnimation, runAnimation)
                stats.wrongs++;
                runAudio.pause();
                fallAudio.play();
            }
            this.updateText();
    }
    if (seek >= currentText.length) {
        currentText= '';
        this.updateText();
        stats.words++;
        clearInterval(stopwatch);
        document.querySelector('canvas').style.display = 'none';
        document.querySelector('#stats').style.display = 'block';
        runAudio.pause();
        fallAudio.pause();
        let statsElement = '';
        this.updateMeters();
        Object.entries(stats).forEach((property) => {
            statsElement = statsElement + `<srong>${property[0]} :</strong>&nbsp;&nbsp;<span>${property[1]}</span><br>`;
        });
        document.querySelector('#stats').innerHTML = statsElement;
        removeEventListener("keydown", this.startTyping, this);
    }
}

addEventListener("keydown", this.startTyping, this);
/**creates the animation and adds to stage
 * @argument name: alse the initials of frames.
 * @argument base: to be added to either stage/container. 
 */
var animationBase = (name, base, visible, speed, loop, play) => {
    const imageArray = this.generateAnimArray(name);
    const textureArray = [];
    for (let image of imageArray) {
        const texture = PIXI.Texture.from('assets/' + image);
        textureArray.push(texture);
    }
    const animation = new PIXI.AnimatedSprite(textureArray);
    animation.visible = visible;
    animation.animationSpeed = speed;
    animation.loop = loop;
    base.addChild(animation);
    (play) && animation.play();
    return animation;
}

/**Initializes pixi environment */
var pixiInit = () => {
    let app = new PIXI.Application({ width: document.querySelector('#type').clientWidth, height: 550 });
    document.body.appendChild(app.view);
    runAnimation = this.animationBase("Run", app.stage, false, 0.2, true, false);
    deadAnimation = this.animationBase("Dead", app.stage, false, 0.3, false, false);
    idleAnimation = this.animationBase("Idle", app.stage, true, 0.2, true, true);
}

this.updateText();
this.pixiInit();
