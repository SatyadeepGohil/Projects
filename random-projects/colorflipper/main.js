let display = document.getElementById("display");
let button = document.getElementById("button");
let colorname = document.getElementById("color-name");
const canvas = document.getElementById("display-gradient");
const ctx = canvas.getContext("2d");
const colorHistory = [];

const colors = [
  "#2E3192", "#1BFFFF", "#D4145A", "#FBB03B", "#009245", 
  "#FCEE21", "#662D8C", "#ED1E79", "#EE9CA7", "#FFDDE1", 
  "#614385", "#516395", "#02AABD", "#00CDAC", "#FF512F", 
  "#DD2476", "#FF5F6D", "#FFC371", "#11998E", "#38EF7D", 
  "#C6EA8D", "#FE90AF", "#EA8D8D", "#A890FE", "#D8B5FF", 
  "#1EAE98", "#FF61D2", "#FE9090", "#BFF098", "#6FD6FF", 
  "#4E65FF", "#92EFFD", "#A9F1DF", "#FFBBBB", "#C33764", 
  "#1D2671", "#93A5CF", "#E4EfE9", "#868F96", "#596164", 
  "#09203F", "#537895", "#FFECD2", "#FCB69F", "#A1C4FD", 
  "#C2E9FB", "#764BA2", "#667EEA", "#FDFCFB", "#E2D1C3",
  "#FBB03B", "#009245", "#FCEE21", "#662D8C", "#ED1E79", 
  "#EE9CA7", "#FFDDE1", "#614385", "#516395", "#02AABD", 
  "#00CDAC", "#FF512F", "#DD2476", "#FF5F6D", "#FFC371", 
  "#11998E", "#38EF7D", "#C6EA8D", "#FE90AF", "#EA8D8D", 
  "#A890FE", "#D8B5FF", "#1EAE98", "#FF61D2", "#FE9090", 
  "#BFF098", "#6FD6FF", "#4E65FF", "#92EFFD", "#A9F1DF", 
  "#FFBBBB", "#C33764", "#1D2671", "#93A5CF", "#E4EfE9", 
  "#868F96", "#596164", "#09203F", "#537895", "#FFECD2", 
  "#FCB69F", "#A1C4FD", "#C2E9FB", "#764BA2", "#667EEA", 
  "#FDFCFB", "#E2D1C3"
];




button.addEventListener("click", () => {
    let randomIndex = Math.floor(Math.random() * colors.length);
    let random = colors[randomIndex];
    display.style.backgroundColor = random;
    colorname.innerText = `Background Color: ${random}`;
    button.style.backgroundColor = random;

    const gradient = ctx.createLinearGradient(0,0,300,0);
    colorHistory.push(random);

    if (colorHistory.length > 2) {
        colorHistory.shift();
    }
    console.log(colorHistory);
    gradient.addColorStop(0,colorHistory[0]);
    gradient.addColorStop(1,colorHistory[colorHistory.length - 1]);

    ctx.fillStyle = gradient;
    ctx.fillRect(0,0, canvas.width,canvas.height);

    let linearGradientColors = [];

    colorHistory.forEach(color => {
      linearGradientColors.push(`${color}`);
    });

    linearGradientColors = linearGradientColors.join(', ');
    console.log(linearGradientColors)
    canvas.style.setProperty('--gradients-colors',linearGradientColors);

    canvas.style.boxShadow = `10px 10px 30px ${colorHistory[0]}`;
    //canvas.style.boxShadow = `20px 20px 10px ${colorHistory[colorHistory.length - 1]}`;
});

