import React from 'react';
import { Draggable } from 'react-beautiful-dnd';

const Module = ({ image }) => {
    return (
      <Draggable draggableId={image.id.toString()} index={image.id - 1}>
        {(provided) => (
          <div
            className="module"
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <img src={image.src} alt={`image-${image.id}`} />
          </div>
        )}
      </Draggable>
    );
  };

export default Module;
