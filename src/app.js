const BACKGROUNDCOLOR = "#fff";
const APPNAME = "darkweb";

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function makeCards(cardsCount) {
  const colorArr = [
    "#74d2e7",
    "#84bd00",
    "#efdf00",
    "#fe5000",
    "#da1884",
    "#a51890",
    "#0077c8",
    "#008eaa",
    "#005670",
    "#009f4d",
    "#e4002b",
    "#5e412f"
  ];
  shuffle(colorArr);
  const cardsArr = new Array(+cardsCount);

  let colorPosition = 0;

  for (let i = 0; i < cardsArr.length / 2; i++) {
    const color = colorArr[colorPosition];

    cardsArr[i] = color;
    cardsArr[cardsArr.length - 1 - i] = color;

    if (colorPosition === colorArr.length - 1) {
      colorPosition = 0;
    } else {
      colorPosition++;
    }
  }
  shuffle(cardsArr);
  return cardsArr;
}

export default {
  name: "App",

  data() {
    return {
      cards: [],
      cardsCount: "10",
      compareCardsArr: [],
      stepCount: 0,
      guessCardsCount: 0,
      bestResult: 0
    };
  },

  methods: {
    resetGame() {
      this.cards = [];
      this.stepCount = 0;
      this.guessCardsCount = 0;
    },

    startGame() {
      this.resetGame();
      this.loadBestResult();
      setTimeout(() => {
        this.cards = [...makeCards(this.cardsCount)];
      }, 0);
    },

    compareCards(id, color, targetEl) {
      // console.log(id, color);
      if (this.compareCardsArr.length === 0) {
        this.stepCount++;
        this.compareCardsArr = [id, color, targetEl];
        return;
      }
      const [compareId, compareColor, compareTargetEl] = this.compareCardsArr;
      if (id === compareId) {
        return;
      } else {
        if (color === compareColor) {
          // console.log("Цвет совпал");
          targetEl.classList.add("cards__item_disabled");
          compareTargetEl.classList.add("cards__item_disabled");
          this.guessCardsCount += 2;
          setTimeout(() => {
            this.checkStopGame();
          }, 500);
        } else {
          targetEl.style.backgroundColor = BACKGROUNDCOLOR;
          compareTargetEl.style.backgroundColor = BACKGROUNDCOLOR;
        }
        this.compareCardsArr = [];
        this.stepCount++;
      }
    },

    selectCard(evt) {
      const targetEl = evt.target;
      if (!targetEl.classList.contains("cards__item")) {
        return;
      }
      const id = evt.target.id;
      const color = this.cards[id];
      targetEl.style.backgroundColor = color;
      setTimeout(() => {
        this.compareCards(id, color, targetEl);
      }, 1100);
    },

    checkStopGame() {
      if (this.cardsCount == this.guessCardsCount) {
        this.saveBestResult();
        alert(`Игра окончена. Ваш результат ${this.stepCount} ходов`);
      }
    },

    saveBestResult() {
      const result = {
        [this.cardsCount]: this.stepCount
      };
      localStorage.setItem(APPNAME, JSON.stringify(result));
    },

    loadBestResult() {
      const result = JSON.parse(localStorage.getItem(APPNAME));
      const bestResult = result[this.cardsCount];
      this.bestResult = bestResult || 0;
    }
  }
};