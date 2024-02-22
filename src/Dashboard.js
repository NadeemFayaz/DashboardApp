import React, { useState, useRef, useEffect } from "react";
import { SketchPicker } from "react-color"; // import color picker component

const Dashboard = () => {
  const initialImages = [
    { id: 1, src: "images/001.png" },
    { id: 2, src: "images/002.png" },
    { id: 3, src: "images/003.png" },
    { id: 4, src: "images/004.png" },
    { id: 5, src: "images/005.png" },
    { id: 6, src: "images/006.png" },
    { id: 7, src: "images/007.png" },
    { id: 8, src: "images/008.png" },
  ];
  const [images, setImages] = useState(initialImages);
  const [imageOrder, setImageOrder] = useState(() => {
    const savedOrder = localStorage.getItem("imageOrder");
    return savedOrder ? JSON.parse(savedOrder) : images;
  });
  const [themeColor, setThemeColor] = useState(() => {
    const savedColor = localStorage.getItem("themeColor");
    return savedColor || "#000000";
  });

  const dragItem = useRef();
  const dragItemNode = useRef();

  useEffect(() => {
    localStorage.setItem("imageOrder", JSON.stringify(imageOrder));
    localStorage.setItem("themeColor", themeColor);
  }, [imageOrder, themeColor]);

  const handleDragStart = (e, item) => {
    dragItemNode.current = e.target;
    dragItemNode.current.addEventListener("dragend", handleDragEnd);
    dragItem.current = item;
  };

  const handleDragEnter = (e, targetItem) => {
    if (dragItemNode.current !== e.target) {
      setImageOrder((oldList) => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList[targetItem.index] = oldList[dragItem.current.index];
        newList[dragItem.current.index] = oldList[targetItem.index];
        dragItem.current = targetItem;
        return newList;
      });
    }
  };

  const handleDragEnd = () => {
    dragItem.current = null;
    dragItemNode.current.removeEventListener("dragend", handleDragEnd);
    dragItemNode.current = null;
  };

  const handleAddImage = (src) => {
    const newImage = { id: images.length + 1, src };
    setImages((oldImages) => [...oldImages, newImage]);
    setImageOrder((oldOrder) => [...oldOrder, newImage]);
  };

  const handleRemoveImage = (id) => {
    setImages((oldImages) => oldImages.filter((image) => image.id !== id));
    setImageOrder((oldOrder) => oldOrder.filter((image) => image.id !== id));
  };

  const handleColorChange = (color) => {
    setThemeColor(color.hex);
  };

  const handleReset = () => {
    setImages(initialImages);
    setImageOrder(initialImages);
    setThemeColor("#000000");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddImage(e.target.elements.src.value);
          }}
        >
          <input name="src" type="text" placeholder="Image URL" required style={{ margin: "10px" }} />
          <button type="submit" style={{ margin: "0 10px" }}>Add Image</button>
        </form>
        <button onClick={handleReset} style={{ margin: "5px 10px" }} >Reset</button>
        <div style={{ margin: "0 10px" }}>
          <SketchPicker color={themeColor} onChangeComplete={handleColorChange} />
        </div>
      </div>
      <div
        style={{ width: "100vw", display: "flex", justifyContent: "center" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(2, 200px)`,
            backgroundColor: themeColor,
          }}
        >
          {imageOrder.map((image, index) => (
            <div
              key={index}
              draggable
              onDragStart={(e) => handleDragStart(e, { index })}
              onDragEnter={
                dragItem.current !== index
                  ? (e) => handleDragEnter(e, { index })
                  : null
              }
              style={{
                gridColumn:
                  index === 0 || index === imageOrder.length - 1
                    ? "span 2"
                    : "span 1",
                position: "relative",
              }}
            >
              <div
                style={{ position: "relative" }}
                onMouseOver={(e) =>
                  (e.currentTarget.children[1].style.display = "block")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.children[1].style.display = "none")
                }
              >
                <img
                  src={image.src}
                  alt={`${image.id}`}
                  style={{ width: "100%", height: "auto" }}
                />
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    display: "none",
                    backgroundColor: "transparent",
                    border: "none",
                    fontSize: "1.5em",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
