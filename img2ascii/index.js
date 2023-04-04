const container = d3.select("#canvasContainer");
const canvas = container.append("canvas").node();
const context = canvas.getContext("2d");

const imageInput = document.querySelector("#imageInput");
imageInput.addEventListener("change", handleImageUpload);

function handleImageUpload() {
  const file = this.files[0];
  const reader = new FileReader();
  reader.onload = function () {
    const image = new Image();
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0);

      const asciiCanvas = container.append("pre").style("font-size", "8px");
      asciiCanvas.text(convertToAscii(canvas));
    };
    image.src = reader.result;
  };
  reader.readAsDataURL(file);
}

function convertToAscii(canvas) {
  const asciiChars = ["@", "#", "S", "%", "?", "*", "+", ";", ":", ",", "."];
  const asciiCanvas = [];

  for (let y = 0; y < canvas.height; y += 10) {
    let asciiRow = "";
    for (let x = 0; x < canvas.width; x += 5) {
      const imageData = context.getImageData(x, y, 5, 10);
      const brightness = getBrightness(imageData);
      const asciiChar = asciiChars[Math.floor(brightness / 25.5)];
      asciiRow += asciiChar;
    }
    asciiCanvas.push(asciiRow);
  }

  return asciiCanvas.join("\n");
}

function getBrightness(imageData) {
  let brightness = 0;
  for (let i = 0; i < imageData.data.length; i += 4) {
    const red = imageData.data[i];
    const green = imageData.data[i + 1];
    const blue = imageData.data[i + 2];
    brightness += (0.2126 * red + 0.7152 * green + 0.0722 * blue);
  }
  return brightness / (imageData.data.length / 4);
}
