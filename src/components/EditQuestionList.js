import React, { useMemo } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EditQuestion from './EditQuestion';

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const EditQuestionList = ({ questions, order, onQuestionChange, onQuestionDelete, onReorder }) => {
    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const items = reorder(order, result.source.index, result.destination.index);
        onReorder(items);
    };
    const orderedQuestions = useMemo(() => order.map((id) => questions.find((i) => i.id === id)), [
        order,
        questions,
    ]);
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {orderedQuestions.map(
                            (question, index) =>
                                question && (
                                    <Draggable
                                        key={question.id}
                                        draggableId={question.id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <EditQuestion
                                                    question={question}
                                                    id={question.id}
                                                    onChange={onQuestionChange}
                                                    onDelete={onQuestionDelete}
                                                    key={question.id}
                                                    index={index + 1}
                                                />
                                            </div>
                                        )}
                                    </Draggable>
                                ),
                        )}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default EditQuestionList;
