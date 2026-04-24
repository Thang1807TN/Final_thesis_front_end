import { useMemo, useState } from "react";

function ProductImageGallery({ images = [] }) {
  const normalizedImages = useMemo(() => {
    return images.length
      ? images
      : ["https://via.placeholder.com/700x500?text=No+Image"];
  }, [images]);

  const [selectedImage, setSelectedImage] = useState(normalizedImages[0]);

  return (
    <div className="product-gallery">
      <div className="product-gallery-main card">
        <img
          src={selectedImage}
          alt="Selected product"
          className="product-gallery-main-image"
        />
      </div>

      <div className="product-gallery-thumbs">
        {normalizedImages.map((image, index) => (
          <button
            key={`${image}-${index}`}
            className={`product-gallery-thumb ${selectedImage === image ? "active" : ""}`}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image} alt={`Product ${index + 1}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductImageGallery;
