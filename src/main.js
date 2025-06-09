import jsQr from 'jsqr';
import { PNG } from 'pngjs/browser';

document.addEventListener('paste', async e => {
  // @ts-ignore
  const imageItem = [...e.clipboardData?.items].find(i => i.kind === 'file');
  if(!imageItem){
    output('Cannot read data: is not a image');
    return; 
  }
  const data = await parseImageItemAsQR(imageItem);
  output(data);
});

async function parseImageItemAsQR(img){
  const file = img.getAsFile();
  if(file.type !== 'image/png'){
    return 'Cannot read data: is not an image ';
  }
  const imgBuffer = await img.getAsFile().arrayBuffer()
  const pngout = await new Promise(resolve => {
    new PNG().parse(imgBuffer, (_,d) => resolve(d));
  });
  
  return jsQr(pngout.data, pngout.width, pngout.height)?.data ?? 'QR code failed to parse';
}

function output(data){
  document.getElementById('result').innerText = data;
}