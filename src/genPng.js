export default function genPNG() {
	var img = new Image();
	// create and customize the canvas
	var canvas = document.createElement("canvas");
	canvas.width = 500;
	canvas.height = 200;
	document.body.appendChild(canvas);
	// get the context
	var ctx = canvas.getContext("2d");
	// draw the image into the canvas
	ctx.drawImage(img, 0, 0);

	// get the image data object
	var image = ctx.getImageData(0, 0, 500, 200);
	// get the image data values 
	var imageData = image.data,
		length = imageData.length;
	// set every fourth value to 50
	for(var i=3; i < length; i+=4){  
		imageData[i] = 50;
	}
	// after the manipulation, reset the data
	image.data = imageData;
	// and put the imagedata back to the canvas
	ctx.putImageData(image, 0, 0);

	img.src = canvas.toDataURL();
	return img;
}
