const getCroppedImg = (imageSrc, croppedAreaPixels) => {
    const createImage = (url) =>
      new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
        image.src = url;
      });
  
    const getCroppedImg = async (imageSrc, crop) => {
      const image = await createImage(imageSrc);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
  
      canvas.width = crop.width;
      canvas.height = crop.height;
  
      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );
  
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error("Canvas is empty");
            return;
          }
          const fileUrl = window.URL.createObjectURL(blob);
          resolve(fileUrl);
        }, "image/jpeg");
      });
    };
  
    return getCroppedImg(imageSrc, croppedAreaPixels);
  };
  
export default getCroppedImg;