const express = require('express');
const sharp = require('sharp');
const axios = require('axios');
const app = express();
const port = 3000;
const fs = require('fs');

app.get('/', async (req, res) => {
  const imageUrl = req.query.url;
  const width = req.query.width ? parseInt(req.query.width) : undefined;
  const height = req.query.height ? parseInt(req.query.height) : undefined;
  const crop = req.query.crop === 'true';
  const bw = req.query.bw === 'true';
  const format = req.query.format || 'jpeg';
  const rotate = req.query.rotate ? parseInt(req.query.rotate) : undefined;
  const filter = req.query.filter || 'none';
  const watermark = req.query.watermark;
//url parameters.

  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    if (response.status !== 200) {
      res.status(400).send('Invalid URL');
      return;
    } //checking if correct URL is provided.

    let image = sharp(response.data);
    if (rotate) {
      image = image.rotate(rotate);
    } //condition check for image rotation.

    if (width && height) { 
      if (crop) {
        image = image.resize(width, height, { fit:'cover'});
      }
      else {
        image = image.resize(width, height,{fit:'fill'});
      }
    } //condition check for image cropping, if true then crop the image as per parameters else resize the image according to parameters.
    else if(width){
      image=image.resize(width);
    }
    else if(height){
      image=image.resize(null,height);
    }
    else{
      image = image.resize(500, 500, { fit: 'inside' });
    }
    if (filter === 'sepia') {
      image = image.modulate({ saturation: 50, hue: 100, brightness: 100 });
    } else if (filter === 'blur') {
      image = image.blur(5);
    } else if (filter === 'sharpen') {
      image = image.sharpen(2);
    } //filter options:sepia,blur and sharpen, parameters can be altered here as per requirement.

    if (bw) {
      image = image.grayscale();
    } //boolean value for black-white image

   if (watermark) {
      const watermarkBuffer = await axios.get(watermark, { responseType: 'arraybuffer' }); 
      if (watermarkBuffer.status === 200) {
        const watermark = sharp(watermarkBuffer.data);
        const watermarkResized = watermark.resize({
          width: 100,
          height: 100
        }); // resizing the watermark picture to suit the main image, parameters can be altered here as per requirement
        image = image.composite([{ input: await watermarkResized.toBuffer(), gravity: 'southeast' }]);
      } //composite image resized and placed on the southeast end of picture, can be altered as per requirement too.
    } //watermark addition to the code

    let sharpFormat = format.toLowerCase();
    if (!sharp.format.hasOwnProperty(sharpFormat)) {
      sharpFormat = 'jpeg';
    } //checking if the image has vaid format parameter in url(like png, jpg,jpeg etc), if it does not then set the format to 'jpeg' by default.
    
    const manipulatedImageBuffer = await image.toFormat(sharpFormat).toBuffer();   //for the main image

    res.set('Content-Type', `image/${sharpFormat}`);
    res.send(manipulatedImageBuffer);
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status) {
      res.status(error.response.status).send(error.response.statusText);
    } else {
      res.status(500).send('Error processing or manipulating the image');
    } // error message if manipulation fails or some parameter is given wrong input.
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});